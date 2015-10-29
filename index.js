/*
 * Setup that doesn't rely on having files loaded
 */
var margin = {top: 15, right: 15, bottom: 15, left: 15};
var width = 800;
var height = 500;
var scale = 1000;
// most important function for mapping
// this is used to convert coordinates to points in the svg
// (or reverse by calling projection.invert)
var projection = d3.geo.albersUsa()
  .scale(scale)
  .translate([width/2, height/2]);
var path = d3.geo.path()
  .projection(projection);

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

/*
 * SVG Layers:
 *     states
 *     players
 *     schools
 *     medians
 *     means
 *
 * layers are created here, move them around here to determine
 * rendering order
 */
var stateLayer = svg.append("g").classed("country", true);
var meansLayer = svg.append("g").classed("means", true);
var mediansLayer = svg.append("g").classed("medians", true);
var playersLayer = svg.append("g").classed("teams", true);
var schoolsLayer = svg.append("g").classed("schools", true);

/*
 * LOAD AND DRAW THE MAP
 */
queue()
  .defer(d3.json, "./data/us.json")
  .await(function(error, states) {
    if ( error !== null ) {
      console.error(error);
      return;
    }
    var stateData = topojson.feature(states, states.objects.states).features;
    stateLayer.selectAll("g.state")
        .data(stateData)
      .enter().append("g")
        .classed("state", true)
        .append("path")
          .classed("outline", true)
          .attr("d", path);
  });

/*
 * LOAD AND RENDER THE TEAMS/ROSTERS INFORMATION
 */
queue()
  .defer(d3.json, "./data/teams.json")
  .defer(d3.json, "./data/rosters.json")
  .await(function(error, teams, rosters) {
    if ( error !== null ) {
      console.error(error);
      return;
    }

    // the teams (don't overwrite teams)
    var teams = setupTeams(teams, rosters, projection);
    var filteredTeams = teams;

    // rendering variables
    var opacity = 0.5;
    var radius = 3;
    var drawSchools = true;
    var drawMedians = true;
    var drawMeans = true;

    // nested to show inheritance
    var teamFilter = holder.append("div").classed("team-filter", true);
      var filterButtons = teamFilter.append("div");
    var teamSelector = holder.append("div").classed("teams-holder", true);
    var controls = holder.append("div").classed("controls", true);
      var ranges = controls.append("div").classed("sub-form", true);
      var toggles = controls.append("div").classed("sub-form", true);
      var locationForm = controls.append("div").classed("sub-form", true);


    teamFilter.append("div").selectAll("label")
        .data(["All", "ACC", "Big 12", "Big Ten", "Pac-12", "SEC"])
      .enter().append("label")
        .text(function(d){ return d; })
        .append("input")
          .attr("type", "radio")
          .attr("name", "conference")
          .property("checked", function(d, i) {
            return i === 0;
          })
          .on("change", function(d) {
            filteredTeams = []
            if ( d === "All" ) {
              filteredTeams = teams;
            } else {
              var filter = filterConference(d);
              filteredTeams = filter(teams);
            }
            setTeams(teamSelector, filteredTeams)
          });

    /*
     * select all filtered teams
     */
    filterButtons.append("button")
      .text("Select All Teams")
      .on("click", function() {
        selectAllTeams(filteredTeams);
        setTeams(teamSelector, filteredTeams);
        rerender();
      });

    /*
     * deselect all filtered teams
     */
    filterButtons.append("button")
      .text("Deselect All Teams")
      .on("click", function() {
        deselectAllTeams(filteredTeams);
        setTeams(teamSelector, filteredTeams);
        rerender();
      });


    // controls to change how the data is rendered
    controls.append("h2")
      .text("Controls");


    // control the radius/opacity of players circles    
    ranges.append("h3")
      .text("Control Hometown Markers");

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
        .attr("min", 0)
        .attr("max", 1)
        .on("change", function() {
          opacity = this.value;
          players.style("opacity", this.value);
        });

    // toggle the visibility of school, median, and mean circles
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

    // control the position of player circles
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
     * PLAYERS LAYER
     */
    var playersTeams = playersLayer.selectAll("g.team")
      .data(teams)
    .enter().append("g")
      .classed({
        team: true,
        hidden: function(d) { return !d.selected }
      })
      .style("fill", function(d) { return d.color; });

    var players = playersTeams.selectAll("circle.player")
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


    /*
     * render the specified teams
     */
    function setTeams(holder, teams) {
      var shownTeams = holder.selectAll("label")
        .data(teams)
      shownTeams.enter().append("label")
      shownTeams
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
            rerender();
          });

        shownTeams.exit().remove();
    }

    function rerender() {
      playersTeams.classed({
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
    }

    // initial render
    setTeams(teamSelector, filteredTeams);
  });

function setupTeams(teams, rosters, projection) {
  // setup additional info for the teams
  var copy = teams.slice();
  copy.forEach(function(team, index) {
    team.selected = false;
    // roster points, converted from coordinates to points in the projection
    team.coords = rosters[team.name.toLowerCase()];
    team.points = projectedCoordinates(team.coords, projection);

    // determine the mean and median distance for each player from the school
    // using the projected distances
    var universityLocation = [team.longitude, team.latitude];
    team.schoolCoords = projection(universityLocation);

    var distances = teamDistances(team.points, team.schoolCoords);

    // sort for the median
    distances.sort(function(a, b) { return a-b;});

    // determine the mean distance from each player's hometown to the school
    var mean = distances.reduce(function(oldSum, newVal) {
      return oldSum + newVal;
    }, 0) / distances.length;
    team.mean = mean;

    // determine the median distance from each player's hometown to the school
    var half = Math.floor(distances.length / 2);
    var median = (half % 2 === 0) ?
      (distances[half] + distances[half-1]) / 2 :
      distances[half];
    team.median = median;

    // find a point the mean/median distance away in the projection, invert it
    // to get coordinates, then use haversine to determine the real world distance
    var meanPoint = [team.schoolCoords[0] + mean, team.schoolCoords[1]];
    var medianPoint = [team.schoolCoords[0] + median, team.schoolCoords[1]];
    team.meanMiles = realDistance(universityLocation, meanPoint, projection);
    team.medianMiles = realDistance(universityLocation, medianPoint, projection);

  });
  copy.sort(function(a, b) {
    if ( a.name < b.name ) {
      return -1;
    } else if ( a.name > b.name ) {
      return 1;
    } else {
      return 0;
    }
  });
  return copy;
}

/*
 * return an array containing all of the coordinates projected to their position
 * in the svg/map
 */
function projectedCoordinates(coords, projection) {
  return coords.map(function(spot) {
    return projection(spot);
  });
}

// return a (sorted) array of distances from hometowns to the school
// using the projected points in the svg/map
function teamDistances(coords, home) {
  return coords.map(function(spot) {
    return distance(spot, home);
  });
}

function realDistance(homeCoords, mapPoint, projection) {
  var mapCoords = projection.invert(mapPoint);
  return haversine(homeCoords, mapCoords);
}

/*
 * returns a function that takes a list of schools and only returns ones
 * for the specified conference
 */
function filterConference(name) {
  return function(teams) {
    return teams.filter(function(team) {
      return team.conference === name;
    });
  };
}

/*
 * draw hometown coordinates correctly, only by longitude, and only by latitude
 */
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

function selectAllTeams(teams){
  teams.forEach(function(team) {
    team.selected = true;
  });
}

function deselectAllTeams(teams){
  teams.forEach(function(team) {
    team.selected = false;
  });
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
