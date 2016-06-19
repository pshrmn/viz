import { roundFloat } from '../../round';
import { daysToYears } from '../../date';
import table from '../../charts/table';


export default function endingAgesTable(data, holderID) {
  const headers = ['', 'Median', 'Mean', 'Youngest', 'Oldest'];
  const rows = ['all', 'male', 'female'].map(key => {
    const endData = data[key].end;
    const { mean, median, oldest, youngest, standardDev } = endData;
    return [
      key,
      roundFloat(median),
      `${roundFloat(mean)} ± ${roundFloat(standardDev)}`,
      `${youngest.name} (${roundFloat(daysToYears(youngest.end_age))})`,
      `${oldest.name} (${roundFloat(daysToYears(oldest.end_age))})`
    ];
  });

  table(rows, holderID, headers, 'Cast Member Ending Ages (in Years)');
}
