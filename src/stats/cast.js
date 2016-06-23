export function startingAges(castMembers) {
  return castMembers
    .filter(cm => cm.start_age !== undefined )
    .map(cm => ({
      name: cm.name,
      age: cm.start_age
    }));
}

export function endingAges(castMembers) {
  return castMembers
    .filter(cm => cm.end_age !== undefined )
    .map(cm => ({
      name: cm.name,
      age: cm.end_age
    }));
}