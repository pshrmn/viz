import React from "react";
import d3 from "d3";

export default React.createClass({
  getDefaultProps: function() {
    return {
      name: "",
      states: [],
      color: "#222",
      width: 700,
      height: 100,
      marginTop: 30,
      marginRight: 5,
      marginBottom: 30,
      marginLeft: 5,
      min: 1
    };
  },
  render: function() {
    let { width, height, marginTop, marginRight, marginBottom, marginLeft,
      states, color, min } = this.props;

    // only draw states with > 1 person
    let filteredStates = states.filter(s => s.count >= min)
      .sort((a,b) => {
      return b.count - a.count;
    });
    let otherCount = 0;
    states.forEach(s => {
      if ( s.count < min ) {
        otherCount += s.count;
      }
    });
    filteredStates.push({
      name: "Other",
      count: otherCount
    }); 

    let maxCount = d3.max(states, (ele) => {
      return ele.count;
    }) || 0;
    let yScale = d3.scale.linear()
      .domain([0, maxCount])
      .range([height, 0]);
    let xScale = d3.scale.ordinal()
      .domain(filteredStates.map(s => s.name))
      .rangeBands([0, width], 0.1);
    return (
      <svg className="state-bar-chart"
           width={marginLeft + width + marginRight}
           height={marginTop + height + marginBottom}>
        <g ref="barChart"
            transform={`translate(${marginLeft},${marginTop})`}>
          <AxisTicks ticks={filteredStates}
                     scale={xScale}
                     height={height} />
          <Bars states={filteredStates}
                xScale={xScale}
                yScale={yScale}
                height={height}
                color={color} />
          <BarTexts states={filteredStates}
                    xScale={xScale}
                    yScale={yScale} />
        </g>
      </svg>
    );
  }
});

let Bars = React.createClass({
  render: function() {
    let { states, xScale, yScale, height, color } = this.props;
    let bars = states.map((state, index) => {
      let x = xScale(state.name);
      let y = yScale(state.count);
      return (
        <rect key={index}
              x={x}
              y={y}
              height={height - y}
              width={xScale.rangeBand()} />
      );
    });
    return (
      <g className="bars"
         fill={color}>
        {bars}
      </g>
    );
  }
});

let BarTexts = React.createClass({
  render: function() {
    let { states, xScale, yScale } = this.props;
    let texts = states.map((state, index) => {
      return (
        <text key={index}
              className="count"
              x={xScale(state.name) + xScale.rangeBand()/2}
              y={yScale(state.count) - 2}
              text={state.count}>
          {state.count}
        </text>
      );
    });
    return (
      <g className="texts">
        {texts}
      </g>
    );
  }
});

// specific case: draws an x axis on the bottom of the chart
// only renders ticks and text labels
let AxisTicks = React.createClass({
  render: function() {
    let { ticks, scale, height } = this.props;
    let marks = ticks.map((tick, index) => {
      let xOffset = scale(tick.name) + scale.rangeBand()/2;
      return (
        <g key={index}
           className="tick"
           transform={`translate(${xOffset}, 0)`}>
          <line y2="6" x2="0"></line>
          <text dy="0.715em" y="9" x="0">
            {tick.name}
          </text>
        </g>
      );
    });
    return (
      <g className="axis"
         transform={`translate(0, ${height})`}>
        {marks}
      </g>
    );
  }
})
