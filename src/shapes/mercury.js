import SpaceObject from 'shapes/spaceobject';

export default function Mercury() {
  return new SpaceObject(
    'mercury',
    2440,
    57,
    'planet',
    renderMercury,
    'img/textures/mercury.png',
    'translate(100,100)'
  );
}

function renderMercury(planetHolder) {
  const radius = 100;

  // create the g element to hold the planet
  const g = planetHolder.append('g')
  // draw the planet
  g.append('circle')
    .classed('planet mercury', true)
    .attr('r', radius)
    .style('fill', 'url(#mercury)')

  return g;
}