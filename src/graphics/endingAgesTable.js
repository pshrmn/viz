import { roundYears } from '../round';
import { daysToYears } from '../date';
import table from '../charts/table';


export default function endingAgesTable(data, holderID) {
  const headers = ['', 'Median', 'Mean', 'Youngest', 'Oldest'];
  const rows = ['all', 'male', 'female'].map(key => {
    const endData = data[key].end;
    const { mean, median, oldest, youngest, standardDev } = endData;
    return [
      key,
      roundYears(median),
      `${roundYears(mean)} &plusmn; ${roundYears(standardDev)}`,
      `${youngest.name} (${roundYears(daysToYears(youngest.end_age))})`,
      `${oldest.name} (${roundYears(daysToYears(oldest.end_age))})`
    ];
  });

  table(rows, holderID, headers, 'Cast Member Ending Ages (in Years)');
}
