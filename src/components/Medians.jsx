import React from "react";

export default React.createClass({
  render: function() {
    let { teams, hidden } = this.props;
    let opacity = 0.1;
    let medians = teams.map((team, index) => {
      let className = team.selected ? "median" : "median hidden";
      return (
        <circle key={index}
                className={className}
                r={team.medianRadius}
                cx={team.schoolPoint[0]}
                cy={team.schoolPoint[1]}>
          <title>{`${team.name} median: ${team.median} miles`}</title>
        </circle>
      );
    });
    let classNames = ["medians"];
    if ( hidden ) {
      classNames.push("hidden");
    }
    return (
      <g className={classNames.join(" ")}>
        {medians}
      </g>
    );
  }
});
