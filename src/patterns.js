import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { easeLinear } from 'd3-ease';

// these are the width and height of the pattern textures
const patternWidth = 618;
const patternHeight = 200;

/*
 * Given an svg element and a data array where each datum has
 * a name and a texture url, create a pattern for each datum.
 * Return an object with two methods: start, which will transform
 * the patterns to give a cheap rotation appearance, and stop, which
 * will stop the transform.
 */
export default function(data, svg) {
  const defs = svg.append('defs');
  const patterns = defs.selectAll('pattern')
      .data(data)
    .enter().append('pattern')
      .attr('id', d => d.name)
      .attr('width', patternWidth)
      .attr('height', patternHeight)
      .attr('y', patternHeight / 2)
      .attr('x', 0)
      .attr('patternUnits', 'userSpaceOnUse');

  patterns.append('image')
    .attr('xlink:href', d => d.texture)
    .attr('width', patternWidth)
    .attr('height', patternHeight);

  let running = true;
  function recursiveTransition() {
    if ( !running ) {
      return;
    }
    const rotate = transition()
      .duration(5000)
      .ease(easeLinear)
      .on('end', recursiveTransition)
    
    patterns
      .transition(rotate)
      .attr('x', function(d) { return parseFloat(select(this).attr('x')) - 640;})
  }

  return {
    start() {
      running = true;
      recursiveTransition();
    },
    stop() {
      running = false;
      patterns.interrupt()
    }
  }
}