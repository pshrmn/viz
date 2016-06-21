import d3 from 'd3';

import { chartBase } from '../../charts/base';
import { drawAxis } from '../../charts/axis';
import { addTitle, addLabel } from '../../charts/text';
import { verticalLegend } from '../../charts/legend';
import { roundUp } from '../../helpers/round';
import { genderColors } from '../../helpers/colors';
import mergeData from '../../helpers/merge';

export default function chartGroupedStartingAges(data, holderID) {
  const { male, female } = data;
  const { data: ages, offset } = mergeData(
    {data: male.start.ages.ages, offset: male.start.ages.offset},
    {data: female.start.ages.ages, offset: female.start.ages.offset}
  );
  const tickValues = Array.from(new Array(ages.length)).map((u, i) => i+offset);
  const yMax = roundUp(d3.max(ages, (a) => Math.max(a[0], a[1])), 5);
  
  // BASE
  const base = chartBase({
    main: {width: 650, height: 300},
    left: {width: 50},
    bottom: {height: 50},
    top: {height: 30},
    right: { width: 100}
  }, holderID);

  // SCALES
  // the scale for each age group
  const ageScale = d3.scale.ordinal()
    .domain(tickValues)
    .rangeRoundBands([0, base.bottom.width], 0.1);

  // the scale for each bar within an age group
  const groupScale = d3.scale.ordinal()
    .domain([0, 1])
    .rangeRoundBands([0, ageScale.rangeBand()]);

  const yScale = d3.scale.linear()
    .domain([0, yMax])
    .range([base.main.height, 0]);

  // AXES
  const groupedXAxis = d3.svg.axis()
    .scale(ageScale)
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
  addTitle(base.top, 'Starting Age of SNL Cast Members (by Gender)');
  addLabel(base.bottom, 'Age (Rounded Down)', 'bottom');
  verticalLegend(base.right, [
    {color: genderColors[0], text: 'Male'},
    {color: genderColors[1], text: 'Female'}
  ], {
    offset: {
      left: 10,
      top: 100
    }
  });

  // create a group for every age
  const ageGroups = base.main.element.selectAll('g.age')
      .data(ages)
    .enter().append('g')
      .classed('age', true)
      .attr('transform', (d, i) => `translate(${ageScale(i+offset)}, 0)`)

  ageGroups.selectAll('rect')
      .data(d => d)
    .enter().append('rect')
      .attr('width', groupScale.rangeBand())
      .attr('x', (d,i) => groupScale(i))
      .attr('y', d => yScale(d))
      .attr('height', d => base.main.height - yScale(d))
      .style('fill', (d,i) => genderColors[i]);

}
