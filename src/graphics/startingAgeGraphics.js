import chartStartingAges from './start/startingAges';
import chartGroupedStartingAges from './start/groupedStartingAges';
import chartNormalizedStartingAges from './start/normalizedStartingAges';
import startingAgesTable from './start/startingAgesTable';
import chartStartingAgeBySeasonAndSeason from './start/startingAgeBySeasonAndGender';
import chartStartingAgeBySeasonAndRole from './start/startingAgeBySeasonAndRole';

export default function render(genders, castMembers) {
  chartStartingAges(genders, '#starting-age');
  chartGroupedStartingAges(genders, '#starting-age-gender');
  chartNormalizedStartingAges(genders, '#starting-age-normalized');
  startingAgesTable(genders, '#starting-age-table');
  chartStartingAgeBySeasonAndSeason(castMembers, '#starting-age-season-gender');
  chartStartingAgeBySeasonAndRole(castMembers, '#starting-age-season-role');
}
