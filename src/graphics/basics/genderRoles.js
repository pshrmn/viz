import d3 from 'd3';

import { chartBase } from '../../charts/base';
import { addTitle } from '../../charts/text';
import { lightBlue, brightPink, purple, brightBlue, yellowGreen } from '../../helpers/colors';

export default function roleChart(castMembers, holderID) {
  const formatPercent = d3.format('.0%');
  const roleKeys = [
    'Repertory',
    'Both',
    'Featured',
  ];
  const roleColors = [lightBlue, purple, brightPink];

  const genderCounts = castMembers.reduce((acc, cm) => {
    let offset = -1;
    if ( cm.featured.length && cm.repertory.length ) {
      offset = 1;
    } else if ( cm.repertory.length ) {
      offset = 0;
    } else {
      offset = 2;
    }
    acc[cm.gender][offset]++;
    return acc;
  }, {male: [0, 0, 0], female: [0, 0, 0]});

  const genderData = [
    {
      gender: 'male',
      data: genderCounts.male,
      fill: brightBlue
    },
    {
      gender: 'female',
      data: genderCounts.female,
      fill: yellowGreen
    },
  ];

  genderData.forEach((g, i) => {
    g.offsets = g.data.reduce((acc, curr) => {
      const last = acc[acc.length-1];
      return acc.concat([last+curr]);
    }, [0]);
    g.total = g.data.reduce((acc, d) => acc + d, 0);
    g.gOffset = i === 0 ? 0 : genderData[i-1].total;
    g.roleData = g.data.map((d, i) => {
      return {
        count: d,
        fill: roleColors[i],
        offset: g.offsets[i],
        percent: d / g.total
      };
    });
  });

  // BASE
  const base = chartBase({
    main: {width: 750, height: 30},
    top: {height: 25},
  }, holderID);

  // SCALES
  const roleScale = d3.scale.linear()
    .domain([0, castMembers.length])
    .range([0, base.main.width])

  addTitle(base.top, 'By Role & Gender', 'left');

  // CHART
  const genderGs = base.main.element.selectAll('g.gender')
      .data(genderData)
    .enter().append('g')
      .classed('gender', true)
      .attr('transform', d=> `translate(${roleScale(d.gOffset)},0)`)

  const roleGs = genderGs.selectAll('g.role')
      .data(d => d.roleData)
    .enter().append('g')
      .classed('role', true)
      .attr('transform', d => `translate(${roleScale(d.offset)},5)`)

  roleGs.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', d => roleScale(d.count))
    .attr('height', 25)
    .style('fill', (d, i) => roleColors[i]);

  roleGs.append('text')
    .text(d => {
      return `${d.count} (${formatPercent(d.percent)})`;
    })
    .style('text-anchor', 'middle')
    .attr('dx', 0)
    .attr('dy', '0.3em')
    .attr('transform', (d,i) => {
      return `translate(${roleScale(d.count) / 2},${25 / 2})`;
    });

  genderGs.append('rect')
    .classed('gender-bar', true)
    .attr('x', 0)
    .attr('y', 0)
    .attr('height', 3)
    .attr('width', d => roleScale(d.total))
    .style('fill', d => d.fill);
}