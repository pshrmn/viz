import React from "react";

export default React.createClass({
  updateIndex: function(event) {
    this.props.setIndex(event.target.value);
  },
  render: function() {
    let {vals, index} = this.props;
    let options = vals.map((val, index) => {
      return (
        <option key={index} value={index}>{val.name}</option>
      );
    })
    return (
      <select onChange={this.updateIndex} value={index}>
        {options}
      </select>
    );
  }
});
