import d3 from 'd3';

import { chartBase } from '../../charts/base';
import { drawAxis } from '../../charts/axis';
import { addTitle, addLabel } from '../../charts/text';
import { roundUp, roundFloat } from '../../helpers/round';
import { meanProperty } from '../../helpers/average';
import { green } from '../../helpers/colors';

export default function chartCasts(seasons, holderID) {
  const tickValues = seasons.map(s => s.season);
  const yMax = roundUp(d3.max(seasons, s => s.total_cast), 5);

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
    .domain([0, yMax])
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
  addTitle(base.top, 'Cast Members Per Season');
  addLabel(base.bottom, 'Season', 'bottom');

  // CHART
  const bandWidth = seasonScale.rangeBand();
  base.main.element.selectAll('rect')
      .data(seasons)
    .enter().append('rect')
      .attr('width', bandWidth)
      .attr('x', d => seasonScale(d.season))
      .attr('y', d => yScale(d.total_cast))
      .attr('height', d => base.main.height - yScale(d.total_cast))
      .style('fill', green);

  const meanCount = meanProperty(seasons, 'total_cast');
  const meanLine = base.main.element.append('g')
    .attr('transform', `translate(0, ${yScale(meanCount)})`)
    .classed('mean', true);

  meanLine.append('line')
    .attr('x1', 0)
    .attr('x2', base.main.width)
    .attr('y1', 0)
    .attr('y2', 0);
  meanLine.append('text')
    .text(`Mean = ${roundFloat(meanCount, 1)}`)
    .attr('x', 3)
    .attr('y', -3);
}
