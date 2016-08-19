/*
 * name: Radius Graph
 * id: #radius-graph
 * use: display the planets in a graph with information about their radii
 */
import { select } from 'd3-selection';
import { scaleBand, scaleLinear } from 'd3-scale';
import { format } from 'd3-format';
import planetFactories from 'shapes';
import mainWidth from 'helpers/width';
import simpleRange from 'helpers/range';

export default function() {
  const holder = select('#radius-graph');
  const radius = 15;
  const margin = {
    top: 15,
    bottom: 0,
    left: 75,
    right: 25
  };
  const fullWidth = mainWidth();
  const width = fullWidth - margin.left - margin.right;
  const height = planetFactories.length * 50;
  const fullHeight = height + margin.top + margin.bottom;

  const buttonHolder = holder.append('div')
    .style('margin', '5px 0');
  const svg = holder.append('svg')
    .attr('width', fullWidth)
    .attr('height', fullHeight);

  const defs = svg.append('defs');
  const workarea = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const withComma = format(',');


  const planets = planetFactories.map(pf => pf(radius));  
  const scale = scaleBand()
    .domain(planets.map(p => p.name))
    .range([0, height]);
  
  const largest = planets.reduce((acc,curr) => Math.max(curr.radius, acc), -Infinity);
  const radScale = scaleLinear()
    .domain([0, largest])
    .range([0, width])
    .nice();

  planets.forEach((p,i) => {
    const planetGroup = workarea.append('g')
      .attr('transform', `translate(0,${scale(p.name)})`)

    p.render(planetGroup, defs);
    p.center.attr('transform', `translate(${radScale(p.radius)+radius},0)`)
    p.toggleRotate(true);
    planetGroup.insert('line', ':first-child')
      .attr('x1', 0)
      .attr('x2', radScale(p.radius))
      .attr('y1', -2)
      .attr('y2', -2)
      .style('stroke', '#fff176')
      .style('shape-rendering', 'crispEdges')
      .style('stroke-dasharray', '1,1')
    planetGroup.append('text')
      .text(`${withComma(p.radius)} km`)
      .style('text-anchor', 'end')
      .attr('dy', 5)
      .attr('dx', -2)
      .style('fill', '#fff176');
  });

  let scaled = false;
  buttonHolder.append('button')
    .text('Scale Planets by Radius')
    .on('click', function() {
      scaled = !scaled;
      this.textContent = scaled ? 'Draw Planets the Same Size' : 'Scale Planets by Radius'
      if ( scaled ) {
        planets.forEach(p => { p.radScale(largest, 1000); });
      } else {
        planets.forEach(p => { p.rescale(1, 1000); });
      }
    })
}
