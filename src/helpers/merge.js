/*
 * merges the first and second data sets. first and second are both objects containing
 * an array of data and an offset. Each position in the array represents a value that is
 * calculated by adding the offset and the index. For example, given the object:
 * {
 *   data: [4,5,6],
 *   offset: 24
 * }
 * data[0] represents the value 24, data[1] is 25, and data[2] is 26.
 * In order to merge the data arrays together, both need to have the same offset and length.
 * This is done by padding the arrays at the beginning and end as needed. The default padding
 * is the number 0, but a different one can be used if provided.
 *
 * This returns an object with two properties, data and offset.
 * data is the array of merged data. offset is the lower of the offsets between first and second
 */
export default function mergeData(first, second, pad = 0) {
  const {
    data: firstData,
    offset: firstOffset
  } = first;
  const {
    data: secondData,
    offset: secondOffset
  } = second;

  const lowFirst = firstOffset;
  const highFirst = firstOffset + firstData.length;

  const lowSecond = secondOffset;
  const highSecond = secondOffset + secondData.length;

  const lowest = Math.min(lowFirst, lowSecond);
  const highest = Math.max(highFirst, highSecond)

  const paddedFirst = padArray(firstData, lowFirst - lowest, highest - highFirst, pad);
  const paddedSecond = padArray(secondData, lowSecond - lowest, highest - highSecond, pad);

  return {
    data: paddedFirst.map((u, index) => [paddedFirst[index], paddedSecond[index]]),
    offset: lowest
  };
}

/*
 * return a new array of length front + arr.length + back. The front number of items at the
 * beginning of the array and the end number of items at the end of the array will have the
 * pad value.
 */
function padArray(arr, front, back, pad = 0) {
  return [...Array.from(new Array(front)).fill(pad), ...arr, ...Array.from(new Array(back).fill(pad))];
}