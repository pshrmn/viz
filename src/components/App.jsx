import React from "react";
import USMap from "./USMap";
import d3 from "d3";

export default React.createClass({
  componentWillMount: function() {
    let { scale, width, height } = this.props;
    let projection = d3.geo.albersUsa()
      .scale(scale)
      .translate([width/2, height/2]);
    this.setState({
      projection: projection
    });
  },
  render: function() {
    let { width, height, margin, scale } = this.props;
    return (
      <div className="app">
        <svg width={width + margin*2} height={height + margin*2} >
          <g translate={`transform(${margin},${margin})`} >
            <USMap projection={this.state.projection} />
          </g>
        </svg>
      </div>
    );
  }
});
