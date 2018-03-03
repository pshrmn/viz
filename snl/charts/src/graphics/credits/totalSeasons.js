import d3 from 'd3';

import { chartBase } from '../../charts/base';
import { drawAxis } from '../../charts/axis';
import { addTitle, addLabel } from '../../charts/text';
import { verticalLegend } from '../../charts/legend';
import { roundUp } from '../../helpers/round';
import { lightGreen, darkGreen } from '../../helpers/colors';
import { daysToYears } from '../../helpers/date';

export default function chartTotalCredits(castMembers, holderID) {
  const castMemberSeasons = castMembers.map(cm => cm.total_seasons);
  const maxSeasons = d3.max(castMemberSeasons);
  const seasonCounts = Array.from(new Array(maxSeasons)).fill(0);
  castMemberSeasons.forEach(count => { seasonCounts[count-1]++; });
  const maxCounts = d3.max(seasonCounts);
  const seasonTicks = seasonCounts.map((u,i) => i+1);

  // determine the "tipping point" where the chart represents 50% of the cast
  const tippingPoint = castMembers.length / 2;
  let triggerCount = null;
  seasonCounts.reduce((acc, curr, i) => {
    if ( triggerCount !== null ) {
      return acc;
    }
    acc += curr;
    if ( acc > tippingPoint ) {
      triggerCount = i
    }
    return acc;
  }, 0);

  // BASE
  const base = chartBase({
    main: {width: 500, height: 300},
    left: {width: 50},
    bottom: {height: 50},
    top: {height: 30},
    right: { width: 110}
  }, holderID);

  // SCALES
  //x
  const seasonScale = d3.scale.ordinal()
    .domain(seasonTicks)
    .rangeRoundBands([0, base.main.width], 0.1);

  //y
  const countScale = d3.scale.linear()
    .domain([0, roundUp(maxCounts, 5)])
    .range([base.main.height, 0]);

  // AXES
  const xAxis = d3.svg.axis()
    .scale(seasonScale)
    .orient('bottom')
    .outerTickSize(0);

  const yAxis = d3.svg.axis()
    .scale(countScale)
    .orient('left')
    .ticks(10);

  drawAxis(base.bottom, xAxis, 'top');
  drawAxis(base.left, yAxis, 'right');
  addTitle(base.top, 'Total Seasons');
  addLabel(base.bottom, 'Seasons', 'bottom');
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
  const bandWidth = seasonScale.rangeBand();
  base.main.element.selectAll('rect')
      .data(seasonCounts)
    .enter().append('rect')
      .attr('width', bandWidth)
      .attr('x', (d,i) => seasonScale(i+1))
      .attr('y', d => countScale(d))
      .attr('height', d => base.main.height - countScale(d))
      .style('fill', (d,i) => i < triggerCount ? lightGreen : darkGreen);
}
