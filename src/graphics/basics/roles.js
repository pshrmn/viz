import d3 from 'd3';

import { chartBase } from '../../charts/base';
import { addTitle } from '../../charts/text';
import { lightBlue, brightPink, purple } from '../../helpers/colors';

export default function roleChart(castMembers, holderID) {
  const formatPercent = d3.format('.0%');
  const roles = castMembers.reduce((acc, cm) => {
    if ( cm.featured.length && cm.repertory.length ) {
      acc[1]++;
    } else if ( cm.repertory.length ) {
      acc[0]++;
    } else {
      acc[2]++;
    }
    return acc;
  }, [0,0,0]);
  const data = [
    {
      role: 'Repertory',
      align: 'start',
      count: roles[0],
      offset: 0,
      fill: lightBlue,
      dx: 5
    },
    {
      role: 'Both',
      align: 'middle',
      count: roles[1],
      offset: roles[0],
      fill: purple,
      dx: 0
    },
    {
      role: 'Featured',
      align: 'end',
      count: roles[2],
      offset: roles[0] + roles[1],
      fill: brightPink,
      dx: -5
    }
  ];

  // BASE
  const base = chartBase({
    main: {width: 650, height: 25},
    top: {height: 30},
  }, holderID);

  // SCALES
  const roleScale = d3.scale.linear()
    .domain([0, castMembers.length])
    .range([0, base.main.width])


  addTitle(base.top, 'Roles');

  // CHART
  const roleGs = base.main.element.selectAll('g')
      .data(data)
    .enter().append('g')
      .attr('transform', d => `translate(${roleScale(d.offset)},0)`)

  roleGs.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', d => roleScale(d.count))
    .attr('height', base.main.height)
    .style('fill', d => d.fill);

  roleGs.append('text')
    .text(d => {
      return `${d.role} - ${d.count} (${formatPercent(d.count/castMembers.length)})`
    })
    .style('text-anchor', d => d.align)
    .attr('dx', d => d.dx)
    .attr('dy', '0.3em')
    .attr('transform', (d,i) => {
      let x = 0;
      if ( i === 1 ) {
        x = roleScale(d.count) / 2;
      } else if ( i === 2 ) {
        x = roleScale(d.count);
      }
      const y = base.main.height / 2;
      return `translate(${x},${y})`;
    })
}