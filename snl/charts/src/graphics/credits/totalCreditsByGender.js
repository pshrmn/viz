import d3 from 'd3';

import { chartBase } from '../../charts/base';
import { drawAxis } from '../../charts/axis';
import { addTitle, addLabel } from '../../charts/text';
import { verticalLegend } from '../../charts/legend';
import { roundUp } from '../../helpers/round';
import { genderColors } from '../../helpers/colors';
import groupBy from '../../helpers/groupBy'

export default function chartTotalCredits(castMembers, holderID) {
  let maleTotal = 0;
  let femaleTotal = 0;
  castMembers.forEach(cm => {
    if ( cm.gender === 'male' ) {
      maleTotal++;
    } else {
      femaleTotal++;
    }
  });
  const counts = groupBy(castMembers, 'credits', n => Math.floor(n/5));
  const highCount = d3.max(Object.keys(counts), d => parseInt(d, 10));
  // don't just convert to an array because we want to fill in missing 10s
  const creditGroups = Array.from(new Array(highCount+1)).map((u,i) => {
    let males = 0;
    let females = 0;
    const group = counts[i];
    if ( group !== undefined ) {
      group.forEach(cm => {
        if ( cm.gender === 'male' ) {
          males++;
        } else {
          females++;
        }
      });
    }
    return {
      key: i*5,
      male: males / maleTotal,
      female: females / femaleTotal
    }
  });
  const xKeys = creditGroups.map(cg => cg.key);
  const yMax = roundUp(d3.max(creditGroups, cg => Math.max(cg.male, cg.female))*100, 5) / 100;

  // BASE
  const base = chartBase({
    main: {width: 850, height: 300},
    left: {width: 65},
    bottom: {height: 50},
    top: {height: 30},
    right: { width: 110}
  }, holderID);

  // SCALES
  // x
  const creditScale = d3.scale.ordinal()
    .domain(xKeys)
    .rangeRoundBands([0, base.bottom.width], 0.1, 0);

  const genderScale = d3.scale.ordinal()
    .domain([0, 1])
    .rangeRoundBands([0, creditScale.rangeBand()]);

  // y
  const percScale = d3.scale.linear()
    .domain([0, yMax])
    .range([base.main.height, 0]);

  // AXES
  const xAxis = d3.svg.axis()
    .scale(creditScale)
    .orient('bottom')
    .tickValues(xKeys.filter(n => n % 10 === 0))
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
  addTitle(base.top, 'Total SNL Episode Credits (by Gender)');
  addLabel(base.bottom, 'Episode Credits (Rounded Down to Nearest 5)', 'bottom');
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
    .selectAll('g')
      .data(creditGroups)
    .enter().append('g')
      .attr('transform', d => `translate(${creditScale(d.key)},0)`)

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
