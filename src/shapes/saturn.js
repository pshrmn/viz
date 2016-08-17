import SpaceObject from 'shapes/spaceobject';

export default function SaturnFactory(radius=100) {
  return new SpaceObject(
    'saturn',
    60268,
    1430,
    'planet',
    renderSaturn.bind(null, radius),
    'img/textures/saturn.png',
    -26.73
  );
}

function renderSaturn(radius, planetHolder) {
  const fullRadius = 100;
  const planetScale = radius/fullRadius;
  const g = planetHolder.append('g');
  // create an extra group element that will be used to rotate saturn
  // this is used so that other transformations do not override the rotate
  // the planet scale can also be applied here instead of on the circle like
  // the other objects since this has a circle and a path.
  const rotG = g.append('g')
    .attr('transform', `scale(${planetScale})`);
  rotG.append('circle')
    .classed('planet saturn', true)
    .attr('r', fullRadius)
    .style('fill', 'url(#saturn)')
  // the ring radius numbers are just made up values that look nice, not realistic ratios
  // based on the real rings.
  rotG.append('path')
    .classed('rings', true)
    .attr('d', drawRings(fullRadius, [fullRadius*2, fullRadius*0.5], [fullRadius*1.25, fullRadius*0.25]))
    .style('fill', '#696051');
  return g;
}

/*
 * Below is how to determine where two ellipses intersect. In this case, it is
 * a circle and an ellipse. The gist is that we will factor out the x value
 * from each equation, add the equations together, move everything to the left
 * side, and use the quadratic equation to solve for y (both positive and negative).
 *
 * Then, those y values are used to solve for the x values (both positive and
 * negative).
 * 
 * This assumes that both the circle and the ellipse share the same center point,
 * since for this problem them do.
 * 
 * circle equation
 * x^2/cr^2 + y^2/cr^2 = 1
 * multiply by cr^2
 * x^2 + y^2 = cr^2
 *
 * ellipse equation
 * x^2/exR^2 + y^2/eyR^2 = 1
 * multiply by -exR^2
 * -x^2 - exR^2 * y^2/eyR^2 = -exR^2
 *
 * y^2 - exR^2 * y^2/eyR^2 = cr^2 - exR^2
 * y^2 - exR^2 * y^2/eyR^2 - cr^2 + exR^2 = 0
 * multiply by eyR^2
 * eyR^2 * y^2 - exR^2 * y^2 - eyR^2 * cr^2 + eyR^2 + exR^2 = 0
 * (eyR^2-exR^2) * y^2 + eyR^2 * (exR^2-cr^2) = 0
 * a*x^2 + bx + c = 0
 * a = eyR^2-exR^2
 * b = 0
 * c = eyR^2 * (exR^2 - cr^2)
 * y = (-b +- Math.sqrt(b^2 - 4*a*c)) / 2*a
 * y = (0 +- Math.sqrt(-4*a*c)) / 2*a
 * y = 1*Math.sqrt(-4 * (eyR^2-exR^2) * (eyR^2 * (exR^2 - cr^2))) / 2*(eyR^2-exR^2)
 * and
 * y = -1*Math.sqrt(-4 * (eyR^2-exR^2) * (eyR^2 * (exR^2 - cr^2))) / 2*(eyR^2-exR^2)
 *
 * now, solve for x
 * x^2 + y^2 = cr^2
 * x = Math.sqrt(cr^2 - y^2)
 * we then will multiply each x value by -1 to 
 * calculate all four intersection points
 */

/*
 * cR - circle radius
 * exR - ellipse x radius
 * eyR - ellipse y radius
 */
function determineIntersections(cR, exR, eyR) {
  const xSquared = Math.pow(exR, 2);
  const ySquared = Math.pow(eyR, 2);
  const cSquared = Math.pow(cR, 2);
  const posY = Math.sqrt(-4* (ySquared - xSquared) * (ySquared * (xSquared-cSquared)) ) / (2 * (ySquared-xSquared));
  const negY = -1 * posY;
   
  const x1 = Math.sqrt(cSquared - Math.pow(posY, 2));
  const x2 = Math.sqrt(cSquared - Math.pow(negY, 2));
  return [
    [x1, posY],
    [-1*x1, posY],
    [x2, negY],
    [-1*x2, negY]
  ];
}

// determine the top left and right points given four points
// because the y axis goes down, the top points have negative y values
function topPoints(points) {
  const positivePoints = points.filter(p => p[1] < 0);
  const first = positivePoints[0];
  const second = positivePoints[1];
  return first[0] < second[0] ? [first, second] : [second, first];  
}

/*
 * An arcTo is defined using seven values:
 *
 * rx - radius in x dimension
 * ry - radius in y dimension
 * xAxisRotate - just set to 0
 * LargeArcFlag - 0 to draw smallest arc, 1 to draw largest
 * SweepFlag - 0 to draw counterclockwise, 1 to draw clockwise
 * x - destination x coordinate
 * y -destination y coordinate
 */
function drawRings(circleRadius, outerRing, innerRing) {
  const outerPoints = topPoints(determineIntersections(circleRadius, outerRing[0], outerRing[1]));
  const innerPoints = topPoints(determineIntersections(circleRadius, innerRing[0], innerRing[1]));
  // outerPoints 0 to outerPoints 1 to innerPoints 1 to innerPoints 0
  const commands = [
    `M ${outerPoints[0][0]},${outerPoints[0][1]}`,
    arc(outerRing[0], outerRing[1], 0, 1, 0, outerPoints[1][0], outerPoints[1][1]),
    arc(circleRadius, circleRadius, 0, 0, 1, innerPoints[1][0], innerPoints[1][1]),
    arc(innerRing[0], innerRing[1], 0, 1, 1, innerPoints[0][0], innerPoints[0][1]),
    arc(circleRadius, circleRadius, 0, 0, 1, outerPoints[0][0], outerPoints[0][1])
  ];
  return commands.join(' ');
}

function arc(rx,ry,xRot,large,sweep,x,y) {
  return `A ${rx},${ry}, ${xRot}, ${large}, ${sweep}, ${x},${y}`;
}