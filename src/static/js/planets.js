var holder = d3.select('.content');
var svg = holder.append('svg')
    .attr('width', 750)
    .attr('height', 750);

var defs = svg.append('svg:defs');

d3.json('/static/data/planets.json', function(error, planetData) {
    var patternWidth = 618
    var patternHeight = 200;
    /*
     * useful for drawing planets relative to one another's sizes
    var biggest = d3.max(planetData, function(d){
        return d.radius;
    });
    planetData.forEach(function(planet){
        planet.scale = planet.radius / biggest;
    });
    */
    /*
     * useful for drawing based on their distance from the sun
    var longest = d3.max(planetData, function(d){
        return d.distance;
    });
    var xScale = d3.scale.linear()
        .domain([0, longest])
        .range([0, 1400]);
    */


    var patterns = defs.selectAll('pattern')
            .data(planetData)
        .enter().append('svg:pattern')
            .attr('id', function(d){ return d.name; })
            .attr('width', patternWidth)
            .attr('height', patternHeight)
            .attr('y', patternHeight/2)
            .attr('x', Math.random()*patternWidth)
            .attr('patternUnits', 'userSpaceOnUse');

    patterns.append('image')
        .attr('xlink:href', function(d){ return d.texture; })
        .attr('width', patternWidth)
        .attr('height', patternHeight);

    var solarSystem = svg.append('g')
        .classed({
            'solar-system': true
        });
    var planets = solarSystem.selectAll('g.planet')
            .data(planetData)
        .enter().append('g')
            .classed({
                'planet': true
            })
            .attr('transform', function(d, i){
                // row and column are 1-based
                var row = Math.floor(i/3);
                var column = i % 3;
                return 'translate(' + (100 + column * 250) + ',' + (100 + row * 250) + ')';
            })
            .style('fill', function(d){
                return 'url(#' + d.name + ')';
            });
    planets.append('circle')
        .attr('r', 100);
    planets.append('text')
        .text(function(d){ return d.name; })
        .attr('x', 0)
        .attr('y', 125)
        .style('text-anchor', 'middle')
        .style('fill', 'rgb(228, 213, 106)');

    function rotate(){
        patterns.attr('x', 0);
        patterns.transition()
            .duration(5000)
            .ease('linear')
            .attr('x', -640)
            .each('end', rotate);
    }
    rotate();
});