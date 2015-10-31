import React from "react";
import { format } from "d3";

export default React.createClass({
  getDefaultProps: function() {
    return {
      name: "",
      city: "",
      state: "",
      roster: [],
      latitude: -1,
      longitude: -1,
      mean: 0,
      median: 0
    };
  },
  propTypes: {
    name: React.PropTypes.string.isRequired,
    city: React.PropTypes.string.isRequired,
    state: React.PropTypes.string.isRequired,
    roster: React.PropTypes.array.isRequired,
    latitude: React.PropTypes.number.isRequired,
    longitude: React.PropTypes.number.isRequired,
    mean: React.PropTypes.number.isRequired,
    median: React.PropTypes.number.isRequired
  },
  prettyNumbers: d3.format(",.0f"),
  render: function() {
    let { name, city, state, roster, mean, median } = this.props;
    return (
      <div className="team">
        <h2>{name}</h2>
        <h3>{city}, {state}</h3>
        <p>Mean Distance: {this.prettyNumbers(mean)} miles</p>
        <p>Median Distance: {this.prettyNumbers(median)} miles</p>
      </div>
    );
  }
});