import React from "react";
import d3 from "d3";
import Team from "./Team";
import TeamSelect from "./TeamSelect";

export default React.createClass({
  getInitialState: function() {
    return {
      cIndex: 0,
      tIndex: 0
    };
  },
  setConference: function(index) {
    // verify that index is valid, otherwise set it to 0
    let cIndex = this.props.conferences[index] !== undefined ? index : 0;
    this.setState({
      cIndex: cIndex,
      tIndex: 0
    });
  },
  setTeam: function(index) {
    // verify that index if valid, otherwise set it to 0
    let tIndex = this.props.conferences[this.state.cIndex].teams[index] !== undefined ?
      index : 0;
    this.setState({
      tIndex: tIndex
    });
  },
  render: function() {
    let { conferences, map } = this.props;
    let { cIndex, tIndex } = this.state;
    let team = this.props.conferences[cIndex].teams[tIndex];
    return (
      <div className="app">
        <TeamSelect conferences={conferences}
                    conferenceIndex={cIndex}
                    teamIndex={tIndex}
                    setConference={this.setConference}
                    setTeam={this.setTeam} />
        <Team team={team}
              map={map} />
      </div>
    );
  }
});
