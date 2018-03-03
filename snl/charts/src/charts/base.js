import d3 from 'd3';

/*
 * A chart is made up of five sections, the first being the main area
 * and the other four being the top, right, bottom, and left sections.
 * The main section is where the actual chart is displayed. The other
 * sections are useful for placing axes, labels, and legends. The main
 * section should have both a width and a height. The vertical sections
 * (top and bottom) should have heights. The horizontal sections (right
 * and left) should have widths. All of those values should be integers.
 *
 * the main section is required, while default values will be used for
 * the other sections if they are not provided.
 *
 *        ---------------------------------------
 *        |                TOP                  |
 *    ----+-------------------------------------+----
 *    |   |                                     |   |
 *    |   |                                     |   |
 *    | L |                                     | R |
 *    | E |                MAIN                 | I |
 *    | F |                                     | G |
 *    | T |                                     | H |
 *    |   |                                     | T |
 *    |   |                                     |   |
 *    ----+-------------------------------------+----
 *        |               BOTTOM                |
 *        ---------------------------------------
 *
 * This will return an object for each section that is provided. If a section
 * is not provided, that value will be null. The object for each section has
 * three property, element (a d3-selected DOM element), width, and height.
 */
export function chartBase(sections, holderID) {
  const {
    main,
    top = {height: 0},
    right = {width: 0},
    bottom = {height: 0},
    left = {width: 0}
  } = sections;
  if ( main === undefined || main.width === undefined || main.height === undefined) {
    throw new Error(`sections.main with width and height is required, received: ${JSON.stringify(sections)}`);
  }

  const totalWidth = left.width + main.width + right.width;
  const totalHeight = top.height + main.height + bottom.height;

  // everything should be placed in the sections, so this isn't being returned
  // but if a reason comes up where it should, it's an easy fix
  const svg = d3.select(holderID).append('svg')
    .attr('height', totalHeight)
    .attr('width', totalWidth)
    .classed('chart', true);

  return {
    main: {
      element: svg.append('g')
        .classed('main-section', true)
        .attr('transform', `translate(${left.width},${top.height})`),
      width: main.width,
      height: main.height
    },
    top: top.height === 0 ? null : {
      element: svg.append('g')
        .classed('top-section', true)
        .attr('transform', `translate(${left.width},0)`),
      width: main.width,
      height: top.height
    },
    right: right.width === 0 ? null : {
      element: svg.append('g')
        .classed('right-section', true)
        .attr('transform', `translate(${left.width+main.width},${top.height})`),
      width: right.width,
      height: main.height
    },
    bottom: bottom.height === 0 ? null : {
      element: svg.append('g')
        .classed('bottom-section', true)
        .attr('transform', `translate(${left.width},${top.height+main.height})`),
      width: main.width,
      height: bottom.height
    },
    left: left.width === 0 ? null : {
      element: svg.append('g')
        .classed('left-section', true)
        .attr('transform', `translate(0,${top.height})`),
      width: left.width,
      height: main.height
    }
  };
}
