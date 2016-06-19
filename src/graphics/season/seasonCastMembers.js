import { chartBase } from '../../charts/base';
import { drawAxis } from '../../charts/axis';
import { addTitle } from '../../charts/addons';
import { roundUp, roundFloat } from '../../round';
import { meanProperty } from '../../average';
import { green } from '../../colors';

export default function chartCasts(seasons, holderID) {
  // normalize the genders to cover the same time frame
  const tickValues = seasons.map(s => s.season);

  const base = chartBase({
    main: {width: 750, height: 300},
    left: {width: 50},
    bottom: {height: 50},
    top: {height: 30},
    right: { width: 100}
  }, holderID);

  const seasonScale = d3.scale.ordinal()
    .domain(tickValues)
    .rangeRoundBands([0, base.bottom.width], 0.1);

  const yMax = roundUp(d3.max(seasons, s => s.total_cast), 5);
  const yScale = d3.scale.linear()
    .domain([0, yMax])
    .range([base.main.height, 0]);

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

  const bandWidth = seasonScale.rangeBand();

  // create a group for every age
  base.main.element.selectAll('rect')
      .data(seasons)
    .enter().append('rect')
      .attr('width', bandWidth)
      .attr('x', d => seasonScale(d.season))
      .attr('y', d => yScale(d.total_cast))
      .attr('height', d => base.main.height - yScale(d.total_cast))
      .style('fill', green);

  addTitle(base.top, 'Cast Members Per Season');

  base.bottom.element.append('text')
    .text('Season')
    .classed('centered', true)
    .attr('transform', `translate(${base.bottom.width/2}, ${base.bottom.height-5})`);

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
