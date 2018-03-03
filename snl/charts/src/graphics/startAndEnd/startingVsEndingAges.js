import d3 from 'd3';

import { chartBase } from '../../charts/base';
import { drawAxis } from '../../charts/axis';
import { addTitle, addLabel } from '../../charts/text';
import { verticalLegend } from '../../charts/legend';
import { roundUp, roundDown } from '../../helpers/round';
import { darkGreen } from '../../helpers/colors';
import { daysToYears, yearsToDays } from '../../helpers/date';
import mergeData from '../../helpers/merge';

export default function chartStartingVsEndingAges(castMembers, holderID) {
  const filteredCastMembers = castMembers.filter(cm => cm.start_age !== undefined && cm.end_age !== undefined)
  // determine the minimum and maximum age (in days)
  const minAges = d3.min(filteredCastMembers, cm => Math.min(cm.start_age, cm.end_age));
  const maxAges = d3.max(filteredCastMembers, cm => Math.max(cm.start_age, cm.end_age));
  // convert these to years and round (up for max, down for min)
  const minYears = roundDown(daysToYears(minAges), 5);
  const maxYears = roundUp(daysToYears(maxAges), 5)
  // convert back to days
  const minDays = yearsToDays(minYears);
  const maxDays = yearsToDays(maxYears);

  // BASE
  const base = chartBase({
    main: {width: 500, height: 500},
    left: {width: 50},
    bottom: {height: 50},
    top: {height: 30},
    right: { width: 100}
  }, holderID);

  // SCALES
  // the scale for each age group
  const startAgeScale = d3.scale.linear()
    .domain([minDays, maxDays])
    .range([0, base.main.width]);

  const endAgeScale = d3.scale.linear()
    .domain([minDays, maxDays])
    .range([base.main.height, 0]);

  const ageTicks = Array.from(new Array(maxYears-minYears+1))
    .map((u,i) => i+minYears)
    .filter(years => years % 5 === 0)
    .map(years => yearsToDays(years));

  // AXES
  const noDec = d3.format('.0f');
  const formatYears = days => noDec(daysToYears(days));
  const xAxis = d3.svg.axis()
    .scale(startAgeScale)
    .orient('bottom')
    .tickFormat(formatYears)
    .tickValues(ageTicks);

  const yAxis = d3.svg.axis()
    .scale(endAgeScale)
    .orient('left')
    .tickFormat(formatYears)
    .tickValues(ageTicks);

  drawAxis(base.bottom, xAxis, 'top');
  drawAxis(base.left, yAxis, 'right');

  addTitle(base.top, 'Starting vs Ending Ages of SNL Cast Members');
  addLabel(base.bottom, 'Starting Age', 'bottom');
  addLabel(base.left, 'Ending Age', 'left')

  const yearLineData = [];
  for ( let i = 0; i < maxYears-minYears; i++ ) {
    const lowY = endAgeScale(minDays + yearsToDays(i));
    const highX = startAgeScale(maxDays - yearsToDays(i));
    yearLineData.push([[0,lowY],[highX,0]]);
  }
  base.main.element.append('g')
    .classed('year-lines', true)
    .selectAll('line')
        .data(yearLineData)
      .enter().append('line')
        .attr('x1', d => d[0][0])
        .attr('y1', d => d[0][1])
        .attr('x2', d => d[1][0])
        .attr('y2', d => d[1][1]);

  // CHART
  const circles = base.main.element.selectAll('circle')
      .data(filteredCastMembers)
    .enter().append('circle')
      .attr('r', 2)
      .style('fill', darkGreen)
      .style('stroke', '#000')
      .style('stroke-width', 1)
      .attr('cx', d => startAgeScale(d.start_age))
      .attr('cy', d => endAgeScale(d.end_age));

  circles.append('title')
    .text(d => d.name);
}
