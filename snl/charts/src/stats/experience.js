/*
 * return an object where the keys are the seasons and the values are an object
 * that includes the total experience for that season, the cast member count,
 * and a list of cast members with their experience prior to the season
 */
export function seasonsExperience(castMembers) {
  const seasons = {}
  castMembers.forEach(cm => {
    let experience = 0;
    cm.featured.forEach(s => {
      if ( seasons[s] === undefined ) {
        seasons[s] = {
          season: s,
          total: 0,
          count: 0,
          cast: []
        };
      }
      seasons[s].total += experience;
      seasons[s].count++;
      seasons[s].cast.push({name: cm.name, experience: experience});
      experience++;
    });
    cm.repertory.forEach(s => {
      if ( seasons[s] === undefined ) {
        seasons[s] = {
          season: s,
          total: 0,
          count: 0,
          cast: []
        };
      }
      seasons[s].total += experience;
      seasons[s].count++;
      seasons[s].cast.push({name: cm.name, experience: experience});
      experience++;
    });
  });
  Object.keys(seasons).forEach(s => {
    seasons[s].mean = seasons[s].total / seasons[s].count;
  });
  // this would break if any season was missing
  return Object.keys(seasons)
    .map(s => seasons[s])
    .sort((a,b) => a.season - b.season);
}
