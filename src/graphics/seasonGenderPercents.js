import { chartBase } from '../charts/base';
import { drawAxis } from '../charts/axis';
import { addTitle, verticalLegend } from '../charts/addons';

export default function chartGenderPercents(seasons, holderID) {
  // normalize the genders to cover the same time frame
  const tickValues = seasons.map(s => s.season);
  const colors = ['#459DBA', '#C2D400'];

  const base = chartBase({
    main: {width: 850, height: 300},
    left: {width: 50},
    bottom: {height: 50},
    top: {height: 30},
    right: { width: 100}
  }, holderID);

  const seasonScale = d3.scale.ordinal()
    .domain(tickValues)
    .rangeRoundBands([0, base.bottom.width], 0.1);

  const formatPercent = d3.format('.0%');
  const yScale = d3.scale.linear()
    .domain([0, 1])
    .range([base.main.height, 0]);

  const xAxis = d3.svg.axis()
    .scale(seasonScale)
    .orient('bottom')
    .tickValues(tickValues)
    .outerTickSize(0);

  const yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(10)
    .orient('left')
    .tickFormat(formatPercent);

  drawAxis(base.bottom, xAxis, 'top');
  drawAxis(base.left, yAxis, 'right');

  const bandWidth = seasonScale.rangeBand();

  // create a group for every age
  base.main.element.append('g')
    .classed('male-percent', true)
    .selectAll('rect')
      .data(seasons)
    .enter().append('rect')
      .attr('width', bandWidth)
      .attr('x', d => seasonScale(d.season))
      .attr('y', d => yScale(d.male / d.total_cast))
      .attr('height', d => base.main.height - yScale(d.male / d.total_cast))
      .style('fill', colors[0]);

  base.main.element.append('g')
    .classed('female-percent', true)
    .selectAll('rect')
      .data(seasons)
    .enter().append('rect')
      .attr('width', bandWidth)
      .attr('x', d => seasonScale(d.season))
      .attr('y', 0)
      .attr('height', d => yScale(d.male / d.total_cast))
      .style('fill', colors[1]);

  const halfWidth = seasonScale.rangeBand() / 2;
  base.main.element.selectAll('text.percent')
      .data(seasons)
    .enter().append('text')
      .classed('percent', true)
      .attr('transform', d => {
        const x = seasonScale(d.season) + halfWidth;
        const y = yScale(d.male / d.total_cast);
        return `translate(${x},${y})`;
      })
      .attr('dy', -3)
      .text(d => Math.floor((d.male / d.total_cast)*100))
      .style('text-anchor', 'middle');

  addTitle(base.top, 'Cast Member Genders');

  verticalLegend(base.right, [
    {
      color: colors[0],
      text: 'Male'
    },
    {
      color: colors[1],
      text: 'Female'
    }
  ], {
    offset: {
      left: 10,
      top: 50
    }
  });

  base.bottom.element.append('text')
    .text('Season')
    .classed('centered', true)
    .attr('transform', `translate(${base.bottom.width/2}, ${base.bottom.height-5})`)

  // draw a line representing what 50% gender ratio would be
  const halfGroup = base.main.element.append('g');
  halfGroup.append('line')
    .attr('x1', 0)
    .attr('y1', yScale(0.5))
    .attr('x2', base.main.width)
    .attr('y2', yScale(0.5))
    .style('stroke', '#000')
    .style('stroke-width', 1);
}
