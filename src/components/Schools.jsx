import React from "react";

export default React.createClass({
  render: function() {
    let { teams, hidden } = this.props;
    let opacity = 0.1;
    let schools = teams.map((team, index) => {
      let className = team.selected ? "school" : "school hidden";
      return (
        <circle key={index}
                className={className}
                r="5"
                fill={team.color}
                cx={team.schoolPoint[0]}
                cy={team.schoolPoint[1]}>
          <title>{team.name}</title>
        </circle>
      );
    });
    let classNames = ["schools"];
    if ( hidden ) {
      classNames.push("hidden");
    }
    return (
      <g className={classNames.join(" ")}>
        {schools}
      </g>
    );
  }
});
