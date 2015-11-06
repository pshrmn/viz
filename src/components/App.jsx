import React from "react";
import d3 from "d3";
import Selector from "./Selector";
import Conference from "./Conference";

export default React.createClass({
  getInitialState: function() {
    return {
      index: 0
    };
  },
  setConference: function(index) {
    // verify that index is valid, otherwise set it to 0
    index = this.props.conferences[index] !== undefined ? index : 0;
    this.setState({
      index: index
    });
  },
  render: function() {
    let { conferences, map } = this.props;
    let conference = this.props.conferences[this.state.index];
    return (
      <div className="app">
        <h3>
          Conference: <Selector vals={conferences}
                    index={this.state.index}
                    setIndex={this.setConference} />
        </h3>
        <Conference map={map}
                    {...conference} />
      </div>
    );
  }
});

