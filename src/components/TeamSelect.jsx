import React from "react";

export default React.createClass({
  updateTeam: function(event) {
    this.props.setTeam(event.target.value);
  },
  sendUpdate: function(index) {
    this.props.setTeam(index);
  },
  render: function() {
    let teams = this.props.teams.map((team, index) => {
      return (
        <option key={index} value={index}>
          {team.name}
        </option>
      );
    });
    return (
      <div className="team-menu">
        <select onChange={this.updateTeam} value={this.props.index} >
          {teams}
        </select>
      </div>
    );
  }
});
