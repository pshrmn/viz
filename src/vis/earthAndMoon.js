/*
 * name: Earth and Moon
 * id: #earth-and-moon
 * use: display the planet Earth and the Moon
 *   alongside one another
 */
import { select } from 'd3-selection';
import { scalePoint } from 'd3-scale';
import { EarthFactory, MoonFactory } from 'shapes';

export default function() {
  const holder = select('#earth-and-moon');
  const svg = holder.append('svg')
    .attr('width', 200)
    .attr('height', 100);
  const defs = svg.append('defs');
  const radius = 50;
  const rocks = [EarthFactory(radius), MoonFactory(radius)];
  const scale = scalePoint()
    .domain(rocks.map(r => r.name))
    .range([0, 200])
    .padding(0.5);

  rocks.forEach(r => {
    r.radScale(rocks[0].radius);
    r.render(svg, defs);
    // place the "rock" using its
    r.center.attr('transform', `translate(${scale(r.name)},${radius})`)
    r.toggleRotate(true);
  })
}