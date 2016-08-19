import SpaceObject from 'shapes/spaceobject';

export default function EarthFactory(radius=100) {
  return new SpaceObject(
    'earth',
    6371,
    150,
    'planet',
    renderEarth.bind(null, radius),
    'img/textures/earth.png',
    -23.45
  );
}

function renderEarth(radius, planetHolder, patternID) {
  const fullRadius = 100;
  const planetScale = radius / fullRadius;
  planetHolder.append('circle')
    .classed('planet earth', true)
    .attr('r', fullRadius)
    .style('fill', `url(#${patternID})`)
    .attr('transform', `scale(${planetScale})`);
}