import SpaceObject from 'shapes/spaceobject';

export default function Venus() {
  return new SpaceObject(
    'venus',
    6052,
    108,
    'planet',
    renderVenus,
    'img/textures/venus.png',
    'translate(100,100)'
  );
}

function renderVenus(planetHolder) {
  const radius = 100;

  // create the g element to hold the planet
  const g = planetHolder.append('g')
  // draw the planet
  g.append('circle')
    .classed('planet venus', true)
    .attr('r', radius)
    .style('fill', 'url(#venus)')

  return g;
}