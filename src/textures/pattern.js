import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { easeLinear } from 'd3-ease';

const patternWidth = 618;
const patternHeight = 200;

export default function(defs, texture, id, delta=1) {
  const x = Math.random() * patternWidth;
  const pattern = defs.append('pattern')
    .attr('id', id)
    .attr('width', patternWidth)
    .attr('height', patternHeight)
    .attr('y', patternHeight/2)
    .attr('x', x)
    .attr('patternUnits', 'userSpaceOnUse');
  pattern.append('image')
    .attr('xlink:href', texture)
    .attr('width', patternWidth)
    .attr('height', patternHeight);

  return rotater(pattern, delta);
}

function rotater(pattern, delta) {
  const diff = delta*618
  function recursiveTransition() {  
    pattern
      .transition()
      .duration(10000)
      .ease(easeLinear)
      .on('end', recursiveTransition)
      .attr('x', function(d) { return parseFloat(select(this).attr('x')) + diff;})
  }

  return {
    start: () => { recursiveTransition(); },
    stop: () => { pattern.interrupt(); }
  }
}
