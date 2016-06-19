import chartStartingAges from './start/startingAges';
import chartGroupedStartingAges from './start/groupedStartingAges';
import chartNormalizedStartingAges from './start/normalizedStartingAges';
import startingAgesTable from './start/startingAgesTable';

export default function render(genders) {
  chartStartingAges(genders, '#starting-age');
  chartGroupedStartingAges(genders, '#starting-age-gender');
  chartNormalizedStartingAges(genders, '#starting-age-normalized');
  startingAgesTable(genders, '#starting-age-table');
}
