import React from "react";
import d3 from "d3";

export default React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    // d3 handle the rendering, so never update
    return false;
  },
  componentWillReceiveProps: function(nextProps) {
    return this.state.setup === true ? 
      this._d3Update(nextProps.teams) :
      this._d3Setup(nextProps.teams);
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
    let citiesSelection = teamsSelection.selectAll("circle.city")
    this.setState({
      teamsSelection: teamsSelection,
      citiesSelection: citiesSelection
    });
  },
  _d3Update: function(teams) {
    let { radius, opacity } = this.props;
    let { teamsSelection, citiesSelection } = this.state;
    teamsSelection
        .data(teams, d => d.name)
      .classed({
        hidden: d => !d.selected
      });
    citiesSelection
        .data(d => d.points)
      .attr("r", radius)
      .style("opacity", opacity);
  },
  _d3Setup: function(teams) {
    // 
    let { radius, opacity } = this.props;
    let teamsSelection = this.state.teamsSelection
      .data(teams, d => d.name);
    teamsSelection.enter().append("g")
      .classed({
        "team": true,
        "hidden": d => !d.selected
      })
      .style("fill", d => d.color);

    let citiesSelection = teamsSelection.selectAll("circle.city")
      .data(d => d.points);
    citiesSelection.enter().append("circle")
        .classed("city", true)
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("r", radius)
        .style("opacity", opacity);
    this.setState({
      teamsSelection: teamsSelection,
      citiesSelection: citiesSelection,
      setup: true
    });
  }
});
