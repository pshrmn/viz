import React from "react";
import d3 from "d3";

export default React.createClass({
  componentWillMount: function() {
    this.setState({
      path: d3.geo.path()
        .projection(this.props.projection)
    });
  },
  render: function() {
    let { features, active } = this.props;
    let states = features.map((s, index) => {
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
