/*
 * every planet/moon is an instance of SpaceObject:
 * 
 * render - this method takes two elements, the first being an svg
 *   element where the object should be rendered and the second
 *   being an svg:defs object to add the object's pattern to
 * rescale - this method takes the new scale value for rendering
 *   the object. A second argument can be passed, which is the amount of
 *   time to transition from the current scale to the new scale.
 * radScale - this method updates the object's scale value based on the
 *   argument and the object's planetRadius value. A second argument can be
 *   passed, which is the amount of time to transition from the current scale
 *   to the new scale.
 * toggleRotate - this method controls the rotation of the object.
 *   If no argument is passed, it flips the current rotating boolean.
 *   If an argument is passed, the rotating boolean is set to it. When
 *   the rotating boolean is true, a recursive transition is applied
 *   to the object's pattern, giving a cheap "rotation" illusion to the
 *   rendered object.
 */
import _Mercury from './mercury';
import _Venus from './venus';
import _Earth from './earth';
import _Mars from './mars';
import _Jupiter from './jupiter';
import _Saturn from './saturn';
import _Uranus from './uranus';
import _Neptune from './neptune';

import _Moon from './moon';
import _Sun from './sun';

export const MercuryFactory = _Mercury;
export const VenusFactory = _Venus;
export const EarthFactory = _Earth;
export const MarsFactory = _Mars;
export const JupiterFactory = _Jupiter;
export const SaturnFactory = _Saturn;
export const UranusFactory = _Uranus;
export const NeptuneFactory = _Neptune;

export const MoonFactory = _Moon;
export const SunFactory = _Sun;

const planets = [
  _Mercury,
  _Venus,
  _Earth,
  _Mars,
  _Jupiter,
  _Saturn,
  _Uranus,
  _Neptune
];

export default planets;