import d3 from 'd3';

import { chartBase } from '../../charts/base';
import { drawAxis } from '../../charts/axis';
import { addTitle, addLabel } from '../../charts/text';
import { verticalLegend } from '../../charts/legend';
import { roundUp, roundDown } from '../../helpers/round';
import { daysToYears } from '../../helpers/date';
import { genderColors } from '../../helpers/colors';
import { meanProperty, standardDeviation } from '../../helpers/average';

const [maleColor, femaleColor] = genderColors;

export default function chartStartingAges(castMembers, holderID) {
  const filteredCastMembers = castMembers
    .filter(cm => cm.start_age !== undefined )
    .sort((a,b) => a.start_age - b.start_age);
  let minSeason = Infinity;
  let maxSeason = -Infinity;
  const startSeasons = filteredCastMembers.forEach(cm => {
    const fs = cm.firstSeason;
    if ( fs < minSeason ) {
      minSeason = fs;
    } 
    if ( fs > maxSeason ) {
      maxSeason = fs;
    }
  });
  const tickValues = Array.from(new Array(maxSeason-minSeason+1)).map((u,i) => i+minSeason);
  const maxYears = roundUp(daysToYears(d3.max(filteredCastMembers, cm => cm.start_age)), 5);
  const minYears = roundDown(daysToYears(d3.min(filteredCastMembers, cm => cm.start_age)), 5);
  const meanStartAge = meanProperty(filteredCastMembers, 'start_age');
  const startAgeStdDev = standardDeviation(filteredCastMembers, 'start_age', meanStartAge);

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
    .domain([minYears, maxYears])
    .range([base.main.height, 0]);

  // AXES
  const xAxis = d3.svg.axis()
    .scale(seasonScale)
    .orient('bottom')
    .tickValues(tickValues)
    .outerTickSize(0);

  const yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(10)
    .orient('left');

  drawAxis(base.bottom, xAxis, 'top');
  drawAxis(base.left, yAxis, 'right');
  addTitle(base.top, 'Starting Age By Season');
  addLabel(base.bottom, 'Season', 'bottom');
  addLabel(base.left, 'Starting Age', 'left');
  verticalLegend(base.right, [
    {color: maleColor, text: 'Male'},
    {color: femaleColor, text: 'Female'}
  ], {
    offset: {
      left: 10,
      top: 100
    }
  });

  base.main.element.append('g')
    .classed('scale-bars', true)
      .selectAll('rect')
          .data(tickValues)
        .enter().append('rect')
          .attr('x', d => seasonScale(d))
          .attr('y', 0)
          .attr('width', seasonScale.rangeBand())
          .attr('height', base.main.height);

  const lowAge = daysToYears(meanStartAge - startAgeStdDev);
  const highAge = daysToYears(meanStartAge + startAgeStdDev);
  const meanAge = daysToYears(meanStartAge);

  const line = d3.svg.line()
    .x(d => d[0])
    .y(d => yScale(d[1]))
    .interpolate('linear-closed');

  base.main.element.append('path')
    .datum([[0,lowAge], [0, highAge], [base.main.width, highAge], [base.main.width, lowAge]])
    .attr('d', line)
    .style('fill', '#000')
    .style('opacity', 0.1)
    .style('stroke-width', 0);

  base.main.element.append('line')
    .attr('x1', 0)
    .attr('x2', base.main.width)
    .attr('y1', yScale(meanAge))
    .attr('y2', yScale(meanAge));

  // CHART
  const halfWidth = seasonScale.rangeBand() / 2;
  // create a group for every age
  const circles = base.main.element.selectAll('circle')
      .data(filteredCastMembers)
    .enter().append('circle')
      .attr('r', 4)
      .attr('cx', d => seasonScale(d.firstSeason) + halfWidth)
      .attr('cy', d => yScale(daysToYears(d.start_age)))
      .style('fill', d => d.gender === 'male' ? maleColor : femaleColor)
      .style('stroke', '#222')
      .style('stroke-width', 1)
  circles.append('title')
    .text(d => {
      const years = daysToYears(d.start_age).toFixed(2);
      return `${d.name} - ${years}`;
    });
}
