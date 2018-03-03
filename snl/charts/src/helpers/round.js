export function roundDown(age, int) {
  return Math.floor(age/int)*int;
}

export function roundUp(age, int) {
  return Math.ceil(age/int)*int;
}

/*
 * this doesn't have to be years
 */
export function roundFloat(f, count = 2) {
  return f.toFixed(count);
}
