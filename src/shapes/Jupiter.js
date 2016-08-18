import SpaceObject from 'shapes/spaceobject';

export default function JupiterFactory(radius=100) {
  return new SpaceObject(
    'jupiter',
    69911,
    779,
    'planet',
    renderJupiter.bind(null, radius),
    'img/textures/jupiter.png',
    -3.13
  );
}

function renderJupiter(radius, planetHolder) {
  const fullRadius = 100;
  const planetScale = radius / fullRadius;
  const g = planetHolder.append('g')
  g.append('circle')
    .classed('planet jupiter', true)
    .attr('r', fullRadius)
    .style('fill', 'url(#jupiter)')
    .attr('transform', `scale(${planetScale})`);
  return g;
}