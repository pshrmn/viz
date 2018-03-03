import d3 from 'd3';

/*
 * add an axis to a chart. This should be placed into one of the
 * side sections (top, right, bottom, left);
 *
 * @section - the section object with the element to append the axis to
 * @axis - the d3 axis to be drawn
 * @side - which part of the section the axis should be pushed up against.
 *   This will typically be the opposite of the axis's orient
 *   (e.g., left oriented ticks should be on the right side of their section)
 *    'top' - horizontal axis with ticks above the line
 *    'bottom' - horizontal axis with ticks below the line
 *    'left' - vertical axis with ticks to the left of the line
 *    'right' - vertical axis with ticks to the right of the line
 *
 * returns the 'g' element that holds the axis
 */
export function drawAxis(section, axis, side) {
  const { element, width, height } = section;

  const classes = [
    'axis',
    (side === 'top' || side === 'bottom') ? 'x' : 'y'
  ];

  let left = 0;
  let top = 0;
  if ( side === 'bottom') {
    top = height;
  } else if ( side === 'right' ) {
    left = width;
  }
  const transform = `translate(${left},${top})`;

  return element.append('g')
    .classed(classes.join(' '), true)
    .attr('transform', transform)
    .call(axis);
}
