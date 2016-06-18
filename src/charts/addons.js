export function addTitle(section, text) {
  const { element, width, height } = section;
  element.append('text')
    .classed('title centered', true)
    .text(text)
    .attr('transform', `translate(${width/2}, ${height/2})`);
}

/*
 * add a vertical (stacked) legend to the specified @section
 * @keys is an array of keys to draw in the legend. Each one should specify
 * its text value and what color it is associated with in the chart.
 * @options can be provided to configure the layout of the legend. These include:
 *    offset - provide a top and left amount to translate the legend 'g' away
 *             from the default position in the top left corner (0,0)
 *    padding - the amount of padding around each key
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
 * same as verticalLegend, but horizontal instead of vertical
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