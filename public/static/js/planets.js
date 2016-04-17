// setup elements so that everything is ordered correctly
var content = document.querySelector('.content');
var d3Content = d3.select(content);

var info = d3Content.append('div')
  .classed({'specs': true});

var svgHolder = d3Content.append('div');

var controls = d3Content.append('div')
  .classed({'controls': true});

/*
 * Determine the proper layout
 * Uses an observer for updates on window resize
 *
 * getPosition - return the appropriate row/column based on the index
 * size - returns the width and height of the svg
 * subscribe - add a function to be called on window resize
 * unsubscribe - remove the callback
 */
var builder = (function(holder) {
  // static cell size
  var cellSize = 250;
  // element used to hold the svg
  
  // store the rows and columns
  var _rows;
  var _columns;
  var _width;
  var _height;
  // subscribed functions
  var callbacks = [];
  // determine initial values
  rowsAndColumns(holder.clientWidth);

  /*
   * calculate the number of columns that can fit in the window,
   * and calculate the number of rows based on that
   */
  function rowsAndColumns(holderWidth){
    var maxWidth = holderWidth > 1000 ? 1000 : holderWidth;
    // the number of cells that can fit in a row
    var columnsCount = Math.floor(maxWidth / 250);
    // hard coded for 8 planets
    var rowsCount = Math.ceil(8/columnsCount);
    _rows = rowsCount;
    _columns = columnsCount;
    _width = columnsCount * cellSize;
    _height = rowsCount * cellSize;
  }

  // restrict how often the resize event listener does something 
  var last = new Date();
  window.addEventListener('resize', function(event){
    var now = new Date();
    if ( now - last > 100 ) {
      rowsAndColumns(holder.clientWidth);
      callbacks.forEach(function(fn) {
        fn();
      });
      last = now;
    }
  });

  return {
    getPosition: function(index) {
      return {
        row: Math.floor(index / _columns),
        column: index % _columns
      };
    },
    size: function() {
      return {
        width: _width,
        height: _height
      };
    },
    subscribe: function(callback) {
      callbacks.push(callback);
    },
    unsubscribe: function(callback) {
      callbacks = callbacks.filter(function(cb) {
        return cb !== callback;
      });
    }
  };
})(content);

/*
 * create an SVG element and a g inside it translated by the margins
 *
 * svg - returns the svg element
 * g - returns the g element
 */
var svg = (function(holder) {
  var d3svg;
  var d3g;
  function init() {
    var pixels = builder.size();
    var margin = 25;
    d3svg = svgHolder.append('svg')
      .attr('width', pixels.width + margin*2)
      .attr('height', pixels.height + margin*2);

    d3g = d3svg.append('g')
      .attr('transform', 'translate(' + margin + ',' + margin + ')');

    // resize the svg when the window resizes
    builder.subscribe(function() {
      var pixels = builder.size();
      d3svg
        .attr('width', pixels.width + margin*2)
        .attr('height', pixels.height + margin*2);
    });
  }

  return {
    svg: function() {
      if ( !d3svg ) {
        init();
      }
      return d3svg;
    },
    g: function() {
      if ( !d3svg) {
        init();
      }
      return d3g;
    }
  }
})(svgHolder);

/*
 * show - show the information on the planet
 * hide - hide the current information
 */
var infoPanel = (function(holder) {
  var commas = d3.format(',');

  var planetName = holder.append('h2');
  var planetRadius = holder.append('p')
    .text('Radius: ')
    .append('span');
  var planetDistance = holder.append('p')
    .text('Average Distance from the Sun:')
    .append('span');
  var planetInfo = holder.append('p')
    .classed({'info': true});

  return {
    show: function(planet) {
      planetName.text(planet.name);
      planetRadius.text(commas(planet.radius) + ' km');
      planetDistance.text(commas(planet.distance * 1000000) + ' km');
      planetInfo.text(planet.info);
      holder.classed('active', true);
    },
    hide: function() {
      holder.classed('active', false);
      
    }
  }
})(info);

/*
 * run - starts "rotating" the patterns
 * stop - freezes the patterns in place
 */
function makePatterns(data, holder) {
  var patternWidth = 618
  var patternHeight = 200;
  
  var defs = holder.append('svg:defs');

  var patterns = defs.selectAll('pattern')
      .data(data)
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

  // when this transition finishes, it calls itself to start again
  function recursiveTransition() {
    patterns.transition()
      .duration(5000)
      .ease('linear')
      .attr('x', function(d){
        return d3.select(this).attr('x') -640;
      })
      .each('end', recursiveTransition); 
  }

  return {
    run: function() {
      recursiveTransition();
    },
    stop: function() {
      patterns.transition();
    }
  }
}

function translatePosition(index){
  var position = builder.getPosition(index);
  return 'translate(' + (100 + position.column * 250) + ',' + (100 + position.row * 250) + ')';
}

function draw(planetData) {
  var state = {
    selected: undefined,
    rotating: false,
    scaled: false
  };

  // create the patterns from the planet data
  var patterns = makePatterns(planetData, svg.svg());

  // set how to scale planets size relative to one another
  var biggest = d3.max(planetData, function(d){
    return d.radius;
  });
  planetData.forEach(function(planet){
    planet.scale = (planet.radius / biggest)/2;
  });

  var planetHolders = svg.g().selectAll('g.planet')
      .data(planetData)
    .enter().append('g')
      .classed({'planet': true})
      .attr('transform', function(d, i){ return translatePosition(i);})
      .style('fill', function(d){ return 'url(#' + d.name + ')';});

  // when the window resizes, reposition the planet holders
  builder.subscribe(function() {
    planetHolders.attr('transform', function(d, i){
      return translatePosition(i);
    });
  });

  var planets = planetHolders.append('circle')
    .attr('r', 100)
    .attr('transform', 'scale(0.5)');

  planetHolders.append('text')
    .text(function(d){ return d.name; })
    .attr('x', 0)
    .attr('y', 75)
    .style('text-anchor', 'middle')
    .style('fill', '#fff');

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
        state.selected = undefined;
        infoPanel.hide();
      } else {
        if ( state.selected ) {
          state.selected.classList.remove('selected');
        }
        this.classList.add('selected');
        state.selected = this;
        infoPanel.show(d);
      }
    });

  /*
   * control elements
   */
  var radiusToggle = controls.append('label')
    .classed({
      'toggleable': true,
      'active': state.scaled
    })
    .text('Scale By Radius');
  radiusToggle.append('input')
    .attr('type', 'checkbox')
    .property('checked', false)
    .on('change', function(d){
      state.scaled = this.checked;
      radiusToggle.classed({
        'active': state.scaled
      });
      redrawPlanets();        
    });

  var rotateToggle = controls.append('label')
    .classed({
      'toggleable': true,
      'active': state.rotating
    })
    .text('Rotate Planets');
  rotateToggle.append('input')
    .attr('type', 'checkbox')
    .property('checked', false)
    .on('change', function(d){
      state.rotating = this.checked;
      rotateToggle.classed({
        'active': state.rotating
      });
      rotatePlanets();
    })

  /*
   * control logic
   */
  function redrawPlanets(){
    planets.transition()
      .duration(1000)
      .attr('transform', function(d){
        return state.scaled ? 'scale(' + d.scale + ')' : 'scale(0.5)';
      });
  }

  function rotatePlanets(){
    if ( state.rotating ) {
      patterns.run();
    } else {
      patterns.stop();
    }
  }
}

d3.json('/static/data/planets.json', function(error, planetData) {
  draw(planetData);
});
