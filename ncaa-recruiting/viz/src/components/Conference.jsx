import React from "react";
import d3 from "d3";
import StateChart from "./StateChart";
import Selector from "./Selector";
import Team from "./Team";

/*
 * Conference
 * ----------
 * Render a NCAA conference
 *
 * Props:
 * map - how to render a map
 * name - name of the conference
 * teams - the teams in the conference
 *
 * State:
 * index - the index of the currently selected team in the conference
 */
export default React.createClass({
  getInitialState: function() {
    return {
      index: 0
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return (
      nextState.index !== this.state.index ||
      nextProps.name !== this.props.name
    );
  },
  componentWillReceiveProps: function(nextProps) {
    // reset the index when the conference is switched
    this.setState({
      index: 0
    });
  },
  setTeam: function(index) {
    index = index < this.props.teams.length ? index : 0;
    this.setState({
      index: index
    });
  },
  render: function() {

    let { name, teams, map } = this.props;
    let team = teams[this.state.index];
    return (
      <div className="conference">
        <h2>{name}</h2>
        <ConferenceStats name={name}
                         teams={teams} />
        <div>
          <h3>
            Team: <Selector vals={teams}
                            index={this.state.index}
                            setIndex={this.setTeam} />
          </h3>
        </div>
        <Team team={team}
              map={map} />
      </div>
    );
  }  
});

/*
 * ConferenceStats
 * ---------------
 * Render statistics on the conference
 *
 * Props:
 * name - name of the conference
 * teams - array of teams in the conference
 */
let ConferenceStats = React.createClass({
  render: function() {
    let prettyNumber = d3.format(",.1f");

    let { name, teams } = this.props;

    let counts = stateCount(teams);
    let playerCount = teams.reduce((prev, curr) => prev + curr.roster.length, 0)
    let [ minPlayers, maxPlayers ] = d3.extent(teams, team => team.roster.length);
    let averagePlayerCount = prettyNumber(playerCount / teams.length);
    return (
      <div className="basics">
        <div>
          There are <span className="number">{teams.length}</span> teams in the {name} conference.
        </div>
        <div>
          On average, each team has <span className="number">{averagePlayerCount}</span> players,
          with a maximum of <span className="number">{maxPlayers}</span> and a minimum
          of <span className="number">{minPlayers}</span>.
        </div>
        <div>
          {name} football players come from <span className="number">{counts.length}</span> different states.
        </div>
        <StateChart name={name}
                    states={counts}
                    color="#2059C5"
                    width={700}
                    height={100}
                    min={10} />
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