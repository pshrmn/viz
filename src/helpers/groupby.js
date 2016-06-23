/*
 * returns an object with keys determined by @property and @bucketFn
 *
 * given an array, @data, of objects, iterate over every object and place it
 * the return object using the key deterined by the bucketFn. Any objects in
 * @data that do not have the @property are filtered out.
 */
export default function groupBy(data, property, bucketFn = x => x) {
  const groups = {};
  data.forEach(d => {
    const value = d[property];
    // if a value exists, it won't be undefined
    if ( value === undefined ) {
      return;
    }
    const groupValue = bucketFn(value)
    if ( groups[groupValue] === undefined ) {
      groups[groupValue] = [d];
    } else {
      groups[groupValue].push(d);
    }
  })
  return groups;
}