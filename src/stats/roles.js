export function roleCounts(castMembers) {
  return castMembers.reduce((acc, cm) => {
    const { repertory, featured } = cm;
    if ( repertory.length && featured.length ) {
      acc.both++;
    } else if ( repertory.length ) {
      acc.repertory++;
    } else if ( featured.length ) {
      acc.featured++;
    }
    return acc;
  }, {both: 0, repertory: 0, featured: 0});
}

export function seasonsByRole(castMembers) {
  return castMembers
    .map(cm => ({
      name: cm.name,
      repertory: cm.repertory.length,
      featured: cm.featured.length,
      firstSeason: cm.featured.length ? cm.featured[0] : cm.repertory[0]
    }))
    .sort((a,b) => a.firstSeason - b.firstSeason);
}
