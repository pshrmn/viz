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
      team: {
        name: "",
        city: "",
        state: "",
        mean: 0,
        median: 0,
        roster: []
      },
      width: 1000,
      height: 800,
      margin: 0,
      // default projection does nothing?
      projection: () => {}
    };
  },
  _stateCounts: function(roster = []) {
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
    let { team, width, height, margin, projection } = this.props;
    let { name, city, state, mean, median, roster, color } = team;
    let stateData = this._stateCounts(roster);
    return (
      <div className="team">
        <h2>{name}</h2>
        <h3>{city}, {state}</h3>
        <TeamInfo counts={stateData.counts}
                  {...team} />
        <svg xmlns="http://www.w3.org/2000/svg"
             width={width + margin*2}
             height={height + margin*2} >
          <g translate={`transform(${margin},${margin})`} >
            <USMap projection={projection} active={team.state} />
            <TeamMap {...team} />
          </g>
        </svg>
        <StateChart name={name}
                    states={stateData.states}
                    color={color}
                    width={500}
                    height={200} />
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
  render: function() {
    let fPercent = d3.format(".2%");
    let prettyNumber = d3.format(",.0f");

    let { mean, median, roster, state, counts } = this.props;

    let playerCount = roster.length;
    // on the off chance there are no in-state players, make sure a value is set
    if ( counts[state] == undefined ) {
      counts[state] = 0;
    }
    let inStatePercent = fPercent(counts[state] / playerCount);

    let prettyMean = prettyNumber(mean);
    let prettyMedian = prettyNumber(median);
    let medianString = mean > median ? (
      <p>However, 50% of players come from within <span className="number">{prettyMedian}</span> miles of campus.</p>
    ) : (
      <p>50% of players come from over <span className="number">{prettyMedian}</span> miles of campus.</p>
    );

    return (
      <div className="team-info">
        <p>
          <span className="number">{inStatePercent}</span> of players come from in-state
        </p>
        <p>On average, a player's hometown is <span className="number">{prettyMean}</span> miles away from campus.</p>
        {medianString}
      </div>
    );
  }  
});
