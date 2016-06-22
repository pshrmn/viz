export function addTitle(section, text, align = 'center') {
  const { element, width, height } = section;
  let x = undefined;
  let anchor = undefined;

  if ( align === 'left' ) {
    x = 0;
    anchor = 'start';
  } else if ( align === 'center' ) {
    x = width / 2;
    anchor = 'middle';
  } else {
    x = width;
    anchor = 'end';
  }
  element.append('text')
    .text(text)
    .classed('title centered', true)
    .style('text-anchor', anchor)
    .attr('transform', `translate(${x}, ${height/2})`)
    .attr('dy', '0.5em');
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
