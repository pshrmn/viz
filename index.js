queue()
  .defer(d3.json, "./data/us.json")
  .await(function(error, states) {
    if ( error !== null ) {
      console.error(error);
      return;
    }

    var teamOptions = [
      {
        name: "Illinois",
        filename: "./data/illinois.json",
        color: "#E87722"
      },
      {
        name: "Indiana",
        filename: "./data/indiana.json",
        color: "#7D110C"
      },
      {
        name: "Iowa",
        filename: "./data/iowa.json",
        color: "#FFE100"
      },
      {
        name: "Maryland",
        filename: "./data/maryland.json",
        color: "#E03A3E"
      },
      {
        name: "Michigan",
        filename: "./data/michigan.json",
        color: "#00274C"
      },
      {
        name: "Michigan State",
        filename: "./data/michigan_state.json",
        color: "#18453B"
      },
      {
        name: "Minnesota",
        filename: "./data/minnesota.json",
        color: "#7A0019"
      },
      {
        name: "Nebraska",
        filename: "./data/nebraska.json",
        color: "#D00000"
      },
      {
        name: "Northwestern",
        filename: "./data/northwestern.json",
        color: "#4E2A84"
      },
      {
        name: "Ohio State",
        filename: "./data/ohio_state.json",
        color: "#BB0000"
      },
      {
        name: "Penn State",
        filename: "./data/penn_state.json",
        color: "#012D62"
      },
      {
        name: "Purdue",
        filename: "./data/purdue.json",
        color: "#2C2A29"
      },
      {
        name: "Rutgers",
        filename: "./data/rutgers.json",
        color: "#2C2A29"
      },
      {
        name: "Wisconsin",
        filename: "./data/wisconsin.json",
        color: "#C41E3A"
      },
    ];

    var team = teamOptions[0];

    // create the svg and projection
    var holder = d3.select("#content");

    var select = holder.append("select")
      .on("change", function() {
        var pos = select.property("value");
        updateTeam(teamHolder, projection, teamOptions[pos]);
      });
    select.selectAll("option")
        .data(teamOptions)
      .enter().append("option")
        .text(function(d){
          return d.name;
        })
        .attr("value", function(d, i) {
          return i;
        });

    var margin = {top: 15, right: 15, bottom: 15, left: 15};
    var width = 1200;
    var height = 800;
    var scale = 1400;
    var projection = d3.geo.albersUsa()
      .scale(scale)
      .translate([width/2, height/2]);
    var path = d3.geo.path()
      .projection(projection);

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
    var teamHolder = svg.append("g")
      .classed({
        "team": true
      });
    updateTeam(teamHolder, projection, team);
  });

function updateTeam(holder, projection, team) {
  d3.json(team.filename, function(error, roster) {
    var locs = roster.coords.map(function(spot) {
      return projection(spot);
    });
    var players = holder.selectAll("circle.player")
      .data(locs);

    players.enter().append("circle")
      .attr("r", 10)
      .style("opacity", 0.25)
      .classed({
        "player": true
      });

    players
      .style("fill", team.color)
      .attr("cx", function(d) {
        return d[0];
      })
      .attr("cy", function(d) {
        return d[1];
      })

    players.exit().remove();

  });
}