/* 
 * return the mean value of a property across the data. Ignores
 * datum that do not have the property.
 */
export function meanProperty(data, property) {
  const total = data.reduce((acc, d) => {
    if ( d[property] === undefined ) {
      return acc;
    }
    acc.total += d[property];
    acc.count++;
    return acc;
  }, {total: 0, count: 0});
  return total.total / total.count;
}

/*
 * return the median value of a property across the data. Ignores
 * datum that do not have the property. Can provide a sorting function
 * if the default one (a simple subtraction on the targeted property)
 * will not suffice.
 */
export function medianProperty(data, property, cmp) {
  if ( cmp == undefined ) {
    cmp = (a,b) => b[property] - a[property];
  }
  const sortedData = data
    .filter(datum => datum[property] !== undefined)
    .sort(cmp);
  const half = sortedData.length / 2;
  if ( sortedData.length % 2 === 0 ) {
    // average the two points
    return (sortedData[half-1][property] + sortedData[half][property]) / 2;
  } else {
    // take the mid point
    return sortedData[Math.floor(half)][property];
  }
}

export function standardDeviation(data, property, mean) {
  const total = data.reduce((acc, d) => {
    if ( d[property] === undefined ) {
      return acc;
    }
    acc.total += Math.pow(d[property]-mean, 2);
    acc.count++;
    return acc;
  }, {total: 0, count: 0});
  return Math.sqrt(total.total / total.count, 2);
}
