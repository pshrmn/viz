import d3 from 'd3';

import { chartBase } from '../../charts/base';
import { drawAxis } from '../../charts/axis';
import { addTitle, addLabel } from '../../charts/text';
import { verticalLegend } from '../../charts/legend';
import { roundUp } from '../../helpers/round';
import { genderColors } from '../../helpers/colors';
import { daysToYears } from '../../helpers/date';

export default function chartTotalCredits(castMembers, holderID) {
  // figure out male and female totals so we can calculate %
  let maleTotal = 0;
  let femaleTotal = 0;
  castMembers.forEach(cm => {
    if ( cm.gender === 'male' ) {
      maleTotal++;
    } else {
      femaleTotal++;
    }
  });

  const maxSeasons = d3.max(castMembers, cm => cm.total_seasons);

  const seasonCounts = Array.from(new Array(maxSeasons)).map((u,i) => ({
    key: i+1,
    male: 0,
    female: 0
  }));

  castMembers.forEach(cm => {
    seasonCounts[cm.total_seasons-1][cm.gender]++;
  });

  seasonCounts.forEach(s => {
    s.male = s.male / maleTotal;
    s.female = s.female / femaleTotal;
  });

  const maxPerc = roundUp(d3.max(seasonCounts, s => Math.max(s.male, s.female))*100, 5) / 100;
  const seasonTicks = seasonCounts.map(s => s.key);

  // BASE
  const base = chartBase({
    main: {width: 500, height: 300},
    left: {width: 65},
    bottom: {height: 50},
    top: {height: 30},
    right: { width: 110}
  }, holderID);

  // SCALES
  //x
  // x
  const seasonScale = d3.scale.ordinal()
    .domain(seasonTicks)
    .rangeRoundBands([0, base.bottom.width], 0.1, 0);

  const genderScale = d3.scale.ordinal()
    .domain([0, 1])
    .rangeRoundBands([0, seasonScale.rangeBand()]);

  // y
  const percScale = d3.scale.linear()
    .domain([0, maxPerc])
    .range([base.main.height, 0]);

  // AXES
  const xAxis = d3.svg.axis()
    .scale(seasonScale)
    .orient('bottom')
    .outerTickSize(0);

  const percFormat = d3.format('.0%');
  const yAxis = d3.svg.axis()
    .scale(percScale)
    .orient('left')
    .ticks(10)
    .tickFormat(percFormat);

  const yGrid = d3.svg.axis()
    .scale(percScale)
    .orient('right')
    .tickSize(base.main.width)
    .ticks(10)
    .tickFormat('')
    .outerTickSize(0);

  drawAxis(base.bottom, xAxis, 'top');
  drawAxis(base.left, yAxis, 'right');
  drawAxis(base.main, yGrid, 'left');
  addTitle(base.top, 'Total Seasons (by Gender)');
  addLabel(base.bottom, 'Seasons', 'bottom');
  addLabel(base.left, '% of Cast Members', 'left', 40);
  verticalLegend(base.right, [
    {color: genderColors[0], text: 'Male'},
    {color: genderColors[1], text: 'Female'}
  ], {
    offset: {
      left: 10,
      top: 50
    }
  });
  // CHART
  const genderGroups = base.main.element.append('g')
    .classed('bars', true)
    .selectAll('g')
        .data(seasonCounts)
      .enter().append('g')
        .attr('transform', d => `translate(${seasonScale(d.key)},0)`)

  const genderWidth = genderScale.rangeBand();
  genderGroups.selectAll('rect')
      .data(d => [d.male, d.female])
    .enter().append('rect')
      .attr('width', genderWidth)
      .attr('x', (d, i) => genderScale(i))
      .attr('y', d => percScale(d))
      .attr('height', d => base.main.height - percScale(d))
      .style('fill', (d,i) => genderColors[i]);
}
