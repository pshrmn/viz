import SpaceObject from 'shapes/spaceobject';

import sunTexture from 'textures/sun.png';

export default function SunFactory(radius=100) {
  return new SpaceObject(
    'sun',
    696300,
    0,
    'star',
    renderSun.bind(null, radius),
    sunTexture,
    0
  );
}

function renderSun(radius, starHolder, patternID) {
  const fullRadius = 100;
  const starScale = radius / fullRadius;
  starHolder.append('circle')
    .classed('star sun', true)
    .attr('r', fullRadius)
    .style('fill', `url(#${patternID})`)
    .attr('transform', `scale(${starScale})`);
}