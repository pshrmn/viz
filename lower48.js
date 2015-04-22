/*
 * Draw a map of the continental United States
 */
function usmap(map){
  var width = 960;
  var height = 600;
  var margin = {
      top: 75,
      right: 75,
      bottom: 75,
      left: 75
  };
  var scale = 1200;
  var holder = "body";

  var svg;
  var projection = d3.geo.albersUsa()
    .scale(scale)
    .translate([width / 2, height / 2]);
  var path = d3.geo.path()
    .projection(projection);
  var stateData = topojson.feature(map, map.objects.states).features;

  function mapper(){
    svg = d3.select(holder).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    projection = projection
      .scale(scale)
      .translate([width / 2, height / 2]);

    path = path.projection(projection);

    var states = svg.append("g")
      .classed("country", true)
      .selectAll("g.state")
        .data(stateData)
      .enter().append("g")
        .classed("state", true)
        .append("path")
            .classed("outline", true)
            .attr("d", path);
  }

  /*
   * setters/getters
   */

  mapper.width = function(w){
    if ( !arguments.length ) {
      return width;
    }
    width = w;
    return mapper;
  };

  mapper.height = function(h){
    if ( !arguments.length ) {
      return height;
    }
    height = h;
    return mapper;
  };

  mapper.margin = function(m){
    if ( !arguments.length ) {
      return margin;
    }
    // make sure that margin has all of the required properties
    var legit = ["top", "right", "bottom", "left"].every(function(d){
      return d in m;
    })
    if ( !legit ) {
      return;
    }
    margin = m;
    return mapper;
  };

  mapper.scale = function(s){
    if ( !arguments.length ) {
      return scale;
    }
    scale = s;
    return mapper;
  };

  mapper.holder = function(h){
    if ( !arguments.length ) {
      return holder;
    }
    holder = h;
    return mapper;
  };

  /*
   * getters
   */
  mapper.svg = function(){
    return svg;
  };

  mapper.projection = function(){
    return projection;
  };

  return mapper;
}
