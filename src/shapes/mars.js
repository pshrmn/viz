import SpaceObject from 'shapes/spaceobject';

export default function Mars() {
  return new SpaceObject(
    'mars',
    3397,
    228,
    'planet',
    renderMars,
    'img/textures/mars.png',
    'translate(100,100)'
  );
}

function renderMars(planetHolder) {
  const radius = 100;

  // create the g element to hold the planet
  const g = planetHolder.append('g')
  // draw the planet
  g.append('circle')
    .classed('planet mars', true)
    .attr('r', radius)
    .style('fill', 'url(#mars)')

  return g;
}