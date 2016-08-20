import SpaceObject from 'shapes/spaceobject';

import neptuneTexture from 'textures/neptune.png';

export default function NeptuneFactory(radius=100) {
  return new SpaceObject(
    'neptune',
    24622,
    4500,
    'planet',
    renderNeptune.bind(null, radius),
    neptuneTexture,
    -28.32
  );
}

function renderNeptune(radius, planetHolder, patternID) {
  const fullRadius = 100;
  const planetScale = radius/fullRadius;
  planetHolder.append('circle')
    .classed('planet neptune', true)
    .attr('r', fullRadius)
    .style('fill', `url(#${patternID})`)
    .attr('transform', `scale(${planetScale})`);
}