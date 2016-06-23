import d3 from 'd3';

import { seasonsExperience } from '../../stats/experience';
import { chartBase } from '../../charts/base';
import { drawAxis } from '../../charts/axis';
import { addTitle, addLabel } from '../../charts/text';
import { verticalLegend } from '../../charts/legend';
import { meanProperty } from '../../helpers/average';
import { purple } from '../../helpers/colors';

export default function chartSeasonExperience(castMembers, holderID) {
  const experiences = seasonsExperience(castMembers);
  const meanPercent = meanProperty(experiences, 'mean');
  const tickValues = experiences.map(s => s.season);
  const yMax = Math.ceil(d3.max(experiences, d => d.mean));

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
    .domain([0, yMax])
    .range([base.main.height, 0]);

  // AXES
  const xAxis = d3.svg.axis()
    .scale(seasonScale)
    .orient('bottom')
    .tickValues(tickValues)
    .outerTickSize(0);

  const baseTicks = Array.from(new Array(yMax+1)).map((u,i) => i);
  const meanTicks = baseTicks.concat([meanPercent]).sort()
  const yAxis = d3.svg.axis()
    .scale(yScale)
    .tickValues(meanTicks)
    .orient('left');

  const yGrid = d3.svg.axis()
    .scale(yScale)
    .orient('right')
    .tickSize(base.main.width)
    .tickValues(baseTicks)
    .tickFormat('')
    .outerTickSize(0);

  drawAxis(base.bottom, xAxis, 'top');
  drawAxis(base.left, yAxis, 'right');
  drawAxis(base.main, yGrid, 'left');
  addTitle(base.top, 'Cast Member Experience');
  addLabel(base.bottom, 'Season', 'bottom');
  addLabel(base.left, 'Mean Years of Experience', 'left');

  // CHART
  const barWidth = seasonScale.rangeBand();
  base.main.element.append('g')
    .classed('bars', true)
    .selectAll('rect.bar')
        .data(experiences)
      .enter().append('rect')
        .classed('bar', true)
        .attr('x', d => seasonScale(d.season))
        .attr('y', d => yScale(d.mean))
        .attr('width', barWidth)
        .attr('height', d => base.main.height - yScale(d.mean))
        .style('fill', purple);

  const d3round = d3.format('.1f');
  const halfWidth = barWidth/2;
  const texts = base.main.element.append('g')
    .classed('text', true)
    .selectAll('text')
        .data(experiences)
      .enter().append('text')
        .text(d => d3round(d.mean))
        .attr('transform', (d,i) => {
          const x = seasonScale(i+1) + halfWidth;
          const y = yScale(d.mean) - 17;
          return `translate(${x},${y})`;
        })
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('font-size', 14);

  base.main.element.append('line')
    .attr('x1', 0)
    .attr('x2', base.main.width)
    .attr('y1', yScale(meanPercent))
    .attr('y2', yScale(meanPercent))
    .style('stroke-dasharray', '2, 5');
}
