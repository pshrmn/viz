import SpaceObject from 'shapes/spaceobject';

export default function MoonFactory(radius=100) {
  return new SpaceObject(
    'moon',
    1737,
    150,
    'satellite',
    renderMoon.bind(null, radius),
    '/static/img/textures/moon.png',
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