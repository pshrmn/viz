import React from "react";
import d3 from "d3";
import topojson from "topojson";

export default React.createClass({
  getInitialState: function() {
    return {
      states: []
    };
  },
  componentWillMount: function() {
    this.setState({
      path: d3.geo.path()
        .projection(this.props.projection)
    });
  },
  render: function() {
    let { active } = this.props;
    let states = this.state.states.map((s, index) => {
      return (
        <State key={index}
               active={s.properties.abbr===active}
               path={this.state.path}
               feature={s} />
      );
    });
    return (
      <g className="map" ref="usmap">
        {states}
      </g>
    );
  },
  componentDidMount: function() {
    d3.json("./data/us.json", (error, states) => {
      if ( error !== null ) {
        console.error(error);
        return;
      }
      let stateData = topojson.feature(states, states.objects.states).features;
      this.setState({
        states: stateData
      });
    });
  }
});

let State = React.createClass({
  render: function() {
    var classes = ["state"];
    if ( this.props.active ) {
      classes.push("active");
    }
    return (
      <g className={classes.join(" ")}>
        <StatePath path={this.props.path}
          feature={this.props.feature} />
      </g>
    );
  }
});

let StatePath = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    // the path doesn't need to be updated after its initial drawing
    return false;
  },
  render: function() {
    let { path, feature } = this.props;
    return (
      <path d={path(feature)} />
    );
  }
})
