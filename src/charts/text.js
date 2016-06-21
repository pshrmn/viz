export function addTitle(section, text) {
  const { element, width, height } = section;
  element.append('text')
    .text(text)
    .classed('title centered', true)
    .style('text-anchor', 'middle')
    .attr('transform', `translate(${width/2}, ${height/2})`);
}

/*
 * Add a text label that is centered in the provided section's element.
 * Takes into account the size of the ticks (as provided by the user) when
 * determining the positioning.
 */
export function addLabel(section, text, orient = 'bottom', tickSize = 25) {
  const { element, width, height } = section;

  let transformed = '';
  switch ( orient ) {
  case 'top':
  case 'bottom':
    var heightOffset = (height - tickSize) / 2 + tickSize
    transformed = `translate(${width/2},${heightOffset})`
    break;
  case 'left':
  case 'right':
    var widthOffset = (width + tickSize) / 2 - tickSize;
    transformed = `translate(${widthOffset},${height/2})rotate(-90)`
    break;
  }

  element.append('text')
      .text(text)
      .style('text-anchor', 'middle')
      .attr('transform', transformed);
}
