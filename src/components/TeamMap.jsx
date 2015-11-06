import React from "react";
import { format } from "d3";

/*
 * TeamMap
 * -------
 * Render a school on a map as determined by a projection function
 * (ie longitude/latitude converted to x/y)
 *
 * Props:
 * name - the name of the school
 * schoolPoint - the [x,y] coordinates of the school
 * roster - an array of players' hometowns made up of city, state, latitude, longitude, football
 *    position, and point which is the [x,y] coordinates of the city in the map
 * colors - an array of school colors. The first color is considered the primary color of the school.
 *    If there is a second color in the array, it is considered the secondary color, otherwise
 *    default values will be used in place of the secondary color.
 * mean - the mean distance of players' hometowns to the school
 * median - the median distance of players' hometowns to the school
 * meanRadius - mean distance converted to pixel distance in the projection
 * medianRadius - median distance converted to pixel distance in the projection
 */
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
        <title>{name}</title>
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
