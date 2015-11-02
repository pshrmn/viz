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
    let { name, city, state, prettyMean, prettyMedian, roster } = team;
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
        <TeamInfo name={name}
                  mean={prettyMean}
                  median={prettyMedian}
                  roster={roster}
                  state={state} />
      </div>
    );
  }
});

let TeamInfo = React.createClass({
  getDefaultProps: function() {
    return {
      name: "",
      mean: 0,
      median: 0,
      roster: [],
      state: ""
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.name !== this.props.name;
  },
  _stateCounts: function(roster) {
    let counts = {};
    roster.forEach((player) => {
      let state = player.state;
      if ( counts[state] ) {
        counts[state]++;
      } else {
        counts[state] = 1;
      }
    });
    return counts;
  },
  render: function() {
    let { mean, median, roster, state } = this.props;
    let stateCounts = this._stateCounts(roster);
    let playerCount = roster.length;
    let fPercent = format(".2%");
    // on the off chance there are no in-state players, make sure a value is set
    if ( stateCounts[state] == undefined ) {
      stateCounts[state] = 0;
    }
    let inStatePercent = fPercent(stateCounts[state] / playerCount);
    return (
      <div className="team-info">
        <p>
          <span className="number">{inStatePercent}</span> of players come from in-state
        </p>
        <p>Mean Distance: <span className="number">{mean}</span> miles</p>
        <p>Median Distance: <span className="number">{median}</span> miles</p>
      </div>
    );
  }  
});
