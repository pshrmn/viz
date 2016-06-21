import d3 from 'd3';

import { chartBase } from '../../charts/base';
import { genderColors } from '../../helpers/colors';
import { addTitle } from '../../charts/text';

export default function genderChart(castMembers, holderID) {
  const formatPercent = d3.format('.0%');
  const genders = castMembers.reduce((acc, cm) => {
    if ( cm.gender === 'male' ) {
      acc[0]++;
    } else {
      acc[1]++;
    }
    return acc;
  }, [0,0]);
  const data = [
    {
      gender: 'Male',
      count: genders[0],
      offset: 0,
      fill: genderColors[0],
      align: 'start'
    },
    {
      gender: 'Female',
      count: genders[1],
      offset: genders[0],
      fill: genderColors[1],
      align: 'end'
    }
  ]
  // BASE
  const base = chartBase({
    main: {width: 650, height: 25},
    top: {height: 30},
  }, holderID);

  // SCALES
  const genderScale = d3.scale.linear()
    .domain([0, castMembers.length])
    .range([0, base.main.width])


  addTitle(base.top, 'Genders');

  // CHART
  const genderGs = base.main.element.selectAll('g')
      .data(data)
    .enter().append('g')
      .attr('transform', d => `translate(${genderScale(d.offset)},0)`)

  genderGs.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', d => genderScale(d.count))
    .attr('height', base.main.height)
    .style('fill', d => d.fill);

  genderGs.append('text')
    .text(d => {
      return `${d.gender} - ${d.count} (${formatPercent(d.count/castMembers.length)})`
    })
    .style('text-anchor', d => d.align)
    .attr('dx', (d,i) => i === 0 ? 5 : -5)
    .attr('dy', '0.3em')
    .attr('transform', (d,i) => {
      const x = i === 0 ? 0 : genderScale(d.count);
      const y = base.main.height / 2;
      return `translate(${x},${y})`;
    })
}