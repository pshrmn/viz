import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { easeLinear } from 'd3-ease';

const patternWidth = 618;
const patternHeight = 200;

export default function(defs, texture, id) {
  const pattern = defs.append('pattern')
    .attr('id', id)
    .attr('width', patternWidth)
    .attr('height', patternHeight)
    .attr('y', patternHeight/2)
    .attr('x', 0)
    .attr('patternUnits', 'userSpaceOnUse');
  pattern.append('image')
    .attr('xlink:href', texture)
    .attr('width', patternWidth)
    .attr('height', patternHeight);

  return rotater(pattern); 
}

function rotater(pattern) {
  function recursiveTransition() {  
    pattern
      .transition()
      .duration(10000)
      .ease(easeLinear)
      .on('end', recursiveTransition)
      .attr('x', function(d) { return parseFloat(select(this).attr('x')) - 640;})
  }

  return {
    start: () => { recursiveTransition(); },
    stop: () => { pattern.interrupt(); }
  }
}
