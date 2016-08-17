import SpaceObject from 'shapes/spaceobject';

export default function MoonFactory(radius=100) {
  return new SpaceObject(
    'moon',
    1737,
    150,
    'satellite',
    renderMoon.bind(null, radius),
    'img/textures/moon.png',
    0
  );
}

function renderMoon(radius, planetHolder) {
  const fullRadius = 100;
  const moonScale = radius/fullRadius;
  const g = planetHolder.append('g')
  g.append('circle')
    .classed('satellite moon', true)
    .attr('r', fullRadius)
    .style('fill', 'url(#moon)')
    .attr('transform', `scale(${moonScale})`);
  return g;
}