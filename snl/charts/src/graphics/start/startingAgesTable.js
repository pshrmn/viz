import { roundFloat } from '../../helpers/round';
import { daysToYears } from '../../helpers/date';
import table from '../../charts/table';

export default function startingAgesTable(data, holderID) {
  const headers = ['', 'Median', 'Mean', 'Youngest', 'Oldest'];
  const rows = ['all', 'male', 'female'].map(key => {
    const startData = data[key].start;
    const { mean, median, standardDev, oldest, youngest } = startData;
    return [
      key,
      roundFloat(median),
      `${roundFloat(mean)} ± ${roundFloat(standardDev)}`,
      `${youngest.name} (${roundFloat(daysToYears(youngest.start_age))})`,
      `${oldest.name} (${roundFloat(daysToYears(oldest.start_age))})`
    ];
  });

  table(rows, holderID, headers, 'SNL Cast Member Starting Ages (in Years)');
}

