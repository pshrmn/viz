import chartEndingAges from './end/endingAges';
import chartGroupedEndingAges from './end/groupedEndingAges';
import chartNormalizedEndingAges from './end/normalizedEndingAges';
import endingAgesTable from './end/endingAgesTable';

export default function render(genders) {
  chartEndingAges(genders, '#ending-age');
  chartGroupedEndingAges(genders, '#ending-age-gender');
  chartNormalizedEndingAges(genders, '#ending-age-normalized');
  endingAgesTable(genders, '#ending-age-table');
}
