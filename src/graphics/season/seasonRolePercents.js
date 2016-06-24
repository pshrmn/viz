import d3 from 'd3';

import { chartBase } from '../../charts/base';
import { drawAxis } from '../../charts/axis';
import { addTitle, addLabel } from '../../charts/text';
import { verticalLegend } from '../../charts/legend';
import { meanProperty } from '../../helpers/average';
import { roundFloat } from '../../helpers/round';
import { lightBlue, brightPink } from '../../helpers/colors';

const roleColors = [lightBlue, brightPink];

export default function chartRolePercents(seasons, holderID) {
  seasons.forEach(s => {
    const rep_count = s.repertory.male + s.repertory.female;
    s.repertory_percent = rep_count / s.total_cast;
  });
  const tickValues = seasons.map(s => s.season);
  const formatPercent = d3.format('.0%');
  const meanPercent = meanProperty(seasons, 'repertory_percent');
  const roundMean = Math.round(meanPercent*100) / 100;
  // BASE
  const base = chartBase({
    main: {width: 900, height: 300},
    left: {width: 50},
    bottom: {height: 50},
    top: {height: 30},
    right: { width: 100}
  }, holderID);

  // SCALES
  const seasonScale = d3.scale.ordinal()
    .domain(tickValues)
    .rangeRoundBands([0, base.bottom.width], 0.1, 0);

  const yScale = d3.scale.linear()
    .domain([0, 1])
    .range([base.main.height, 0]);

  // AXES
  const xAxis = d3.svg.axis()
    .scale(seasonScale)
    .orient('bottom')
    .tickValues(tickValues)
    .outerTickSize(0);

  let perTicks = [0, 0.25, 0.5, 0.75, 1.0].concat(roundMean).sort()
  const yAxis = d3.svg.axis()
    .scale(yScale)
    .tickValues(perTicks)
    .orient('left')
    .tickFormat(formatPercent);

  drawAxis(base.bottom, xAxis, 'top');
  drawAxis(base.left, yAxis, 'right');
 
  addTitle(base.top, 'Cast Member Role Percents');
  addLabel(base.bottom, 'Season', 'bottom');
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
  const bandWidth = seasonScale.rangeBand();
  const bars = base.main.element.append('g')
    .classed('bars', true)
    .selectAll('g.bar')
        .data(seasons)
      .enter().append('g')
        .classed('bar', true)
        .attr('transform', d => `translate(${seasonScale(d.season)},0)`)

  bars.append('rect')
    .classed('rep-percent', true)
    .attr('width', bandWidth)
    .attr('x', 0)
    .attr('y', d => yScale(d.repertory_percent))
    .attr('height', d => base.main.height - yScale(d.repertory_percent))
    .style('fill', roleColors[0]);

  bars.append('rect')
    .classed('feat-percent', true)
    .attr('width', bandWidth)
    .attr('x', 0)
    .attr('y', 0)
    .attr('height', d => yScale(d.repertory_percent))
    .style('fill', roleColors[1]);

  /*
   * unline in seasonGenderPercents, here the percent text is separate from
   * the bars. This is done solely because the text here is a differnt color
   * than the mean line, and I want the mean line behind the text (but on top
   * of the bars).
   */
  // draw a line depicting the mean percentage
  base.main.element.append('line')
    .attr('x1', 0)
    .attr('x2', base.main.width)
    .attr('y1', yScale(meanPercent))
    .attr('y2', yScale(meanPercent))
    .style('stroke-dasharray', '2, 5');

  const halfWidth = bandWidth / 2;
  base.main.element.append('g')
    .classed('perc-tect', true)
    .selectAll('text.percent')
        .data(seasons)
      .enter().append('text')
        .classed('percent', true)
        .attr('transform', d => {
          const x = seasonScale(d.season) + halfWidth;
          const y = yScale(d.repertory_percent) + 15;
          return `translate(${x},${y})`;
        })
        .text(d => Math.floor((d.repertory_percent)*100))
        .style('text-anchor', 'middle')
        .style('font-size', '14px');


}
