import SpaceObject from 'shapes/spaceobject';

export default function Neptune() {
  return new SpaceObject(
    'neptune',
    24766,
    4500,
    'planet',
    renderNeptune,
    'img/textures/neptune.png',
    'translate(100,100)'
  );
}

function renderNeptune(planetHolder) {
  const radius = 100;

  // create the g element to hold the planet
  const g = planetHolder.append('g')
  // draw the planet
  g.append('circle')
    .classed('planet neptune', true)
    .attr('r', radius)
    .style('fill', 'url(#neptune)')

  return g;
}