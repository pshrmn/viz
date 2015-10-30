import React from "react";
import d3 from "d3";

export default React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    // d3 handle the rendering, so never update
    return false;
  },
  componentWillReceiveProps: function(nextProps) {
    this._d3Select(nextProps.teams)
  },
  render: function() {
    // we want want for the component is the holder (with a ref to it for easy access)
    // d3 will handle all of the rendering
    return (
      <g className="hometowns" ref="hometowns"></g>
    );
  },
  componentDidMount: function() {
    // draw all of the teams the first time the component is rendered
    let teamsSelection = d3.select(this.refs.hometowns).selectAll("g.team");
    this.setState({
      teamsSelection: teamsSelection
    });
  },
  _d3Select: function(teams) {
    let teamsSelection = this.state.teamsSelection
      .data(teams, d => d.name)
    teamsSelection.enter().append("g")
      .classed({
        "team": true,
        "hidden": d => !d.selected
      })
      .style("fill", d => d.color)
    let cities = teamsSelection.selectAll("circle.city")
        .data(d => d.points)
      .enter().append("circle")
        .classed("city", true)
        .attr("cx", d => d[0])
        .attr("cy", d => d[1]);

    cities
      .attr("r", this.props.radius)
      .style("opacity", this.props.opacity);

    teamsSelection.classed({
      "hidden": d => !d.selected
    });
    this.setState({
      teamsSelection: teamsSelection
    });
  }
});
