import d3 from 'd3';

import { chartBase } from '../../charts/base';
import { drawAxis } from '../../charts/axis';
import { addTitle, addLabel } from '../../charts/text';
import { verticalLegend } from '../../charts/legend';
import { roundUp } from '../../helpers/round';
import { lightBlue, brightPink } from '../../helpers/colors';

const roleColors = [lightBlue, brightPink];

export default function chartGroupedSeasonGenders(seasons, holderID) {
  const tickValues = seasons.map(s => s.season);
  seasons.forEach(s => {
    s.rep_count = s.repertory.male + s.repertory.female;
    s.feat_count = s.featured.male + s.featured.female;
  })
  const yMax = roundUp(d3.max(seasons, s => Math.max(s.rep_count, s.feat_count)), 5);
  
  // BASE
  const base = chartBase({
    main: {width: 850, height: 300},
    left: {width: 50},
    bottom: {height: 50},
    top: {height: 30},
    right: { width: 100}
  }, holderID);

  // SCALES
  // the scale for each age group
  const seasonScale = d3.scale.ordinal()
    .domain(tickValues)
    .rangeRoundBands([0, base.bottom.width], 0.1);

  // the scale for each bar within an age group
  const groupScale = d3.scale.ordinal()
    .domain([0, 1])
    .rangeRoundBands([0, seasonScale.rangeBand()]);

  const yScale = d3.scale.linear()
    .domain([0, yMax])
    .range([base.main.height, 0]);

  // AXES
  const groupedXAxis = d3.svg.axis()
    .scale(seasonScale)
    .orient('bottom')
    .tickValues(tickValues)
    .outerTickSize(0);

  const yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(10)
    .orient('left');

  const yGrid = d3.svg.axis()
    .scale(yScale)
    .orient('right')
    .tickSize(base.main.width)
    .ticks(10)
    .tickFormat('')
    .outerTickSize(0);

  drawAxis(base.bottom, groupedXAxis, 'top');
  drawAxis(base.left, yAxis, 'right');
  drawAxis(base.main, yGrid, 'left');
  addTitle(base.top, 'SNL Cast Members Per Season (by Role)');
  addLabel(base.bottom, 'Season', 'bottom');
  addLabel(base.left, 'Count', 'left', 0);
  verticalLegend(base.right, [
    {color: roleColors[0], text: 'Repertory'},
    {color: roleColors[1], text: 'Featured'}
  ], {
    offset: {
      left: 10,
      top: 50
    }
  });

  // CHART
  const seasonGroups = base.main.element.selectAll('g.age')
      .data(seasons)
    .enter().append('g')
      .classed('age', true)
      .attr('transform', (d, i) => `translate(${seasonScale(d.season)}, 0)`)

  seasonGroups.selectAll('rect')
      .data(d => [d.rep_count, d.feat_count])
    .enter().append('rect')
      .attr('width', groupScale.rangeBand())
      .attr('x', (d,i) => groupScale(i))
      .attr('y', d => yScale(d))
      .attr('height', d => base.main.height - yScale(d))
      .style('fill', (d,i) => roleColors[i]);

}
