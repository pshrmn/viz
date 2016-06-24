import d3 from 'd3';
import './helpers/polyfills';
import { parseDate } from './helpers/date';
import genderStats from './stats/gender';

import drawBasicGraphics from './graphics/basicsGraphics';
import drawSeasonCastMemberGraphics from './graphics/seasonCastMemberGraphics';
import drawStartingAgeGraphics from './graphics/startingAgeGraphics';
import drawCreditGraphics from './graphics/creditsGraphics';
import drawEndingAgeGraphics from './graphics/endingAgeGraphics';

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

  drawBasicGraphics(castMembers);
  drawSeasonCastMemberGraphics(seasons, castMembers);  
  drawStartingAgeGraphics(genders, castMembers);
  drawCreditGraphics(castMembers);
  drawEndingAgeGraphics(genders);

  chartStartAndEnd(genders, '#start-and-end');
});
