import { chartBase } from '../charts/base';
import { drawAxis } from '../charts/axis';
import { addTitle, addLabel, verticalLegend } from '../charts/addons';
import { roundUp } from '../helpers/round';
import { lightBlue, brightPink } from '../helpers/colors';
import mergeData from '../helpers/merge';

const colors = [lightBlue, brightPink];

export default function chartStartingAndEndingAges(data, holderID) {
  const { start, end } = data.all;

  // NORMALIZE the counts per age as a percentage
  const startAges = start.ages;
  const totalStart = startAges.ages.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
  const startPercents = startAges.ages.map(count => count / totalStart);

  const endAges = end.ages;
  const totalEnd = endAges.ages.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
  const endPercents = endAges.ages.map(count => count / totalEnd);

  const { data: ages, offset } = mergeData(
    {data: startPercents, offset: startAges.offset},
    {data: endPercents, offset: endAges.offset}
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

  const yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(10)
    .orient('left')
    .tickFormat(formatPercent);

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

  addTitle(base.top, 'Starting and Ending Ages of SNL Cast Members');
  addLabel(base.bottom, 'Age (Rounded Down)', 'bottom');
  verticalLegend(base.right, [
    {color: colors[0], text: 'Start'},
    {color: colors[1], text: 'End'}
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
      .style('fill', (d,i) => colors[i]);
}
