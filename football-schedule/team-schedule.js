var map;
var svg;
var proj;
queue()
    .defer(d3.json, "./data/lower48.json")
    .defer(d3.json, "./data/teams.json")
    .defer(d3.json, "./data/games-2015.json")
    .await(function(error, states, teams, games){
        if ( error ) {
            console.log(error);
            return;
        }
        var teamNames = Object.keys(teams).sort();
        var width = 800;
        var height = 500;
        var scale = 1200;
        var radius = 8;
        // 0-17, 0 meaning the offseason
        var week = 1;
        var currentTeam = undefined;
        var intervalTime = 1500;      

        var scheduleHolder = d3.select("body").append("div")
            .attr("id", "scheduleHolder");
        
        /*
         * CONTROLS
         */
        var controls = scheduleHolder.append("div")
            .classed({"controls": true});

        var select = controls.append("select")
            .on("change", selectTeamEvent);
        select.selectAll("option")
                .data(["all"].concat(teamNames))
            .enter().append("option")
                .text(function(d){ return capitalize(d); })
                .attr("value", function(d){ return d; });

        function selectTeamEvent(){
            currentTeam = select.property("value");
            if ( currentTeam === "all" ) {
                currentTeam = undefined;
            }
            week = 0;
        }

        var paused = false;
        var pauseButton = controls.append("button")
            .text(function(){ return paused ? "Play" : "Pause"; })
            .on("click", function(){
                paused = !paused;
                if ( paused ) {
                    clearInterval(animation);
                } else {
                    animation = animate();
                }
                this.textContent = paused ? "Play" : "Pause";
            })

        // update the map every "intervalTime" milliseconds
        function animate(){
            return setInterval(function(){
                update(week, currentTeam);
                week = (week+1)%18;
            }, intervalTime);
        }
        var animation = animate();

        /*
         * Continental USMap
         */        
        map = usmap(states)
            .width(width)
            .height(height)
            .scale(scale);

        map("#scheduleHolder");
        svg = map.svg();
        proj = map.projection();

        // cache projection coordinates (needs projection from the map)
        var stadiums = {};
        for ( var name in teams ) {
            stadiums[name] = proj([teams[name].coords.long, teams[name].coords.lat]);
        }
        // stick london off to the east
        stadiums["london"] = [width+50, height/2];

        /*
         *  SVG
         */
        var nfl = svg.append("g")
            .classed({"nfl": true});

        var teamLines = nfl.selectAll("line.trip")
                .data(teamNames)
            .enter().append("line")
                .classed({"trip": true})
                .attr("x1", function(d){
                    return stadiums[d][0];
                })
                .attr("x2", function(d){
                    return stadiums[d][0];
                })
                .attr("y1", function(d){
                    return stadiums[d][1];
                })
                .attr("y2", function(d){
                    return stadiums[d][1];
                })
                .style("stroke", function(d){
                    return teams[d].colors.secondary;
                })
                .style("stroke-width", 1)
                .style("stroke-dasharray", "5,5");

        var teamCircles = nfl.selectAll("circle.team")
                .data(teamNames)
            .enter().append("circle")
                .classed({"team": true})
                .attr("transform", function(d){
                    var coords = stadiums[d];
                    return "translate(" + coords[0] + "," + coords[1] + ")";
                })
                .attr("r", radius)
                .style("fill", function(d){
                      return teams[d].colors.primary;
                    })
                .style("stroke", function(d){
                      return teams[d].colors.secondary;
                    })
                .style("stroke-width", 2);

        var weekText = svg.append("g")
            .attr("transform", function(){
                return "translate(400, 0)";
            })
            .append("text")
                .text("Offseason")
                .style("font-size", "36px")
                .style("text-anchor", "middle");

        function update(week, team){
            var duration = 500;
            teamCircles.transition()
                .duration(duration)
                .ease("in-out")
                .attr("transform", function(d){
                    var game = games[d][week];
                    // only animate specified team and its opponent
                    if ( team && d !== team && game.opponent !== team ) {
                        return "translate(" + stadiums[d][0] + "," + stadiums[d][1] + ")";
                    }
                    var long = stadiums[game.location][0] - (game.type === "away" ? 17 : 0)
                    var lat = stadiums[game.location][1];
                    return "translate(" + long + "," + lat + ")";
                })
                .attr("r", function(d){
                    var game = games[d][week];
                    // only animate specified team and its opponent
                    if ( team && d !== team && game.opponent !== team ) {
                        return 3;
                    }
                    return radius;
                });

            teamLines.transition()
                .duration(duration)
                .ease("in-out")
                .attr("x2", function(d){
                    var game = games[d][week];
                    if ( team && d !== team && game.opponent !== team ) {
                        return stadiums[d][0];
                    }
                    // prevent overlap for circles of teams playing each other
                    return stadiums[game.location][0] - (game.type === "away" ? 17 : 0);
                })
                .attr("y2", function(d){
                    var game = games[d][week];
                    if ( team && d !== team && game.opponent !== team ) {
                        return stadiums[d][1];
                    }
                    return stadiums[games[d][week].location][1];
                })

            weekText.text(function(){
                if ( week === 0 ){
                    return "Offseason";
                }
                if ( currentTeam ) {
                    var game = games[currentTeam][week];
                    
                    if ( game.type === "bye"){
                        return "Week " + week + ": Bye";
                    } else {
                        var type = game.type === "home" ? "vs." : "@";
                        var info = "Week " + week + ": " + type + " " + capitalize(game.opponent);
                        if ( game.location === "london" ) {
                            info += " in London";
                        }
                        return info;
                    }
                    
                } else {
                    return "Week " + week;
                }
            });
        }
    });

function capitalize(str){
    return str.charAt(0).toUpperCase() + str.substr(1);
}