import React from "react";

export default React.createClass({
  updateConference: function(event) {
    this.props.setConference(event.target.value);
  },
  updateTeam: function(event) {
    this.props.setTeam(event.target.value);
  },
  render: function() {
    let { conferences, conferenceIndex, teamIndex } = this.props;
    let conferenceOptions = conferences.length ?
      conferences.map((conf, index) => {
        return (
          <option key={index} value={index}>
            {conf.name}
          </option>
        );
      }) : null;
    let teamOptions = conferences.length && conferences[conferenceIndex] ?
      conferences[conferenceIndex].teams.map((team, index) => {
        return (
          <option key={index} value={index}>
            {team.name}
          </option>
        );
      }) : null;
    return (
      <div className="team-menu">
        <div className="selector">
          Conference: 
          <select onChange={this.updateConference} value={conferenceIndex}>
            {conferenceOptions}
          </select>
        </div>
        <div className="selector">
          School: 
          <select onChange={this.updateTeam} value={teamIndex} >
            {teamOptions}
          </select>
        </div>
      </div>
    );
  }
});
