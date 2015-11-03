import React from "react";
import d3 from "d3";
import USMap from "./USMap";
import TeamMap from "./TeamMap";
import StateChart from "./StateChart";

export default React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.team.name !== this.props.name;
  },
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
    let { team, width, height, margin, projection } = this.props;
    let { name, city, state } = team;
    let map = {
      projection,
      width,
      height,
      margin
    };
    return (
      <div className="team">
        <h2>{name}</h2>
        <h3>{city}, {state}</h3>
        <TeamStats map={map}
                   team={team} />
      </div>
    );
  }
});

let TeamStats = React.createClass({
  getDefaultProps: function() {
    return {
      map: {},
      team: {}
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return (
      nextProps.team !== undefined &&
      nextProps.team.name !== this.props.team.name
    );
  },
  _stateCounts: function(roster = []) {
    // figure out how many players there are per state
    let counts = {};
    roster.forEach((player) => {
      let state = player.state;
      if ( counts[state] ) {
        counts[state]++;
      } else {
        counts[state] = 1;
      }
    });
    let countArray = [];
    for ( var key in counts ) {
      countArray.push({
        name: key,
        count: counts[key]
      });
    }
    return {
      counts: counts,
      states: countArray
    };
  },
  render: function() {
    let prettyNumber = d3.format(",.0f");
    let fPercent = d3.format(".2%");
    let { team, map } = this.props;
    let { width, height, margin, projection } = map;
    let { mean, median, roster, state, colors } = team;
    roster = roster || [];
    let { counts, states } = this._stateCounts(roster);
    
    let prettyMean = prettyNumber(mean);
    let prettyMedian = prettyNumber(median);
    let meanString = (
      <span>
        On average, a player's hometown is <span className="number">{prettyMean}</span> miles away from campus.
      </span>
    );
    let medianString = mean > median ? (
      <div>
        50% of players come from within <span className="number">{prettyMedian}</span> miles of campus.
      </div>
      ) : (
      <div>
        50% of players hometowns are over <span className="number">{prettyMedian}</span> miles from campus.
      </div>
    );

    let inState = counts[state] ? counts[state] : 0;
    let inStateString = (
      <div>
        Of the <span className="number">{roster.length}</span> players on the team,{" "}
        <span className="number">{fPercent(counts[state] / roster.length)}</span> play in their home state.
      </div>
    );
    return (
      <div className="team-info">
        <div className="state-counts">
          <StateChart name={name}
              states={states}
              color={colors ? colors[0] : "#000"}
              width={500}
              height={100} />
          {inStateString}
        </div>
        <div className="city-distances">
          {meanString}{" "}
          {medianString}
          <RosterSVG projection={projection}
                     width={width}
                     height={height}
                     margin={margin}
                     team={team} />
        </div>
      </div>
    );
  }  
});

let RosterSVG = React.createClass({
  getDefaultProps: function() {
    return {
      width: 600,
      height: 400,
      margin: 15,
      team: {}
    };
  },
  render: function() {
    let { width, height, margin, projection, team } = this.props;
    return (
      <svg xmlns="http://www.w3.org/2000/svg"
           width={width + margin*2}
           height={height + margin*2} >
        <g translate={`transform(${margin},${margin})`} >
          <USMap projection={projection} active={team.state} />
          <TeamMap {...team} />
        </g>
      </svg>
    );
  }
})
