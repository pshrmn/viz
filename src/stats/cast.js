export function newCastPerSeason(castMembers, seasonCount) {
  const seasonCounts = Array.from(new Array(seasonCount)).fill(0);
  castMembers.forEach(cm => {
    const { firstSeason } = cm;
    if ( firstSeason !== null ) {
      seasonCounts[firstSeason-1]++;
    }
  });
  return seasonCounts;
}

export function lastSeasonForCastMembers(castMembers, seasonCount) {
  // don't include the most recent season
  const seasonCounts = Array.from(new Array(seasonCount-1)).fill(0);
  castMembers.forEach(cm => {
    const { lastSeason } = cm;
    if ( lastSeason !== null && lastSeason !== seasonCount) {
      seasonCounts[lastSeason-1]++;
    }
  });
  return seasonCounts; 
}

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