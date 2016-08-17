import SpaceObject from 'shapes/spaceobject';

export default function Uranus() {
  return new SpaceObject(
    'uranus',
    25559,
    2880,
    'planet',
    renderUranus,
    'img/textures/uranus.png',
    'translate(100,100)'
  );
}

function renderUranus(planetHolder) {
  const radius = 100;

  // create the g element to hold the planet
  const g = planetHolder.append('g')
  // draw the planet
  g.append('circle')
    .classed('planet uranus', true)
    .attr('r', radius)
    .style('fill', 'url(#uranus)')

  return g;
}