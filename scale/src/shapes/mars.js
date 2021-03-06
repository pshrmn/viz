import SpaceObject from 'shapes/spaceobject';

import marsTexture from 'textures/mars.png';

export default function MarsFactory(radius=100) {
  return new SpaceObject(
    'mars',
    3390,
    228,
    'planet',
    renderMars.bind(null, radius),
    marsTexture,
    -25.19
  );
}

function renderMars(radius, planetHolder, patternID) {
  const fullRadius = 100;
  const planetScale = radius / fullRadius;
  planetHolder.append('circle')
    .classed('planet mars', true)
    .attr('r', fullRadius)
    .style('fill', `url(#${patternID})`)
    .attr('transform', `scale(${planetScale})`);
}