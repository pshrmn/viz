import d3 from 'd3';

import { chartBase } from '../../charts/base';
import { drawAxis } from '../../charts/axis';
import { addTitle, addLabel } from '../../charts/text';
import { verticalLegend } from '../../charts/legend';
import { roundUp } from '../../helpers/round';
import { lightGreen, darkGreen } from '../../helpers/colors';
import groupBy from '../../helpers/groupBy'

export default function chartTotalCredits(castMembers, holderID) {
  // round each cast members credits down to the nearest 5
  const tens = groupBy(castMembers, 'credits', n => Math.floor(n/5));
  const highTen = d3.max(Object.keys(tens), d => parseInt(d, 10));
  // don't just convert to an array because we want to fill in missing 10s
  const creditGroups = Array.from(new Array(highTen+1)).map((u,i) => {
    return {
      key: i*5,
      count: tens[i] !== undefined ?  tens[i].length : 0
    }
  });
  const xKeys = creditGroups.map(cg => cg.key);
  const yMax = roundUp(d3.max(creditGroups, cg => cg.count), 5);

  // determine the "tipping point" where the chart represents 50% of the cast
  const tippingPoint = castMembers.length / 2;
  let triggerCount = null;
  creditGroups.reduce((acc, curr) => {
    if ( triggerCount !== null ) {
      return acc;
    }
    acc += curr.count;
    if ( acc > tippingPoint ) {
      triggerCount = curr.key
    }
    return acc;
  }, 0);

  // BASE
  const base = chartBase({
    main: {width: 850, height: 300},
    left: {width: 50},
    bottom: {height: 50},
    top: {height: 30},
    right: { width: 110}
  }, holderID);

  // SCALES
  const tensScale = d3.scale.ordinal()
    .domain(xKeys)
    .rangeRoundBands([0, base.bottom.width], 0.1, 0);

  const yScale = d3.scale.linear()
    .domain([0, yMax])
    .range([base.main.height, 0]);

  // AXES
  const xAxis = d3.svg.axis()
    .scale(tensScale)
    .orient('bottom')
    .tickValues(xKeys.filter(n => n % 10 === 0))
    .outerTickSize(0);


  const yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .ticks(10);

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
  addTitle(base.top, 'Total SNL Episode Credits');
  addLabel(base.bottom, 'Episode Credits (Rounded Down to Nearest 5)', 'bottom');
  addLabel(base.left, '# of Cast Members', 'left');
  verticalLegend(base.right, [
    {color: lightGreen, text: 'Bottom 50%'},
    {color: darkGreen, text: 'Top 50%'}
  ], {
    offset: {
      left: 10,
      top: 50
    }
  });
  // CHART
  const bandWidth = tensScale.rangeBand();
  base.main.element.selectAll('rect')
      .data(creditGroups)
    .enter().append('rect')
      .attr('width', bandWidth)
      .attr('x', d => tensScale(d.key) + bandWidth/2)
      .attr('y', d => yScale(d.count))
      .attr('height', d => base.main.height - yScale(d.count))
      .style('fill', d => d.key < triggerCount ? lightGreen : darkGreen);
}
