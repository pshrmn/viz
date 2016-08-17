import SpaceObject from 'shapes/spaceobject';

export default function NeptuneFactory(radius=100) {
  return new SpaceObject(
    'neptune',
    24766,
    4500,
    'planet',
    renderNeptune.bind(null, radius),
    'img/textures/neptune.png',
    -28.32
  );
}

function renderNeptune(radius, planetHolder) {
  const fullRadius = 100;
  const planetScale = radius/fullRadius;
  const g = planetHolder.append('g')
  g.append('circle')
    .classed('planet neptune', true)
    .attr('r', fullRadius)
    .style('fill', 'url(#neptune)')
    .attr('transform', `scale(${planetScale})`);
  return g;
}