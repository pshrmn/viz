import SpaceObject from 'shapes/spaceobject';

export default function UranusFactory(radius=100) {
  return new SpaceObject(
    'uranus',
    25559,
    2880,
    'planet',
    renderUranus.bind(null, radius),
    'img/textures/uranus.png',
    -97.77
  );
}

function renderUranus(radius, planetHolder) {
  const fullRadius = 100;
  const planetRadius = radius/fullRadius;
  const g = planetHolder.append('g')
  g.append('circle')
    .classed('planet uranus', true)
    .attr('r', fullRadius)
    .style('fill', 'url(#uranus)')
    .attr('transform', `scale(${planetScale})`);
  return g;
}