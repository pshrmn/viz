export function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if ( !immediate ) {
        func.apply(this, arguments);
      }
    }, wait);
    if ( immediate && !timeout ) {
      func.apply(this, arguments);
    }
  };
};