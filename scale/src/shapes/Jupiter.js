import SpaceObject from 'shapes/spaceobject';

import jupiterTexture from 'textures/jupiter.png';

export default function JupiterFactory(radius=100) {
  return new SpaceObject(
    'jupiter',
    69911,
    779,
    'planet',
    renderJupiter.bind(null, radius),
    jupiterTexture,
    -3.13
  );
}

function renderJupiter(radius, planetHolder, patternID) {
  const fullRadius = 100;
  const planetScale = radius / fullRadius;
  planetHolder.append('circle')
    .classed('planet jupiter', true)
    .attr('r', fullRadius)
    .style('fill', `url(#${patternID})`)
    .attr('transform', `scale(${planetScale})`);
}