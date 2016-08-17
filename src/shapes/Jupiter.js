import SpaceObject from 'shapes/spaceobject';

export default function Jupiter() {
  return new SpaceObject(
    'jupiter',
    71492,
    779,
    'planet',
    renderJupiter,
    'img/textures/jupiter.png',
    'translate(100,100)'
  );
}

function renderJupiter(planetHolder) {
  const radius = 100;

  // create the g element to hold the planet
  const g = planetHolder.append('g')
  // draw the planet
  g.append('circle')
    .classed('planet jupiter', true)
    .attr('r', radius)
    .style('fill', 'url(#jupiter)')

  return g;
}