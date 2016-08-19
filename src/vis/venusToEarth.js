/*
 * name: Venus to Earth
 * id: #venus-to-earth
 * use: display the distance between Earth and the Moon
 */
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { VenusFactory, EarthFactory } from 'shapes';

export default function() {
  const holder = select('#venus-to-earth');
  const kmsPerPixel = 0.0018229166666666667
  const difference = 38000000;
  const width = kmsPerPixel * difference;
  const margin = 50;
  const fullWidth = width + margin*2;
  
  const radius = 25;
  // hard code this value from the earthToMoon;
  const svg = holder.append('svg')
    .attr('width', fullWidth)
    .attr('height', radius*2);
  const defs = svg.append('defs');
  const workarea = svg.append('g')
    .attr('transform', `translate(${margin},0)`)
  const rocks = [EarthFactory(radius), VenusFactory(radius)];
  const distances = [0, difference];
  const scale = scaleLinear()
    .domain([0, difference])
    .range([0, width]);

  rocks.forEach((r,i) => {
    r.kmScale(kmsPerPixel, radius);
    r.render(workarea, defs);
    // place the "rock" using its
    r.center.attr('transform', `translate(${scale(distances[i])},${radius})`)
    r.toggleRotate(true);
  })
}