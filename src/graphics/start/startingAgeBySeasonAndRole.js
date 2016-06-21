import d3 from 'd3';

import { chartBase } from '../../charts/base';
import { drawAxis } from '../../charts/axis';
import { addTitle, addLabel } from '../../charts/text';
import { verticalLegend } from '../../charts/legend';
import { roundUp } from '../../helpers/round';
import { daysToYears } from '../../helpers/date';
import { lightBlue as repertoryColor, brightPink as featuredColor } from '../../helpers/colors';

export default function chartStartingAges(castMembers, holderID) {
  const filteredCastMembers = castMembers.filter(cm => cm.start_age !== undefined );
  let minSeason = Infinity;
  let maxSeason = -Infinity;
  const startSeasons = filteredCastMembers.forEach(cm => {
    const fs = cm.firstSeason;
    if ( fs < minSeason ) {
      minSeason = fs;
    } 
    if ( fs > maxSeason ) {
      maxSeason = fs;
    }
  });
  const tickValues = Array.from(new Array(maxSeason-minSeason+1)).map((u,i) => i+minSeason);
  // find out the oldest starting age, convert to years
  const maxYears = roundUp(daysToYears(d3.max(filteredCastMembers, cm => cm.start_age)), 5);

  // BASE
  const base = chartBase({
    main: {width: 750, height: 300},
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
    .domain([0, 50])
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
  addTitle(base.top, 'Starting Age of SNL Cast Members');
  addLabel(base.bottom, 'Season', 'bottom');
  addLabel(base.left, 'Starting Age', 'left');
  verticalLegend(base.right, [
    {color: repertoryColor, text: 'Repertory'},
    {color: featuredColor, text: 'Featured'}
  ], {
    offset: {
      left: 10,
      top: 100
    }
  });

  base.main.element.append('g')
    .classed('scale-bars', true)
      .selectAll('rect')
          .data(tickValues)
        .enter().append('rect')
          .attr('x', d => seasonScale(d))
          .attr('y', 0)
          .attr('width', seasonScale.rangeBand())
          .attr('height', base.main.height);

  // CHART
  const halfWidth = seasonScale.rangeBand() / 2;
  // create a group for every age
  base.main.element.selectAll('circle')
      .data(filteredCastMembers)
    .enter().append('circle')
      .attr('r', 2)
      .attr('cx', d => seasonScale(d.firstSeason) + halfWidth)
      .attr('cy', d => yScale(daysToYears(d.start_age)))
      .style('fill', d => d.featured.length === 0 ? repertoryColor : featuredColor);

}
