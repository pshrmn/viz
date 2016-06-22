import d3 from 'd3';

import { chartBase } from '../../charts/base';
import { addTitle } from '../../charts/text';
import { green } from '../../helpers/colors';

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
      count: castMembers.length,
      fill: green,
      align: 'start'
    }
  ]
  // BASE
  const base = chartBase({
    main: {width: 750, height: 25},
    top: {height: 25},
  }, holderID);

  // SCALES
  const genderScale = d3.scale.linear()
    .domain([0, castMembers.length])
    .range([0, base.main.width])

  addTitle(base.top, 'Cast Members', 'left');

  // CHART
  const allGs = base.main.element.selectAll('g')
      .data(data)
    .enter().append('g');

  allGs.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', d => genderScale(d.count))
    .attr('height', base.main.height)
    .style('fill', d => d.fill);

  allGs.append('text')
    .text(d => {
      return `Total Cast Members - ${d.count}`
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