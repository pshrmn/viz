import { roundYears } from '../round';
import { daysToYears } from '../date';
import table from '../charts/table';


export default function startingAgesTable(data, holderID) {
  const headers = ['', 'Median', 'Mean', 'Youngest', 'Oldest'];
  const rows = ['all', 'male', 'female'].map(key => {
    const startData = data[key].start;
    const { mean, median, standardDev, oldest, youngest } = startData;
    return [
      key,
      roundYears(median),
      `${roundYears(mean)} &plusmn; ${roundYears(standardDev)}`,
      `${youngest.name} (${roundYears(daysToYears(youngest.start_age))})`,
      `${oldest.name} (${roundYears(daysToYears(oldest.start_age))})`
    ];
  });

  table(rows, holderID, headers, 'Cast Member Starting Ages (in Years)');
}

