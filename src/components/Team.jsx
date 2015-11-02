import React from "react";
import { format } from "d3";
import USMap from "./USMap";
import TeamSVG from "./TeamSVG";

export default React.createClass({
  getDefaultProps: function() {
    return {
      team: {},
      width: 1000,
      height: 800,
      margin: 0,
      // default projection does nothing?
      projection: () => {}
    };
  },
  render: function() {
    //let { name, city, state, roster, prettyMean, prettyMedian,
    let { team, width, height, margin, projection } = this.props;
    let { name, city, state, prettyMean, prettyMedian } = team;
    return (
      <div className="team">
        <h2>{name}</h2>
        <h3>{city}, {state}</h3>
        <svg width={width + margin*2} height={height + margin*2} >
          <g translate={`transform(${margin},${margin})`} >
            <USMap projection={projection} active={team.state} />
            <TeamSVG {...team} />
          </g>
        </svg>
        <p>Mean Distance: {prettyMean} miles</p>
        <p>Median Distance: {prettyMedian} miles</p>
      </div>
    );
  }
});
