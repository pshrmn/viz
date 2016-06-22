import d3 from 'd3';

import { chartBase } from '../../charts/base';
import { drawAxis } from '../../charts/axis';
import { addTitle, addLabel } from '../../charts/text';
import { verticalLegend } from '../../charts/legend';
import { mean } from '../../helpers/average';
import { purple } from '../../helpers/colors';

export default function chartSeasonExperience(castMembers, holderID) {
  const seasonExperiences = calculateExperience(castMembers);
  const meanPercent = mean(seasonExperiences);
  const tickValues = seasonExperiences.map((s,i) => i + 1);
  const yMax = Math.ceil(d3.max(seasonExperiences));

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
    .rangeRoundBands([0, base.bottom.width], 0.1);

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
  addLabel(base.left, 'Mean Years Experience', 'left');

  // CHART

  const barWidth = seasonScale.rangeBand();
  base.main.element.append('g')
    .classed('bars', true)
    .selectAll('rect.bar')
        .data(seasonExperiences)
      .enter().append('rect')
        .classed('bar', true)
        .attr('x', (d,i) => seasonScale(i+1))
        .attr('y', d => yScale(d))
        .attr('width', barWidth)
        .attr('height', d => base.main.height - yScale(d))
        .style('fill', purple);

  const halfWidth = barWidth/2;
  const texts = base.main.element.append('g')
    .classed('text', true)
    .selectAll('text')
        .data(seasonExperiences)
      .enter().append('text')
        .text(d => Math.round(d*10)/10)
        .attr('transform', (d,i) => {
          const x = seasonScale(i+1) + halfWidth;
          const y = yScale(d) - 17;
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

function calculateExperience(castMembers) {
  const seasons = {}
  castMembers.forEach(cm => {
    let experience = 0;
    cm.featured.forEach(s => {
      if ( seasons[s] === undefined ) {
        seasons[s] = {
          total: 0,
          count: 0
        };
      }
      seasons[s].total += experience;
      seasons[s].count++;
      experience++;
    });
    cm.repertory.forEach(s => {
      if ( seasons[s] === undefined ) {
        seasons[s] = {
          total: 0,
          count: 0
        };
      }
      seasons[s].total += experience;
      seasons[s].count++;
      experience++;
    });
  })
  const seasonKeys = Object.keys(seasons);
  const seasonExperiences = Array.from(new Array(seasonKeys.length)).fill(0);
  seasonKeys.forEach(key => {
    const { total, count } = seasons[key];
    seasonExperiences[key-1] = total / count;
  });
  return seasonExperiences;
}