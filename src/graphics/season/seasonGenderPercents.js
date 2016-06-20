import { chartBase } from '../../charts/base';
import { drawAxis } from '../../charts/axis';
import { addTitle, verticalLegend } from '../../charts/addons';
import { genderColors } from '../../colors';
import { meanProperty, standardDeviation } from '../../average';
import { roundFloat } from '../../round';

export default function chartGenderPercents(seasons, holderID) {
  // normalize the genders to cover the same time frame
  const tickValues = seasons.map(s => s.season);

  seasons.forEach(s => {
    s.male_percent = s.male / s.total_cast;
  });

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
      .attr('y', d => yScale(d.male_percent))
      .attr('height', d => base.main.height - yScale(d.male_percent))
      .style('fill', genderColors[0]);

  base.main.element.append('g')
    .classed('female-percent', true)
    .selectAll('rect')
      .data(seasons)
    .enter().append('rect')
      .attr('width', bandWidth)
      .attr('x', d => seasonScale(d.season))
      .attr('y', 0)
      .attr('height', d => yScale(d.male_percent))
      .style('fill', genderColors[1]);

  const halfWidth = seasonScale.rangeBand() / 2;
  base.main.element.selectAll('text.percent')
      .data(seasons)
    .enter().append('text')
      .classed('percent', true)
      .attr('transform', d => {
        const x = seasonScale(d.season) + halfWidth;
        const y = yScale(d.male_percent) + 15;
        return `translate(${x},${y})`;
      })
      .text(d => Math.floor((d.male / d.total_cast)*100))
      .style('text-anchor', 'middle')
      .style('font-size', '14px');

  addTitle(base.top, 'Cast Member Genders');

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
    .text('Season')
    .classed('centered', true)
    .attr('transform', `translate(${base.bottom.width/2}, ${base.bottom.height-5})`)

  /*
  // draw a line representing what 50% gender ratio would be
  const halfGroup = base.main.element.append('g');
  halfGroup.append('line')
    .attr('x1', 0)
    .attr('y1', yScale(0.5))
    .attr('x2', base.main.width)
    .attr('y2', yScale(0.5))
    .style('stroke', '#000')
    .style('stroke-width', 1);

  const meanCount = meanProperty(seasons, 'male_percent');
  const standardDev = standardDeviation(seasons, 'male_percent', meanCount);
  */
}
