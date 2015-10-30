import React from "react";
import d3 from "d3";
import topojson from "topojson";

export default React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    // don't redraw
    return false
  },
  render: function() {
    return (
      <g className="map" ref="usmap"></g>
    );
  },
  componentDidMount: function() {
    d3.json("./data/us.json", (error, states) => {
      if ( error !== null ) {
        console.error(error);
        return;
      }
      var path = d3.geo.path()
        .projection(this.props.projection);
      var stateData = topojson.feature(states, states.objects.states).features;
      d3.select(this.refs.usmap).selectAll("g.state")
          .data(stateData)
        .enter().append("g")
          .classed("state", true)
          .append("path")
            .classed("outline", true)
            .attr("d", path);
    });
  }
});
