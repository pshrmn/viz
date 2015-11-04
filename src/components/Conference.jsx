import React from "react";
import StateChart from "./StateChart";
import d3 from "d3";

export default React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.name !== this.props.name;
  },
  render: function() {
    let prettyNumber = d3.format(",.1f");

    let { name, teams } = this.props;

    let counts = stateCount(teams);
    let playerCount = teams.reduce((prev, curr) => prev + curr.roster.length, 0)
    let [ minPlayers, maxPlayers ] = d3.extent(teams, team => team.roster.length);
    let averagePlayerCount = prettyNumber(playerCount / teams.length);
    return (
      <div className="conference">
        <h2>{name}</h2>
        <div className="basics">
          <div>
            There are <span className="number">{teams.length}</span> teams in the {name} conference.
          </div>
          <div>
            On average, each team has <span className="number">{averagePlayerCount}</span> players,
            with a maximum of <span className="number">{maxPlayers}</span> and a minimum
            of <span className="number">{minPlayers}</span>.
          </div>
        </div>
        <div>
          <div>
            {name} football players come from <span className="number">{counts.length}</span> different states.
          </div>
          <StateChart name={name}
                      states={counts}
                      color="#222"
                      width={650}
                      height={100}
                      min={10} />
        </div>
      </div>
    );
  }  
});

function stateCount(teams) {
  let counts = {};
  teams.forEach(team => {
    team.roster.forEach(player => {
      let state = player.state;
      if ( counts[state] ) {
        counts[state]++;
      } else {
        counts[state] = 1;
      }
    });
  });
  let statesArray = [];
  for ( var key in counts ) {
    statesArray.push({
      name: key,
      count: counts[key]
    });
  }
  return statesArray;
}