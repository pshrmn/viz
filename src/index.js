import d3 from 'd3';
import { parseDate } from './date';
import { newCastPerSeason, lastSeasonForCastMembers } from './stats/cast';
import { roleCounts, seasonsByRole } from './stats/roles';
import genderStats from './stats/gender';

// genders
import chartSeasonCastMembers from './graphics/seasonCastMembers';
import chartSeasonCastMembersByGender from './graphics/groupedSeasonGenders';
import chartSeasonGenderPercents from './graphics/seasonGenderPercents';
// starting ages
import chartStartingAges from './graphics/startingAges';
import chartGroupedStartingAges from './graphics/groupedStartingAges';
import chartNormalziedStartingAges from './graphics/normalizedStartingAges';
import startingAgesTable from './graphics/startingAgesTable';
// ending ages
import chartEndingAges from './graphics/endingAges';
import chartGroupedEndingAges from './graphics/groupedEndingAges';
import chartNormalziedEndingAges from './graphics/normalizedEndingAges';
import endingAgesTable from './graphics/endingAgesTable';

import chartStartAndEnd from './graphics/startingAndEndingAges';

d3.json('/stats.json', (error, data) => {
  if ( error ) {
    console.error(error);
    return;
  }

  /*
   * castMembers:
   * name - cast member's name
   * credits - number of episodes credited in
   * first_episode - the date of the cast member's first credited appearance
   * last_episode - the date of the cast member's last credited appearance
   * start_age - the number of days old the cast member was on their first credited appearance
   * end_age - the number of days old the cast member was on their last credited appearance
   * repertory - the seasons during which the cast member was a repertory player
   * featured - the seasons during which the cast member was a featured player
   *
   * seasons:
   * season - which season
   * episodes - the number of episodes that season
   * total_cast - the total number of cast members that season
   * male - the total number of male cast members that season
   * female - the total number of female cast members that season
   * repertory - an object with the counts of male/female actors who were repertory cast members
   * featured - an object with the counts of male/female actors who were featured players
   */
  const { cast_members: castMembers, seasons } = data;
  // process data
  castMembers.forEach(cm => {
    cm.total_seasons = cm.repertory.length + cm.featured.length;
    if ( cm.first_episode ) {
      cm.first_episode = parseDate(cm.first_episode);
    }
    if ( cm.last_episode ) {
      cm.last_episode = parseDate(cm.last_episode);
    }
    cm.firstSeason = cm.featured.length ? cm.featured[0] : cm.repertory[0];
    cm.lastSeason = cm.repertory.length ? cm.repertory[cm.repertory.length-1] : cm.featured[cm.featured.length -1];
  });

  const genders = genderStats(castMembers);
  /*
  const roles = roleCounts(castMembers);
  console.log('Role Counts:', roles);

  console.log(newCastPerSeason(castMembers, seasons.length));
  console.log(lastSeasonForCastMembers(castMembers, seasons.length));
  console.log(seasonsByRole(castMembers));
  */
  chartSeasonCastMembers(seasons, '#season-casts');
  chartSeasonCastMembersByGender(seasons, '#season-genders');
  chartSeasonGenderPercents(seasons, '#season-percents')

  chartStartingAges(genders, '#starting-age');
  chartGroupedStartingAges(genders, '#starting-age-gender');
  chartNormalziedStartingAges(genders, '#starting-age-normalized');
  startingAgesTable(genders, '#starting-age-table');

  chartEndingAges(genders, '#ending-age');
  chartGroupedEndingAges(genders, '#ending-age-gender');
  chartNormalziedEndingAges(genders, '#ending-age-normalized');
  endingAgesTable(genders, '#ending-age-table');

  chartStartAndEnd(genders, '#start-and-end');
});
