/*
 * name: The Sun
 * id: #the-sun
 * use: display all of the planets scaled against the sun
 */
import { select } from 'd3-selection';
import { scaleBand } from 'd3-scale';
import planetFactories, { SunFactory } from 'shapes';
import mainWidth from 'helpers/width';

export default function() {
  const holder = select('#the-sun');

  const fullWidth = 600;
  const mid = fullWidth/2;
  const svg = holder.append('svg')
    .attr('width', fullWidth)
    .attr('height', fullWidth);
  const defs = svg.append('defs');
  const radius = 5;
  const sun = SunFactory(radius);
  const planets = planetFactories.map(pf => pf(radius))
    .sort((a,b) => b.radius - a.radius);

  // scale everything using the radius of the smallest planet (mercury)
  const smallest = planets.reduce((acc,curr) => Math.min(acc, curr.radius), Infinity);
  const scale = 1/smallest;
  
  sun.kmScale(scale, radius);
  planets.forEach(p => { p.kmScale(scale, radius); });
  
  sun.render(svg, defs);
  sun.center.attr('transform', `translate(${mid},${mid})`);

  const sunWidth = sun.center.node().getBoundingClientRect().width;
  const planetScale = scaleBand()
    .domain(planets.map(p => p.name))
    .range([0, sunWidth]);
  const halfBand = planetScale.bandwidth()/2;
  
  // determine the size of the sun
  const planetHolder = svg.append('g')
    .attr('transform', `translate(${mid-sunWidth/2},${mid})`)
  planets.forEach(p => {
    p.render(planetHolder, defs);
    p.center.attr('transform', `translate(${planetScale(p.name)+halfBand},0)`)
    p.toggleRotate(true);
  });
  
}