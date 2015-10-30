import React from "react";

export default React.createClass({
  render: function() {
    let { teams, hidden } = this.props;
    let opacity = 0.1;
    let means = teams.map((team, index) => {
      let className = team.selected ? "mean" : "mean hidden";
      return (
        <circle key={index}
                className={className}
                r={team.meanRadius}
                cx={team.schoolPoint[0]}
                cy={team.schoolPoint[1]}>
          <title>{`${team.name} mean: ${team.mean} miles`}</title>
        </circle>
      );
    });
    let classNames = ["means"];
    if ( hidden ) {
      classNames.push("hidden");
    }
    return (
      <g className={classNames.join(" ")}>
        {means}
      </g>
    );
  }
});
