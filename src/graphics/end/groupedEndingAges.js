import { chartBase } from '../../charts/base';
import { drawAxis } from '../../charts/axis';
import { addTitle, verticalLegend } from '../../charts/addons';
import { roundUp } from '../../round';
import { genderColors } from '../../colors';

export default function chartGroupedEndingAges(data, holderID) {
  // normalize the genders to cover the same time frame
  const { male, female } = data;
  const { ages, offset } = mergeAges(male, female);
  const tickValues = Array.from(new Array(ages.length)).map((u, i) => i+offset);
  
  const base = chartBase({
    main: {width: 650, height: 300},
    left: {width: 50},
    bottom: {height: 50},
    top: {height: 30},
    right: { width: 100}
  }, holderID);

  // the scale for each age group
  const ageScale = d3.scale.ordinal()
    .domain(tickValues)
    .rangeRoundBands([0, base.bottom.width], 0.1);

  // the scale for each bar within an age group
  const groupScale = d3.scale.ordinal()
    .domain([0, 1])
    .rangeRoundBands([0, ageScale.rangeBand()]);

  const yMax = roundUp(d3.max(ages, (a) => Math.max(a[0], a[1])), 5);

  const yScale = d3.scale.linear()
    .domain([0, yMax])
    .range([base.main.height, 0]);

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

  addTitle(base.top, 'Ending Age of SNL Cast Members (by Gender)');

  verticalLegend(base.right, [
    {
      color: genderColors[0],
      text: 'Male'
    },
    {
      color: genderColors[1],
      text: 'Female'
    }
  ], {
    offset: {
      left: 10,
      top: 50
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
function mergeAges(male, female) {
  const ms = male.end.ages;
  const fs = female.end.ages;

  const youngestMale = ms.offset;
  const oldestMale = ms.offset + ms.ages.length;

  const youngestFemale = fs.offset;
  const oldestFemale = fs.offset + fs.ages.length;

  const youngest = Math.min(youngestMale, youngestFemale);
  const oldest = Math.max(oldestMale, oldestFemale)

  const paddedMales = zeroPadArray(ms.ages, youngestMale - youngest, oldest - oldestMale);
  const paddedFemales = zeroPadArray(fs.ages, youngestFemale - youngest, oldest - oldestFemale);

  return {
    ages: paddedMales.map((u, index) => [paddedMales[index], paddedFemales[index]]),
    offset: youngest
  };
}

function zeroPadArray(arr, front, back) {
  return [...Array.from(new Array(front)).fill(0), ...arr, ...Array.from(new Array(back).fill(0))];
}