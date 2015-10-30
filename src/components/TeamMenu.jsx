import React from "react";
import d3 from "d3";

export default React.createClass({
  render: function() {
    let teams = this.props.teams.map((team, index) => {
      return (
        <Team key={index}
              name={team.name}
              select={this} />
      );
    });
    return (
      <div className="team-menu">
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
  getInitialState: function() {
    return {
      checked: false
    }
  },
  checkHandler: function(event) {
    this.setState({
      checked: event.target.checked
    });
  },
  render: function() {
    return (
      <div className="team">
        <label>
          {this.props.name}
          <input type="checkbox"
                 checked={this.state.checked}
                 onChange={this.checkHandler} />
        </label>
      </div>
    );
  }
})