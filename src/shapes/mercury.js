import SpaceObject from 'shapes/spaceobject';

export default function MercuryFactory(radius=100) {
  return new SpaceObject(
    'mercury',
    2440,
    57,
    'planet',
    renderMercury.bind(null, radius),
    'img/textures/mercury.png',
    0
  );
}

function renderMercury(radius, planetHolder) {
  const fullRadius = 100;
  const planetScale = radius/fullRadius;
  const g = planetHolder.append('g')
  g.append('circle')
    .classed('planet mercury', true)
    .attr('r', fullRadius)
    .style('fill', 'url(#mercury)')
    .attr('transform', `scale(${planetScale})`);
  return g;
}