queue()
  .defer(d3.json, "./data/us.json")
  //.defer(d3.json, "./data/teams.json")
  //.defer(d3.json, "./data/rosters.json")
  .defer(d3.json, "./data/accteams.json")
  .defer(d3.json, "./data/acc.json")
  .await(function(error, states, teams, rosters) {
    if ( error !== null ) {
      console.error(error);
      return;
    }
    // setup
    var margin = {top: 15, right: 15, bottom: 15, left: 15};
    var width = 800;
    var height = 500;
    var scale = 1000;
    var projection = d3.geo.albersUsa()
      .scale(scale)
      .translate([width/2, height/2]);
    var path = d3.geo.path()
      .projection(projection);

    var opacity = 0.5;
    var radius = 3;

    var drawSchools = true;
    var drawMedians = true;
    var drawMeans = true;


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
    var svg = holder.append("div")
      .classed({
        "map-holder": true
      })
      .append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var teamSelector = holder.append("div")
      .classed({
        "teams-holder": true
      });

    // controls to change how the data is rendered
    var controls = holder.append("div")
      .classed({
        controls: true
      })

    // not really a form ;)

    teamSelector.selectAll("label")
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
            playersLayer.classed({
                hidden: function(d) { return !d.selected; }
              });
            schools.classed({
                hidden: function(d) { return !d.selected; }
              });
            medians.classed({
                hidden: function(d) { return !d.selected; }
              });
            means.classed({
                hidden: function(d) { return !d.selected; }
              });
          });

    // control opacity/radius
    var visInputs = controls.append("div")

    /*
     * control the radius/opacity of players circles
     */
    var ranges = visInputs.append("div")
      .classed({
        "range-controls": true
      });

    ranges.append("span")
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

    ranges.append("span")
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
     * toggle the visibility of school, median, and mean circles
     */
    var toggles = visInputs.append("div")
      .classed({
        "sub-form": true
      });

    toggles.append("h3")
      .text("Toggle Indicators:");

    toggles.append("label")
      .text("Show Schools")
      .append("input")
        .attr("type", "checkbox")
        .attr("checked", drawSchools)
        .on("change", function(d) {
          drawSchools = !drawSchools;
          schoolsLayer.classed({
            "hidden": !drawSchools
          })
        });

    toggles.append("label")
      .text("Show Medians")
      .append("input")
        .attr("type", "checkbox")
        .attr("checked", drawMedians)
        .on("change", function(d) {
          drawMedians = !drawMedians;
          mediansLayer.classed({
            "hidden": !drawMedians
          })
        });

    toggles.append("label")
      .text("Show Means")
      .append("input")
        .attr("type", "checkbox")
        .attr("checked", drawMeans)
        .on("change", function(d) {
          drawMeans = !drawMeans;
          meansLayer.classed({
            "hidden": !drawMeans
          })
        });

    /*
     * control the position of player circles
     */
    var locationForm = controls.append("div")
      .classed({
        "sub-form": true
      });

    locationForm.append("h3")
      .text("Render Hometown Locations:")

    locationForm.append("label")
      .text("By correct location")
      .append("input")
        .attr("type", "radio")
        .property("checked", true)
        .attr("name", "location")
        .on("change", function() {
          byRealLocation(players);
        });

    locationForm.append("label")
      .text("By longitude")
      .append("input")
        .attr("type", "radio")
        .attr("name", "location")
        .on("change", function() {
          byLongitude(players);
        });

    locationForm.append("label")
      .text("By latitude")
      .append("input")
        .attr("type", "radio")
        .attr("name", "location")
        .on("change", function() {
          byLatitude(players);
        });


    /*
     * The map
     * Layers:
     *     states
     *     players
     *     schools
     *     medians
     *     means
     */

    /*
     * layers are created here, move them around here to determine
     * rendering order
     */

    var stateLayer = svg.append("g")
      .classed({
        country: true
      });

    var meansLayer = svg.append("g")
      .classed({
        means: true
      });

    var mediansLayer = svg.append("g")
      .classed({
        medians: true
      });

    var playersLayer = svg.append("g")
      .classed({
        teams: true
      })
      .selectAll("g.team")
          .data(teams)
        .enter().append("g")
          .classed({
            team: true,
            hidden: function(d) { return !d.selected }
          });
      
    var schoolsLayer = svg.append("g")
      .classed({
        schools: true
      });

    /*
     * STATE LAYER
     */
    var stateData = topojson.feature(states, states.objects.states).features;
    stateLayer.selectAll("g.state")
          .data(stateData)
        .enter().append("g")
          .classed("state", true)
          .append("path")
            .classed("outline", true)
            .attr("d", path);

    /*
     * PLAYERS LAYER
     */
    playersLayer.style("fill", function(d) { return d.color; })

    var players = playersLayer.selectAll("circle.player")
        .data(function(d){ return d.points })
      .enter().append("circle")
        .classed({
          player: true
        })
        .attr("r", radius)
        .style("opacity", opacity)
        .attr("cx", function(d){ return d[0]; })
        .attr("cy", function(d){ return d[1]; });

    /*
     * SCHOOLS LAYER
     */
    var schools = schoolsLayer.selectAll("circle.school")
        .data(teams)
      .enter().append("circle")
        .classed({
          school: true,
          hidden: function(d) { return !d.selected }
        })
        .style("fill", function(d) { return d.color; })
        .attr("r", 5)
        .attr("cx", function(d) { return d.schoolCoords[0]; })
        .attr("cy", function(d) { return d.schoolCoords[1]; })
    schools.append("title").text(function(d) { return d.name; });

    /*
     * MEDIANS LAYER
     */
    var medians = mediansLayer.selectAll("circle.median")
        .data(teams)
      .enter().append("circle")
        .classed({
          median: true,
          hidden: function(d) { return !d.selected }
        })
      .attr("r", function(d) { return d.median; })
      .attr("cx", function(d) { return d.schoolCoords[0]; })
      .attr("cy", function(d) { return d.schoolCoords[1]; })
    medians.append("title")
      .text(function(d) { return d.name + " median distance: " + d.medianMiles + " miles"; });
  
    /*
     * MEANS LAYER
     */
    var means = meansLayer.selectAll("circle.mean")
        .data(teams)
      .enter().append("circle")
        .classed({
          mean: true,
          hidden: function(d) { return !d.selected }
        })
        .attr("r", function(d) { return d.mean; })
        .attr("cx", function(d) { return d.schoolCoords[0]; })
        .attr("cy", function(d) { return d.schoolCoords[1]; });
    means.append("title")
      .text(function(d) { return d.name + " mean distance: " + d.meanMiles + " miles"; });
  });


function byLongitude(players) {
  players.transition()
    .duration(1000)
    .attr("cy", 0)
    .attr("cx", function(d){ return d[0]; });
}

function byLatitude(players) {
  players.transition()
    .duration(1000)
    .attr("cy", function(d){ return d[1]; })
    .attr("cx", 0);
}

function byRealLocation(players) {
  players.transition()
    .duration(1000)
    .attr("cy", function(d){ return d[1]; })
    .attr("cx", function(d){ return d[0]; });
}

/*
 * Functions for determining distances
 */
function distance(start, end) {
  return Math.sqrt(
    Math.pow((end[0]-start[0]), 2) + Math.pow((end[1]-start[1]), 2)
  );
}

function haversine(start, end){
  // equatorial radius
  var R = 3963.1906;
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
