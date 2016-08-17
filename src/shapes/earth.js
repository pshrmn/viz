import SpaceObject from 'shapes/spaceobject';

export default function EarthFactory(radius=100) {
  return new SpaceObject(
    'earth',
    6371,
    150,
    'planet',
    renderEarth.bind(null, radius),
    'img/textures/earth.png',
    -23.45
  );
}

function renderEarth(radius, planetHolder) {
  const fullRadius = 100;
  const planetScale = radius / fullRadius;
  const g = planetHolder.append('g')
  g.append('circle')
    .classed('planet earth', true)
    .attr('r', fullRadius)
    .style('fill', 'url(#earth)')
    .attr('transform', `scale(${planetScale})`);
  return g;
}