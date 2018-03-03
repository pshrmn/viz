function drawStadiums(map, projection, teams){
    var teamsArray = [];
    for ( var key in teams ) {
        var obj = teams[key];
        obj.name = key;
        teamsArray.push(obj);
    }

    map.append("g")
      .classed("teams", true)
      .selectAll("g.team")
        .data(teamsArray)
      .enter().append("g")
        .classed("team", true)
        .attr("transform", function(d){
            var coords = projection([d.coords.long, d.coords.lat]);
            return "translate(" + coords[0] + "," + coords[1] + ")";
        })
        .attr("title", function(d){
            return d.name;
        })
        .append("circle")
            .attr("r", 8)
            .style("fill", function(d){
              return d.colors.primary;
            })
            .style("stroke", function(d){
              return d.colors.secondary;
            })
            .style("stroke-width", 2);
}

/*
 * Games is an object with keys for each team
 * Each team's object contains the location of their game, and the
 * type of the game (home, away, bye)
 */
function drawGames(games){
  //teams

}
