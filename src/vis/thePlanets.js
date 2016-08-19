/*
 * name: The Planets
 * id: #the-planets
 * use: display all of the planets
 */
import { select } from 'd3-selection';
import { scalePoint } from 'd3-scale';
import planetFactories from 'shapes';
import mainWidth from 'helpers/width';

export default function() {
  const holder = select('#the-planets');
  const fullWidth = mainWidth();
  const svg = holder.append('svg')
    .attr('width', fullWidth)
    .attr('height', 50);
  const defs = svg.append('defs');
  const radius = 25;
  const planets = planetFactories.map(pf => pf(radius));
  const scale = scalePoint()
    .domain(planets.map(p => p.name))
    .range([0, fullWidth])
    .padding(0.25);

  planets.forEach(p => {
    p.render(svg, defs);
    // place the "rock" using its
    p.center.attr('transform', `translate(${scale(p.name)},${radius})`)
    p.toggleRotate(true);
  });
  
}