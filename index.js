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


    // merge the rosters into the teams object
    teams.forEach(function(team, index) {
      var key = team.name.toLowerCase();
      team.coords = rosters[key];
      team.selected = index === 0;
      team.points = team.coords.map(function(spot) {
        return projection(spot);
      });
    });

    // create the svg and projection
    var holder = d3.select("#content");

    // not really a form ;)
    var form = holder.append("div")
      .classed({
        "radio-holder": true
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
            updateTeams(teamHolders);
          });


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

    teamHolders.selectAll("circle.player")
        .data(function(d){
          return d.points
        })
      .enter().append("circle")
        .classed({
          player: true
        })
        .attr("r", 5)
        .style("opacity", 0.25)
        .attr("cx", function(d){ return d[0]; })
        .attr("cy", function(d){ return d[1]; });

  });


function updateTeams(holder) {
  holder.classed({
    hidden: function(d) { return !d.selected; }
  });
}