
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

/*
 * add a vertical (stacked) legend to the specified @section
 * @keys is an array of keys to draw in the legend. Each one should specify
 * its text value and what color it is associated with in the chart.
 * @options can be provided to configure the layout of the legend. These include:
 *    offset - provide a top and left amount to translate the legend 'g' away
 *             from the default position in the top left corner (0,0)
 *    padding - the amount of padding around each key (top and bottom)
 */
export function verticalLegend(section, keys, options = {}) {
  const { element  } = section;
  const {
    offset,
    padding = 0
  } = options;
  const legend = element.append('g')
    .classed('legend', true);

  if ( offset !== undefined ) {
    const { left = 0, top = 0 } = options.offset;
    legend.attr('transform', `translate(${left},${top})`)
  }
    
  let yOffset = 0
  keys.forEach((k, i) => {
    const key = legendKey(k.text, k.color, 0, yOffset, legend);
    const bbox = key.node().getBBox();
    yOffset += bbox.height + padding;
  }); 
}

/*
 * same as verticalLegend, but horizontal instead of vertical.
 * padding will be left and right
 */
export function horizontalLegend(section, keys, options = {}) {
  const { element  } = section;
  const {
    offset,
    padding = 0
  } = options;
  const legend = element.append('g')
    .classed('legend', true);

  if ( offset !== undefined ) {
    const { left = 0, top = 0 } = options.offset;
    legend.attr('transform', `translate(${left},${top})`)
  }
    
  let xOffset = 0
  keys.forEach((k, i) => {
    const key = legendKey(k.text, k.color, xOffset, 0, legend);
    const bbox = key.node().getBBox();
    xOffset += bbox.width + padding;
  }); 
}


function legendKey(text, color, x, y, parent) {
  const key = parent.append('g')
    .classed('key', true)
    .attr('transform', `translate(${x},${y})`);
  key.append('rect')
    .attr('x', 0)
    .attr('y', -10)
    .attr('width', 10)
    .attr('height', 10)
    .style('fill', color);
  key.append('text')
    .attr('transform', 'translate(12,0)')
    .text(text);
  return key
}