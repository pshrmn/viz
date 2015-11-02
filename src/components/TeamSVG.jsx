import React from "react";

export default React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.name !== this.props.name;
  },
  getDefaultProps: function() {
    return {
      name: "",
      roster: []
    };
  },
  render: function() {
    let { name, schoolPoint, roster, color,
      prettyMean, prettyMedian, meanRadius, medianRadius } = this.props;
    let hometowns = roster.map((city, index) => {
      return (
        <circle key={index}
                r="2"
                cx={city.point[0]}
                cy={city.point[1]} />
      );
    });
    let school = schoolPoint !== undefined ? (
      <circle className="school"
              r="5"
              cx={schoolPoint[0]}
              cy={schoolPoint[1]} >
        <title>{this.props.name}</title>
      </circle>
      ) : null;
    let meanCircle = schoolPoint !== undefined && meanRadius !== undefined ? (
      <circle className="mean"
              r={meanRadius}
              cx={schoolPoint[0]}
              cy={schoolPoint[1]} >
        <title>{`Mean Distance: ${prettyMean} miles`}</title>
      </circle>
    ) : null;
    let medianCircle = schoolPoint !== undefined && meanRadius !== undefined ? (
      <circle className="median"
              r={medianRadius}
              cx={schoolPoint[0]}
              cy={schoolPoint[1]} >
        <title>{`Median Distance: ${prettyMedian} miles`}</title>
      </circle>
    ) : null;

    return (
      <g className="team"
         fill={color} >
        {meanCircle}
        {medianCircle}
        <g className="hometowns">
          {hometowns}
        </g>
        {school}
      </g>
    );
  }
});
