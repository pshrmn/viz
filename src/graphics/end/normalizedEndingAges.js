import d3 from 'd3';

import { chartBase } from '../../charts/base';
import { drawAxis } from '../../charts/axis';
import { addTitle, addLabel } from '../../charts/text';
import { verticalLegend } from '../../charts/legend';
import { roundUp } from '../../helpers/round';
import { genderColors } from '../../helpers/colors';
import mergeData from '../../helpers/merge';

export default function chartNormalizedEndingAges(data, holderID) {
  const { male, female } = data;

  // NORMALIZE the counts per age as a percentage
  const maleEndAges = male.end.ages;
  const totalMale = maleEndAges.ages.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
  const malePercents = maleEndAges.ages.map(count => count / totalMale);

  const femaleEndAges = female.end.ages;
  const totalFemale = femaleEndAges.ages.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
  const femalePercents = femaleEndAges.ages.map(count => count / totalFemale);

  const { data: ages, offset } = mergeData(
    {data: malePercents, offset: maleEndAges.offset},
    {data: femalePercents, offset: femaleEndAges.offset}
  );

  const tickValues = Array.from(new Array(ages.length)).map((u, i) => i+offset);
  const yMax = roundUp(d3.max(ages, (a) => Math.max(a[0], a[1]))*100, 3) / 100;
  const formatPercent = d3.format('.0%');
  
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

  // create a tick every 3%
  const threePercTicks = [];
  let perc = 0;
  while ( perc <= yMax ) {
    threePercTicks.push(perc);
    perc += 0.03;
  }

  const yAxis = d3.svg.axis()
    .scale(yScale)
    .tickValues(threePercTicks)
    .orient('left')
    .tickFormat(formatPercent);

  const yGrid = d3.svg.axis()
    .scale(yScale)
    .orient('right')
    .tickSize(base.main.width)
    .tickValues(threePercTicks)
    .tickFormat('')
    .outerTickSize(0);

  drawAxis(base.bottom, groupedXAxis, 'top');
  drawAxis(base.left, yAxis, 'right');
  drawAxis(base.main, yGrid, 'left');

  addTitle(base.top, 'Ending Age of SNL Cast Members (by Gender)');
  addLabel(base.bottom, 'Age (Rounded Down', 'bottom');
  verticalLegend(base.right, [
    {color: genderColors[0], text: 'Male'},
    {color: genderColors[1], text: 'Female'}
  ], {
    offset: {
      left: 10,
      top: 100
    }
  });

  // CHART
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
