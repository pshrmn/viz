import SpaceObject from 'shapes/spaceobject';

import moonTexture from 'textures/moon.png';

export default function MoonFactory(radius=100) {
  return new SpaceObject(
    'moon',
    1737,
    150,
    'satellite',
    renderMoon.bind(null, radius),
    moonTexture,
    0
  );
}

function renderMoon(radius, planetHolder, patternID) {
  const fullRadius = 100;
  const moonScale = radius/fullRadius;
  planetHolder.append('circle')
    .classed('satellite moon', true)
    .attr('r', fullRadius)
    .style('fill', `url(#${patternID})`)
    .attr('transform', `scale(${moonScale})`);
}