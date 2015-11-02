import React from "react";
import d3 from "d3";

export default React.createClass({
  getDefaultProps: function() {
    return {
      name: "",
      states: [],
      color: "#222",
      width: 700,
      height: 200,
      margin: 30
    };
  },
  render: function() {
    let { width, height, margin,
      name, states, color } = this.props;

    // only draw states with > 1 person
    let filteredStates = states.filter(s => s.count > 1)
      .sort((a,b) => {
      return b.count - a.count;
    });
    let otherCount = 0;
    states.forEach(s => {
      if ( s.count === 1 ) {
        otherCount++
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
           width={width + margin*2}
           height={height + margin*2}>
        <g ref="barChart"
            transform={`translate(${margin},${margin})`}>
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
  },
  drawChart: function(props) {

    // draw the bars
    let bars = svg.selectAll("rect.bar")
      .data(filteredStates, bar => bar.name)
    bars.enter().append("rect").classed("bar", true);

    bars
      .attr("x", d => xScale(d.name))
      .attr("y", d => yScale(d.count))
      .attr("height", d => height - yScale(d.count))
      .attr("width", xScale.rangeBand())
      .style("fill", color);

    bars.exit().remove();

    let texts = svg.selectAll("text.count")
      .data(filteredStates, bar => bar.name);
    texts.enter().append("text").classed("count", true);
    texts
      .attr("x", d => xScale(d.name) + xScale.rangeBand()/2)
      .attr("y", d=> yScale(d.count) - 2)
      .text(d => d.count);
    texts.exit().remove();
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
