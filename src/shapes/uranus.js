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

function renderUranus(radius, planetHolder, patternID) {
  const fullRadius = 100;
  const planetScale = radius/fullRadius;
  const g = planetHolder.append('g')
  g.append('circle')
    .classed('planet uranus', true)
    .attr('r', fullRadius)
    .style('fill', `url(#${patternID})`)
    .attr('transform', `scale(${planetScale})`);
  return g;
}