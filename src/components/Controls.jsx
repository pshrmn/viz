import React from "react";

export default React.createClass({
  setRadius: function(event) {
    this.props.setRadius(event.target.value);
  },
  setOpacity: function(event) {
    this.props.setOpacity(event.target.value);
  },
  toggleSchools: function() {
    this.props.toggleSchools(event.target.checked)
  },
  toggleMedians: function() {
    this.props.toggleMedians(event.target.checked)
  },
  toggleMeans: function() {
    this.props.toggleMeans(event.target.checked)
  },
  render: function() {
    let { schools, medians, means, opacity, radius } = this.props;
    return (
      <div>
        <h2>Controls</h2>
        <label>
          Radius {radius}
          <input type="range"
                 value={radius}
                 step="1"
                 min="1"
                 max="15"
                 onChange={this.setRadius} />
        </label>
        <label>
          Opacity {opacity}
          <input type="range"
                 value={opacity}
                 step="0.05"
                 min="0"
                 max="1"
                 onChange={this.setOpacity} />
        </label>
        <label>
          Show Schools
          <input type="checkbox"
                 checked={schools}
                 onChange={this.toggleSchools} />
        </label>
        <label>
          Show Medians
          <input type="checkbox"
                 checked={medians}
                 onChange={this.toggleMedians} />
        </label>
        <label>
          Show Means
          <input type="checkbox"
                 checked={means}
                 onChange={this.toggleMeans} />
        </label>
      </div>
    );
  }
});
