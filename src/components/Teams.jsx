import React from "react";
import d3 from "d3";
import Schools from "./Schools";
import Hometowns from "./Hometowns";
import Medians from "./Medians";
import Means from "./Means";

export default React.createClass({
  render: function() {
    let { teams, opacity, radius, showMeans, showMedians, showSchools } = this.props;
    return (
      <g>
        <Means teams={teams}
               hidden={!showMeans} />
        <Medians teams={teams}
                 hidden={!showMedians} />
        <Hometowns teams={teams}
                   radius={radius}
                   opacity={opacity} />
        <Schools teams={teams}
                 hidden={!showSchools} />
      </g>
    );
  }
});
