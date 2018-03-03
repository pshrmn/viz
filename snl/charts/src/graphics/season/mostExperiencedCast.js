import d3 from 'd3';

import { seasonsExperience } from '../../stats/experience';
import { chartBase } from '../../charts/base';
import { drawAxis } from '../../charts/axis';
import { addTitle, addLabel } from '../../charts/text';
import { green } from '../../helpers/colors';

export default function chartMostExperiencedCast(castMembers, holderID) {
  const mostExperience = seasonsExperience(castMembers).reduce((acc, curr) => {
    if ( acc === null ) {
      return curr;
    } else {
      return curr.mean > acc.mean ? curr : acc;
    }
  }, null);

  const { mean, cast, season } = mostExperience;
  // sort by experience most to least
  const sortedCast = cast.sort((a,b) => b.experience - a.experience);
  const tickValues = sortedCast.map(cm => cm.name);
  const maxExperience = d3.max(sortedCast, d => d.experience);

  // BASE
    const base = chartBase({
    main: {width: 300, height: 300},
    left: {width: 150},
    bottom: {height: 50},
    top: {height: 50},
    right: {width: 20}
  }, holderID);

  // SCALES
  const castMemberScale = d3.scale.ordinal()
    .domain(tickValues)
    .rangeRoundBands([0, base.main.height], 0.1, 0);

  const experienceScale = d3.scale.linear()
    .domain([0, maxExperience])
    .range([0, base.main.width]);

  // AXES
  const castAxis = d3.svg.axis()
    .scale(castMemberScale)
    .orient('left')
    .tickValues(tickValues);

  const expAxis = d3.svg.axis()
    .scale(experienceScale)
    .orient('bottom');

  drawAxis(base.left, castAxis, 'right');
  drawAxis(base.bottom, expAxis, 'bottom');
  addTitle(base.top, `Most Experienced Cast - Season ${season}`);

  // CHART
  const bandHeight = castMemberScale.rangeBand();
  base.main.element.append('g')
    .classed('bars', true)
    .selectAll('rect')
        .data(sortedCast)
      .enter().append('rect')
        .attr('x', 0)
        .attr('y', d => castMemberScale(d.name))
        .attr('width', d => experienceScale(d.experience))
        .attr('height', bandHeight)
        .style('fill', green);

  base.main.element.append('g')
    .classed('years', true)
    .selectAll('text')
        .data(sortedCast)
      .enter().append('text')
        .attr('transform', d => `translate(${experienceScale(d.experience)},${castMemberScale(d.name)})`)
        .text(d => d.experience)
        .attr('dy', '1em')
        .attr('dx', 5)
}