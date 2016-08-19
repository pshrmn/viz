/*
 * name: Scale Planets
 * id: #distance-planets
 * use: display all of the planets with the correct scale and distance
 */
import { select } from 'd3-selection';
import { extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import planetFactories from 'shapes';
import mainWidth from 'helpers/width';

export default function() {
  const holder = select('#distance-planets');
  const fullWidth = mainWidth();
  const margin = 25;
  const width = fullWidth - margin*2;

  const svg = holder.append('svg')
    .attr('width', fullWidth)
    .attr('height', 50);
  const defs = svg.append('defs');

  const radius = 25;
  const planets = planetFactories.map(pf => pf(radius));
  const scale = scaleLinear()
    .domain(extent(planets, p => p.distanceFromSun))
    .range([0, width]);

  const largest = planets.reduce((acc,curr) => curr.radius > acc ? curr.radius : acc, -Infinity);
  const workarea = svg.append('g')
    .attr('transform', `translate(${margin},0)`)
  planets.forEach(p => {
    p.radScale(largest);
    p.render(workarea, defs);
    p.center.attr('transform', `translate(${scale(p.distanceFromSun)},${radius})`)
    p.toggleRotate(true);
  })
}