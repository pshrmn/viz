import d3 from 'd3';

import { chartBase } from '../../charts/base';
import { drawAxis } from '../../charts/axis';
import { addTitle, addLabel } from '../../charts/text';
import { roundUp, roundDown } from '../../helpers/round';
import { darkGreen } from '../../helpers/colors';
import { daysToYears, yearsToDays } from '../../helpers/date';

export default function chartTotalCredits(castMembers, holderID) {
  const startingCastMembers = castMembers.filter(cm => cm.start_age !== undefined);
  const ageExtent = d3.extent(startingCastMembers, cm => cm.start_age);
  const maxCredits = d3.max(startingCastMembers, cm => cm.credits);
  // BASE
  const base = chartBase({
    main: {width: 700, height: 300},
    left: {width: 50},
    bottom: {height: 50},
    top: {height: 30},
    right: { width: 110}
  }, holderID);

  // SCALES

  //x
  // offset by 10 so low credit marks don't overlap the y axis
  const creditScale = d3.scale.linear()
    .domain([0, maxCredits])
    .range([0, base.main.width])

  //y
  const minYears = roundDown(daysToYears(ageExtent[0]), 5);
  const minDays = yearsToDays(minYears);
  const maxYears = roundUp(daysToYears(ageExtent[1]), 5)
  const maxDays = yearsToDays(maxYears);
  const ageScale = d3.scale.linear()
    .domain([minDays, maxDays])
    .range([base.main.height, 0])

  // AXES
  const xAxis = d3.svg.axis()
    .scale(creditScale)
    .orient('bottom');

  const yTicks = Array.from(new Array(maxYears-minYears+1))
    .map((u,i) => i+minYears)
    .filter(years => years % 5 === 0)
    .map(years => yearsToDays(years));

  const noDec = d3.format('.0f');
  const yAxis = d3.svg.axis()
    .scale(ageScale)
    .orient('left')
    .tickValues(yTicks)
    .tickFormat(d => noDec(daysToYears(d)));

  drawAxis(base.bottom, xAxis, 'top');
  drawAxis(base.left, yAxis, 'right');
  addTitle(base.top, 'Credits vs. Starting Age');
  addLabel(base.bottom, 'Credits', 'bottom');
  addLabel(base.left, 'Starting Age (Years)', 'left');

  // CHART
  const oneDec = d3.format('.1f');
  const castMemberCircles = base.main.element.selectAll('circle')
      .data(startingCastMembers)
    .enter().append('circle')
      .attr('r', 3)
      .style('fill', darkGreen)
      .style('stroke', '#000')
      .style('stroke-width', 1)
      .attr('cx', d => creditScale(d.credits))
      .attr('cy', d => ageScale(d.start_age));
  castMemberCircles.append('title')
    .text(d => `${d.name} - ${d.credits} credits, started at age ${oneDec(daysToYears(d.start_age))}`)
}
