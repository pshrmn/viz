import React from "react";

export default React.createClass({
  getDefaultProps: function() {
    return {
      name: "",
      schoolPoint: [0,0],
      roster: []
    };
  },
  render: function() {
    let { name, schoolPoint, roster, color } = this.props;
    return (
      <g className="team"
         fill={color} >
        <circle className="school"
                r="5"
                cx={this.props.schoolPoint[0]}
                cy={this.props.schoolPoint[1]} >
          <title>{this.props.name}</title>
        </circle>
      </g>
    );
  }
});
