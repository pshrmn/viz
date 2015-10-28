queue()
  .defer(d3.json, "./data/us.json")
  .defer(d3.json, "./data/bigtenteams.json")
  .defer(d3.json, "./data/bigten.json")
  .await(function(error, states, teams, rosters) {
    if ( error !== null ) {
      console.error(error);
      return;
    }

    // setup
    var margin = {top: 15, right: 15, bottom: 15, left: 15};
    var width = 1200;
    var height = 800;
    var scale = 1400;
    var projection = d3.geo.albersUsa()
      .scale(scale)
      .translate([width/2, height/2]);
    var path = d3.geo.path()
      .projection(projection);
    var opacity = 0.25;
    var radius = 5;


    // setup additional info for the teams
    teams.forEach(function(team, index) {
      // roster points, converted from coordinates to points in the projection
      var key = team.name.toLowerCase();
      team.coords = rosters[key];
      team.points = team.coords.map(function(spot) {
        return projection(spot);
      });

      team.selected = index === 0;

      // determine the mean and median distance for each player from the school
      // using the projected distances
      var universityLocation = [team.longitude, team.latitude];
      team.schoolCoords = projection(universityLocation);
      var distances = team.points.map(function(spot) {
        return distance(spot, team.schoolCoords)
      })
      // sort for the median
      distances.sort(function(a, b) { return a-b;});

      // determine the mean distance from each player's hometown to the school
      var mean = distances.reduce(function(oldSum, newVal) {
        return oldSum + newVal;
      }, 0) / distances.length;

      // determine the median distance from each player's hometown to the school
      var half = Math.floor(distances.length / 2);
      var median = (half % 2 === 0) ?
        (distances[half] + distances[half-1]) / 2 :
        distances[half];

      team.median = median;
      team.mean = mean;

      // find a point the mean/median distance away in the projection, invert it
      // to get coordinates, then use haversine to determine the real world distance
      var meanPoint = [team.schoolCoords[0] + mean, team.schoolCoords[1]];
      var medianPoint = [team.schoolCoords[0] + median, team.schoolCoords[1]];
      var meanCoordinates = projection.invert(meanPoint);
      var medianCoordinates = projection.invert(medianPoint);

      team.meanMiles = haversine(meanCoordinates, universityLocation);
      team.medianMiles = haversine(medianCoordinates, universityLocation);
    });

    // create the svg and projection
    var holder = d3.select("#content");

    // controls
    var controls = holder.append("div")
      .classed({
        controls: true
      })

    // not really a form ;)
    var form = controls.append("div")
      .classed({
        "teams-holder": true
      });

    form.selectAll("label")
        .data(teams)
      .enter().append("label")
        .text(function(d) {
          return d.name
        })
        .append("input")
          .attr("type", "checkbox")
          .attr("name", "team")
          .property("checked", function(d) {
            return d.selected;
          })
          .on("change", function(d) {
            d.selected = this.checked;
            teamHolders.classed({
              hidden: function(d) { return !d.selected; }
            });
          });

    // control opacity/radius
    var visInputs = controls.append("div")
    visInputs.append("span")
      .text("Radius")
      .append("input")
        .attr("type", "range")
        .attr("value", radius)
        .attr("step", 1)
        .attr("min", 1)
        .attr("max", 15)
        .on("change", function() {
          radius = this.value;
          players.attr("r", this.value);
        });

    visInputs.append("span")
      .text("Opacity")
      .append("input")
        .attr("type", "range")
        .attr("value", opacity)
        .attr("step", 0.05)
        .attr("min", 0.05)
        .attr("max", 1)
        .on("change", function() {
          opacity = this.value;
          players.style("opacity", this.value);
        });


    /*
     * The map
     */
    var svg = holder.append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // draw the map
    var stateData = topojson.feature(states, states.objects.states).features;
    var states = svg.append("g")
      .classed("country", true)
      .selectAll("g.state")
          .data(stateData)
        .enter().append("g")
          .classed("state", true)
          .append("path")
            .classed("outline", true)
            .attr("d", path);

    // draw the player locations
    var teamHolders = svg.append("g")
      .classed({
        "teams": true
      })
      .selectAll("g.team")
          .data(teams)
        .enter().append("g")
          .classed({
            team: true,
            hidden: function(d) { return !d.selected }
          })
          .style("fill", function(d) { return d.color; })

    var schools = teamHolders.append("g")
      .classed({
        school: true
      });

    var players = teamHolders.append("g")
      .classed({
        "players": true
      })
      .selectAll("circle.player")
        .data(function(d){
          return d.points
        })
      .enter().append("circle")
        .classed({
          player: true
        })
        .attr("r", radius)
        .style("opacity", opacity)
        .attr("cx", function(d){ return d[0]; })
        .attr("cy", function(d){ return d[1]; });

    // mean recruiting distance
    schools.append("circle")
      .classed({
        mean: true
      })
      .attr("r", function(d) {
        return d.mean;
      })
      .attr("cx", function(d) {
        return d.schoolCoords[0];
      })
      .attr("cy", function(d) {
        return d.schoolCoords[1];
      });

    // mean recruiting distance
    schools.append("circle")
      .classed({
        median: true
      })
      .attr("r", function(d) {
        return d.median;
      })
      .attr("cx", function(d) {
        return d.schoolCoords[0];
      })
      .attr("cy", function(d) {
        return d.schoolCoords[1];
      })

    // the location of the school
    schools.append("circle")
      .classed({
        location: true
      })
      .attr("r", 5)
      .attr("cx", function(d) {
        return d.schoolCoords[0];
      })
      .attr("cy", function(d) {
        return d.schoolCoords[1];
      });
  });


/*
 * Functions for determining distances
 */
function distance(start, end) {
  return Math.sqrt(
    Math.pow((end[0]-start[0]), 2) + Math.pow((end[1]-start[1]), 2)
  );
}

function haversine(start, end){
  var R = 3963.1676
  var start_lat = toRads(start[1]);
  var start_cos = Math.cos(start_lat);

  var end_lat = toRads(end[1]);
  var end_cos = Math.cos(end_lat)

  var lat_delta = toRads(end[1] - start[1]);
  var lat_delta_sin = Math.pow(Math.sin(lat_delta/2), 2)

  var long_delta = toRads(end[0] - start[0]);
  var long_delta_sin = Math.pow(Math.sin(long_delta/2), 2);

  var a = lat_delta_sin + (start_cos * end_cos * long_delta_sin)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return Math.round(R*c, 10);
}

function toRads(num){
  return num * Math.PI / 180;
}
