export default function groupBy(castMembers, property) {
  const groups = {};
  castMembers.forEach(cm => {
    const value = cm[property];
    // if a value exists, it won't be undefined
    if ( value === undefined ) {
      return;
    }
    if ( groups[value] === undefined ) {
      groups[value] = [cm];
    } else {
      groups[value].push(cm);
    }
  })
  return groups;
}