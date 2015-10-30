import React from "react";
import d3 from "d3";

export default React.createClass({
  getInitialState: function() {
    return {
      teams: []
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      teams: nextProps.teams
    });
  },
  updateTeam: function(index) {
    let teams = this.state.teams;
    teams[index].selected = !teams[index].selected;
    this.sendUpdate(teams);
    this.setState({
      teams: teams
    });
  },
  selectAll: function() {
    let teams = this.state.teams;
    teams.forEach(t => {
      t.selected = true;
    });
    this.sendUpdate(teams);
    this.setState({
      teams: teams
    });
  },
  deselectAll: function() {
    let teams = this.state.teams;
    teams.forEach(t => {
      t.selected = false;
    });
    this.sendUpdate(teams);
    this.setState({
      teams: teams
    });
  },
  sendUpdate: function(teams) {
    this.props.setTeams(teams);
  },
  render: function() {
    let teams = this.props.teams.map((team, index) => {
      return (
        <Team key={index}
              index={index}
              name={team.name}
              selected={team.selected}
              update={this.updateTeam} />
      );
    });
    return (
      <div className="team-menu">
        <div className="controls">
          <button onClick={this.selectAll}>Select All</button>
          <button onClick={this.deselectAll}>Deselect All</button>
        </div>
        {teams}
      </div>
    );
  }
});

let Team = React.createClass({
  getDefaultProps: function() {
    return {
      name: ""
    };
  },
  checkHandler: function(event) {
    this.props.update(this.props.index);
  },
  render: function() {
    return (
      <div className="team">
        <label>
          {this.props.name}
          <input type="checkbox"
                 checked={this.props.selected}
                 onChange={this.checkHandler} />
        </label>
      </div>
    );
  }
})