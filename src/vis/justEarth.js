/*
 * name: Just Earth
 * id: #just-earth
 * use: display the planet Earth
 */
import { select } from 'd3-selection';
import { EarthFactory } from 'shapes';

export default function() {
  const holder = select('#just-earth');
  const svg = holder.append('svg')
    .attr('width', 100)
    .attr('height', 100);
  const defs = svg.append('defs');
  const earth = EarthFactory(50);
  const g = svg.append('g')
    .attr('transform', 'translate(50,50)');
  earth.render(g, defs);

  earth.toggleRotate(true);
}