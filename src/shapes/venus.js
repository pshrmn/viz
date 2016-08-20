import SpaceObject from 'shapes/spaceobject';

import venusTexture from 'textures/venus.png';

export default function VenusFactory(radius=100) {
  return new SpaceObject(
    'venus',
    6052,
    108,
    'planet',
    renderVenus.bind(null, radius),
    venusTexture,
    -177.36
  );
}

function renderVenus(radius, planetHolder, patternID) {
  const fullRadius = 100;
  const planetScale = radius/fullRadius;
  planetHolder.append('circle')
    .classed('planet venus', true)
    .attr('r', fullRadius)
    .style('fill', `url(#${patternID})`)
    .attr('transform', `scale(${planetScale})`);
}