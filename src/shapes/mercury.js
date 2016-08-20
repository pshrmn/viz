import SpaceObject from 'shapes/spaceobject';

import mercuryTexture from 'textures/mercury.png';

export default function MercuryFactory(radius=100) {
  return new SpaceObject(
    'mercury',
    2440,
    57,
    'planet',
    renderMercury.bind(null, radius),
    mercuryTexture,
    0
  );
}

function renderMercury(radius, planetHolder, patternID) {
  const fullRadius = 100;
  const planetScale = radius/fullRadius;
  planetHolder.append('circle')
    .classed('planet mercury', true)
    .attr('r', fullRadius)
    .style('fill', `url(#${patternID})`)
    .attr('transform', `scale(${planetScale})`);
}