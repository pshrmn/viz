import { chartBase } from '../charts/base';
import { drawAxis } from '../charts/axis';
import { addTitle, verticalLegend } from '../charts/addons';
import { roundUp } from '../round';
import { lightBlue, brightPink } from '../colors';

const colors = [lightBlue, brightPink];

export default function chartStartingAndEndingAges(data, holderID) {
  // normalize the genders to cover the same time frame
  const { start, end } = data.all;
  const { ages, offset } = mergeAges(start, end);
  const tickValues = Array.from(new Array(ages.length)).map((u, i) => i+offset);
  
  /*
   * CREATE SVG ELEMENTS
   */
  const base = chartBase({
    main: {width: 650, height: 300},
    left: {width: 50},
    bottom: {height: 50},
    top: {height: 30},
    right: { width: 100}
  }, holderID);

  /*
   * CREATE SCALES
   */
  // the scale for each age group
  const ageScale = d3.scale.ordinal()
    .domain(tickValues)
    .rangeRoundBands([0, base.bottom.width], 0.1);

  // the scale for each bar within an age group
  const groupScale = d3.scale.ordinal()
    .domain([0, 1])
    .rangeRoundBands([0, ageScale.rangeBand()]);

  let yMax = d3.max(ages, (a) => Math.max(a[0], a[1]));
  yMax = roundUp(yMax*100, 3)/100
  const formatPercent = d3.format('.0%');

  const yScale = d3.scale.linear()
    .domain([0, yMax])
    .range([base.main.height, 0]);

  /*
   * CREATES AXES
   */

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

  /*
   * DRAW AXES
   */
  drawAxis(base.bottom, groupedXAxis, 'top');
  drawAxis(base.left, yAxis, 'right');
  drawAxis(base.main, yGrid, 'left');

  /*
   * DRAW CHART
   */
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
      .style('fill', (d,i) => colors[i]);

  /*
   * DRAW ADDONS
   */
  addTitle(base.top, 'Starting and Ending Ages of SNL Cast Members');
  verticalLegend(base.right, [
    {
      color: colors[0],
      text: 'Start'
    },
    {
      color: colors[1],
      text: 'End'
    }
  ], {
    offset: {
      left: 10,
      top: 100
    }
  });

  base.bottom.element.append('text')
    .text('Age (Rounded Down)')
    .classed('centered', true)
    .attr('transform', `translate(${base.bottom.width/2}, ${base.bottom.height-5})`)
}

/*
 * merge the male and female ages so that they can be displaed side by side in a bar chart
 */
function mergeAges(start, end) {
  const sa = start.ages;
  const ea = end.ages;

  const totalStart = sa.ages.reduce((acc, curr) => {
    return acc + curr;
  }, 0);

  const totalEnd = ea.ages.reduce((acc, curr) => {
    return acc + curr;
  }, 0);

  const startPercents = sa.ages.map(count => count / totalStart);
  const endPercents = ea.ages.map(count => count / totalEnd);

  const youngestStart = sa.offset;
  const oldestStart = sa.offset + sa.ages.length;

  const youngestEnd = ea.offset;
  const oldestEnd = ea.offset + ea.ages.length;

  const youngest = Math.min(youngestStart, youngestEnd);
  const oldest = Math.max(oldestStart, oldestEnd)

  const paddedStarts = zeroPadArray(startPercents, youngestStart - youngest, oldest - oldestStart);
  const paddedEnds = zeroPadArray(endPercents, youngestEnd - youngest, oldest - oldestEnd);

  return {
    ages: paddedStarts.map((u, index) => [paddedStarts[index], paddedEnds[index]]),
    offset: youngest
  };
}

function zeroPadArray(arr, front, back) {
  return [...Array.from(new Array(front)).fill(0), ...arr, ...Array.from(new Array(back).fill(0))];
}