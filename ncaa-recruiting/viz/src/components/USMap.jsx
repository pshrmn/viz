import React from "react";
import d3 from "d3";

/*
 * USMap
 * -----
 * Render on an SVG a map of the United States using an Albers projection.
 *
 * Props:
 * width - width of the svg
 * height - height of the svg
 * margin - margin of the svg (might change this to top/right/bottom/left)
 * projection - function to map [longitude, latitude] to [x,y]
 * features - an array of TOPOJSON features used to draw shapes
 * setClasses - a function used to add additional classes to a feature
 */
export default React.createClass({
  getDefaultProps: function() {
    return {
      width: 600,
      height: 400,
      margin: 15
    };
  },
  render: function() {
    let { width, height, margin, projection, features, setClasses } = this.props;
    return (
      <svg xmlns="http://www.w3.org/2000/svg"
           width={width + margin*2}
           height={height + margin*2} >
        <g translate={`transform(${margin},${margin})`} >
          <States projection={projection}
                 features={features}
                 setClasses={setClasses} />
          {this.props.children}
        </g>
      </svg>
    );
  }
});


/*
 * States
 * ------
 * Render an array of states
 *
 * Props:
 * projection - projection function for placing paths in the SVG
 * features - array of features, each one corresponding to a state
 * setClasses - function to determine any extra classes that a state group should have
 *    (by default a state has the "state" class)
 */
let States = React.createClass({
  componentWillMount: function() {
    this.setState({
      path: d3.geo.path()
        .projection(this.props.projection)
    });
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      path: d3.geo.path()
        .projection(nextProps.projection)
    });
  },
  render: function() {
    let { features, setClasses } = this.props;
    let states = features.map((s, index) => {
      return (
        <State key={index}
               setClasses={setClasses}
               path={this.state.path}
               feature={s} />
      );
    });

    return (
      <g className="map">
        {states}
      </g>
    );
  }
});

/*
 * State
 * -----
 * Render a state group. This is separate from StatePath because it is expensive to
 * re-render the path, but we might want to update a state visually using classes, so
 * those are updated here.
 *
 * Props:
 * path - a d3 function that converts topojson coordinates to the SVG space
 * setClasses - the function to determine classes of the state
 * feature - the object that describes how to draw the state
 */
let State = React.createClass({
  render: function() {
    let { setClasses, path, feature } = this.props;
    var classes = ["state"].concat(setClasses(feature));
    return (
      <g className={classes.join(" ")}>
        <StatePath path={path}
                   feature={feature} />
      </g>
    );
  }
});

/*
 * StatePath
 * ---------
 * Render the path for the state in the SVG. This should only be rendered once,
 * so shouldComponentUpdate returns false. (This might change if re-sizable maps
 * are implemented, but for the time being map sizes are static)
 *
 * Props:
 * path - a d3 function that converts topojson coordinates to the SVG space
 * feature - the object that the path uses to draw the state
 */
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
