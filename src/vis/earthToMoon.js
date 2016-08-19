/*
 * name: Earth to Moon
 * id: #earth-to-moon
 * use: display the distance between Earth and the Moon
 */
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { EarthFactory, MoonFactory } from 'shapes';
import mainWidth from 'helpers/width';

export default function() {
  const holder = select('#earth-to-moon');
  const fullWidth = mainWidth();
  const margin = 50;
  const width = fullWidth - margin*2;
  const distance = 384;
  const kmsPerPixel = width / (distance*1000);
  const radius = 25;
  const svg = holder.append('svg')
    .attr('width', fullWidth)
    .attr('height', radius*2);
  const defs = svg.append('defs');
  const workarea = svg.append('g')
    .attr('transform', `translate(${margin},0)`)
  const rocks = [EarthFactory(radius), MoonFactory(radius)];
  const distances = [0, distance];
  const scale = scaleLinear()
    .domain([0, distance])
    .range([0, width]);

  rocks.forEach((r,i) => {
    r.kmScale(kmsPerPixel, radius);
    r.render(workarea, defs);
    // place the "rock" using its
    r.center.attr('transform', `translate(${scale(distances[i])},${radius})`)
    r.toggleRotate(true);
  })
}