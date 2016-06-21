import { chartBase } from '../../charts/base';
import { drawAxis } from '../../charts/axis';
import { addTitle, addLabel } from '../../charts/text';
import { verticalLegend } from '../../charts/legend';
import { genderColors } from '../../helpers/colors';
import { meanProperty, standardDeviation } from '../../helpers/average';
import { roundFloat } from '../../helpers/round';

export default function chartGenderPercents(seasons, holderID) {
  const tickValues = seasons.map(s => s.season);
  const formatPercent = d3.format('.0%');

  // save here instead of calculating this multiple times
  seasons.forEach(s => {
    s.male_percent = s.male / s.total_cast;
  });

  // BASE
  const base = chartBase({
    main: {width: 850, height: 300},
    left: {width: 50},
    bottom: {height: 50},
    top: {height: 30},
    right: { width: 100}
  }, holderID);

  // SCALES
  const seasonScale = d3.scale.ordinal()
    .domain(tickValues)
    .rangeRoundBands([0, base.bottom.width], 0.1);

  const yScale = d3.scale.linear()
    .domain([0, 1])
    .range([base.main.height, 0]);

  // AXES
  const xAxis = d3.svg.axis()
    .scale(seasonScale)
    .orient('bottom')
    .tickValues(tickValues)
    .outerTickSize(0);

  const yAxis = d3.svg.axis()
    .scale(yScale)
    .tickValues([0, 0.25, 0.5, 0.75, 1.0])
    .orient('left')
    .tickFormat(formatPercent);

  drawAxis(base.bottom, xAxis, 'top');
  drawAxis(base.left, yAxis, 'right');

  addTitle(base.top, 'Cast Member Genders');
  addLabel(base.bottom, 'Season', 'bottom');
  verticalLegend(base.right, [
    {color: genderColors[1], text: 'Female'},
    {color: genderColors[0], text: 'Male'}
  ], {
    offset: {
      left: 10,
      top: 50
    }
  });

  // CHART
  const bandWidth = seasonScale.rangeBand();
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

}
