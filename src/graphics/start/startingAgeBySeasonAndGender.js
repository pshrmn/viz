import { chartBase } from '../../charts/base';
import { drawAxis } from '../../charts/axis';
import { addTitle, verticalLegend } from '../../charts/addons';
import { roundUp } from '../../round';
import { daysToYears } from '../../date';
import { genderColors } from '../../colors';

const [maleColor, femaleColor] = genderColors;

export default function chartStartingAges(castMembers, holderID) {
  // normalize the genders to cover the same time frame
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

  // find out the oldest starting age, convert to years
  const maxYears = roundUp(daysToYears(d3.max(filteredCastMembers, cm => cm.start_age)), 5);
  const yScale = d3.scale.linear()
    .domain([0, 50])
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

  // create a group for every age
  base.main.element.selectAll('circle')
      .data(filteredCastMembers)
    .enter().append('circle')
      .attr('r', 4)
      .attr('cx', d => seasonScale(d.firstSeason))
      .attr('cy', d => yScale(daysToYears(d.start_age)))
      .style('opacity', 0.75)
      .style('fill', d => d.gender === 'male' ? maleColor : femaleColor);

  addTitle(base.top, 'Starting Age of SNL Cast Members');

  verticalLegend(base.right, [
    {
      color: maleColor,
      text: 'Male'
    },
    {
      color: femaleColor,
      text: 'Female'
    }
  ], {
    offset: {
      left: 10,
      top: 100
    }
  });

  base.bottom.element.append('text')
    .text('Season')
    .classed('centered', true)
    .attr('transform', `translate(${base.bottom.width/2}, ${base.bottom.height-5})`)

  base.left.element.append('text')
    .text('Starting Age')
    .classed('centered', true)
    .attr('transform', `translate(15,${base.left.height/2})rotate(-90)`);
}
