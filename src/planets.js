import { select } from 'd3-selection'
import planetFactories from 'shapes';

const planets = planetFactories.map(pf => pf())
  .sort((a,b) => b.radius - a.radius);

const svg = select('body').append('svg')
  .attr('width', 400)
  .attr('height', 200);
const defs = svg.append('defs');
const maxRadius = planets.reduce((acc, curr) => curr.radius > acc ? curr.radius : acc, -Infinity);
planets.forEach(p => {
  p.radScale(maxRadius);
  p.render(svg, defs);
  p.toggleRotate(true);
})
