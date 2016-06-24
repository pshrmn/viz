import d3 from 'd3';

import { chartBase } from '../../charts/base';
import { drawAxis } from '../../charts/axis';
import { addTitle, addLabel } from '../../charts/text';
import { roundUp } from '../../helpers/round';
import { green } from '../../helpers/colors';

export default function chartEndingAges(data, holderID) {
  const { all } = data;
  const { ages, offset } = all.end.ages;

  const tickValues = Array.from(new Array(ages.length)).map((u, i) => i+offset);
  const yMax = roundUp(d3.max(ages), 5);
  
  // BASE
  const base = chartBase({
    main: {width: 650, height: 300},
    left: {width: 50},
    bottom: {height: 50},
    top: {height: 30},
    right: { width: 100}
  }, holderID);

  // SCALES
  const ageScale = d3.scale.ordinal()
    .domain(tickValues)
    .rangeRoundBands([0, base.bottom.width], 0.5);

  const yScale = d3.scale.linear()
    .domain([0, yMax])
    .range([base.main.height, 0]);

  // AXES
  const xAxis = d3.svg.axis()
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

  drawAxis(base.bottom, xAxis, 'top');
  drawAxis(base.left, yAxis, 'right');
  drawAxis(base.main, yGrid, 'left');

  addTitle(base.top, 'Ending Age of SNL Cast Members');
  addLabel(base.bottom, 'Age (Rounded Down', 'bottom');
  addLabel(base.left, 'Count', 'left', 0);

  // CHART
  const halfWidth = ageScale.rangeBand();
  base.main.element.selectAll('rect')
      .data(ages)
    .enter().append('rect')
      .attr('width', halfWidth)
      .attr('x', (d,i) => ageScale(i+offset))
      .attr('y', d => yScale(d))
      .attr('height', d => base.main.height - yScale(d))
      .style('fill', green);
}
