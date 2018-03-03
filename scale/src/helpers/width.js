export default function() {
  const main = document.querySelector('main');
  const mainStyle = getComputedStyle(main);
  return parseInt(mainStyle.width);
}
