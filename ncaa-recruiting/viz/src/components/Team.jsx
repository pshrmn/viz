import React from "react";
import d3 from "d3";
import USMap from "./USMap";
import TeamMap from "./TeamMap";
import StateChart from "./StateChart";

/*
 * Team
 * ----
 *
 *
 * Props:
 * team - the current team
 * map - props for how to render the map including: width, height, margin,
 *    features, and projection
 */
export default React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.team.name !== this.props.name;
  },
  getDefaultProps: function() {
    return {
      team: {},
      map: {}
    };
  },
  render: function() {
    let { team, map } = this.props;
    let { name, city, state } = team;
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

/*
 * TeamStats
 * ---------
 * Render statistics for a team
 *
 * Props:
 * map - properties used to render a map
 * team - the current team
 */
let TeamStats = React.createClass({
  getDefaultProps: function() {
    return {
      map: {},
      team: {}
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.team !== undefined && nextProps.team.name !== this.props.team.name;
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
    let { mean, median, roster, state, colors } = team;
    roster = roster || [];

    let { counts, states } = this._stateCounts(roster);
    
    let inState = counts[state] ? counts[state] : 0;
    // function to add the "active" class to the feature matching the current state
    let setActive = (feature) => {
      return feature.properties.abbr === state ? ["active"] : [];
    }
    return (
      <div className="team-info">
        <div className="city-distances">
          <div>
            On average, a player's hometown is <span className="number">{prettyNumber(mean)}</span> miles away from campus.
          </div>
          <div>
            50% of players come from within <span className="number">{prettyNumber(median)}</span> miles of campus.
          </div>
          <USMap team={team}
                 setClasses={setActive}
                 {...map} >
            <TeamMap {...team} />
          </USMap>
        </div>
        <div className="state-counts">
          <StateChart name={name}
              states={states}
              color={colors ? colors[0] : "#000"}
              width={500}
              height={100}
              min={2} />
          <div>
            Of the <span className="number">{roster.length}</span> players on the team,{" "}
            <span className="number">{fPercent(inState / roster.length)}</span> play in their home state.
          </div>
        </div>
      </div>
    );
  }  
});

