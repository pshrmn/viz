import React from "react";
import { format } from "d3";

export default React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.name !== this.props.name;
  },
  getDefaultProps: function() {
    return {
      name: "",
      roster: [],
      colors: ["#000"]
    };
  },
  render: function() {
    let prettyNumber = format(",.0f");
    let { name, schoolPoint, roster, colors,
      mean, median, meanRadius, medianRadius } = this.props;
    let prettyMean = prettyNumber(mean);
    let prettyMedian = prettyNumber(median);
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
              fill={colors.length >= 2 ? colors[1] : "#FFF"}
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
         fill={colors[0]} >
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
