import SpaceObject from 'shapes/spaceobject';

export default function Earth() {
  return new SpaceObject(
    'earth',
    6378,
    150,
    'planet',
    renderEarth,
    'img/textures/earth.png',
    'translate(100,100)'
  );
}

function renderEarth(planetHolder) {
  const radius = 100;

  // create the g element to hold the planet
  const g = planetHolder.append('g')
  // draw the planet
  g.append('circle')
    .classed('planet earth', true)
    .attr('r', radius)
    .style('fill', 'url(#earth)')

  return g;
}