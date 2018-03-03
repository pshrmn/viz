export default function simpleRange(count) {
  return Array.from(new Array(count)).map((_,i) => i);
}