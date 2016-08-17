import SpaceObject from 'shapes/spaceobject';

export default function MarsFactory(radius=100) {
  return new SpaceObject(
    'mars',
    3397,
    228,
    'planet',
    renderMars.bind(null, radius),
    'img/textures/mars.png',
    -25.19
  );
}

function renderMars(radius, planetHolder) {
  const fullRadius = 100;
  const planetScale = radius / fullRadius;
  const g = planetHolder.append('g')
  g.append('circle')
    .classed('planet mars', true)
    .attr('r', fullRadius)
    .style('fill', 'url(#mars)')
    .attr('transform', `scale(${planetScale})`);
  return g;
}