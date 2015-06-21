var width = 750;
var height = 750;
var margin = 25;
var svg = d3.select('.content svg')
    .attr('width', width + margin*2)
    .attr('height', height + margin*2)
    .append('g')
        .attr('transform', 'translate(' + margin + ',' + margin + ')');
var controls = d3.select('.controls');

var defs = svg.append('svg:defs');

d3.json('/static/data/planets.json', function(error, planetData) {
    var patternWidth = 618
    var patternHeight = 200;

    // useful for drawing planets relative to one another's sizes
    var biggest = d3.max(planetData, function(d){
        return d.radius;
    });
    planetData.forEach(function(planet){
        planet.scale = (planet.radius / biggest)/2;
    });

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

    var planetHolders = solarSystem.selectAll('g.planet')
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
    var planets = planetHolders.append('circle')
        .attr('r', 100)
        .attr('transform', 'scale(0.5)');

    planetHolders.append('text')
        .text(function(d){ return d.name; })
        .attr('x', 0)
        .attr('y', 75)
        .style('text-anchor', 'middle')
        .style('fill', 'rgb(228, 213, 106)');

    var selectedPlanet;
    var highlights = planetHolders.append('rect')
        .classed({
            'selected': false
        })
        .attr('x', -100)
        .attr('y', -100)
        .attr('width', 200)
        .attr('height', 200)
        .on('click', function(d, i){
            if ( this.classList.contains('selected') ) {
                this.classList.remove('selected');
                selectedPlanet = undefined;
            } else {
                if ( selectedPlanet ) {
                    selectedPlanet.classList.remove('selected');
                }
                this.classList.add('selected');
                selectedPlanet = this;
            }
        });

    /*
     * control elements
     */
    var byRadius = false;
    var radiusToggle = controls.append('label')
        .classed({
            'toggleable': true,
            'active': byRadius
        })
        .text('By Radius');
    radiusToggle.append('input')
        .attr('type', 'checkbox')
        .property('checked', false)
        .on('change', function(d){
            byRadius = this.checked;
            redrawPlanets();        
        });

    var toRotate = false;
    var rotateToggle = controls.append('label')
        .classed({
            'toggleable': true,
            'active': toRotate
        })
        .text('Rotate Planets');
    rotateToggle.append('input')
        .attr('type', 'checkbox')
        .property('checked', false)
        .on('change', function(d){
            toRotate = this.checked;
            rotatePlanets();
        })

    /*
     * control logic
     */
    function redrawPlanets(){
        radiusToggle.classed({
            'active': byRadius
        });

        planets.transition()
            .duration(1000)
            .attr('transform', function(d){
                if ( byRadius ) {
                    return 'scale(' + d.scale + ')';
                } else {
                    return 'scale(0.5)';
                }
            });
    }

    function rotatePlanets(){
        rotateToggle.classed({
            'active': toRotate
        });
        if ( toRotate ) {
            recursiveRotate();
        } else {
            patterns.transition();
        }
    }

    function recursiveRotate(){
        patterns.transition()
            .duration(5000)
            .ease('linear')
            .attr('x', function(d){
                return d3.select(this).attr('x') -640;
            })
            .each('end', recursiveRotate);
    }
});