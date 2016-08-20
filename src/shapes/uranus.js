import SpaceObject from 'shapes/spaceobject';

export default function UranusFactory(radius=100) {
  return new SpaceObject(
    'uranus',
    25362,
    2880,
    'planet',
    renderUranus.bind(null, radius),
    '/static/img/textures/uranus.png',
    -97.77
  );
}

function renderUranus(radius, planetHolder, patternID) {
  const fullRadius = 100;
  const planetScale = radius/fullRadius;
  planetHolder.append('circle')
    .classed('planet uranus', true)
    .attr('r', fullRadius)
    .style('fill', `url(#${patternID})`)
    .attr('transform', `scale(${planetScale})`);
}