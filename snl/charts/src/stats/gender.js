import { male, female } from '../helpers/filters';
import { medianProperty, meanProperty, standardDeviation } from '../helpers/average';
import { daysToYears } from '../helpers/date';

export default function genderStats(castMembers) {
  const maleCastMembers = male(castMembers);
  const femaleCastMembers = female(castMembers);
  return {
    male: groupStats(maleCastMembers),
    female: groupStats(femaleCastMembers),
    all: groupStats(castMembers)
  }
}

function groupStats(castMembers) {
  let youngest_start = null;
  let oldest_start = null;
  let youngest_end = null;
  let oldest_end = null;
  castMembers.forEach(cm => {
    if ( cm.start_age ) {
      if ( youngest_start === null || cm.start_age < youngest_start.start_age ) {
        youngest_start = cm;
      }
      if ( oldest_start === null || cm.start_age > oldest_start.start_age ) {
        oldest_start = cm;
      }
    }
    if ( cm.end_age ) {
      if ( youngest_end === null || cm.end_age < youngest_end.end_age ) {
        youngest_end = cm;
      }
      if ( oldest_end === null || cm.end_age > oldest_end.end_age ) {
        oldest_end = cm;
      } 
    }
  });

  const meanStart = meanProperty(castMembers, 'start_age');
  const meanEnd = meanProperty(castMembers, 'end_age');
  const meanSeasons = meanProperty(castMembers, 'total_seasons')

  return {
    start: {
      median: daysToYears(medianProperty(castMembers, 'start_age')),
      mean: daysToYears(meanStart),
      standardDev: daysToYears(standardDeviation(castMembers, 'start_age', meanStart)),
      youngest: youngest_start,
      oldest: oldest_start,
      ages: groupedAges(
        castMembers
          .filter(cm => cm.start_age !== undefined)
          .map(cm => daysToYears(cm.start_age))
      )
    },
    end: {
      median: daysToYears(medianProperty(castMembers, 'end_age')),
      mean: daysToYears(meanEnd),
      standardDev: daysToYears(standardDeviation(castMembers, 'start_age', meanEnd)),
      youngest: youngest_end,
      oldest: oldest_end,
      ages: groupedAges(
        castMembers
          .filter(cm => cm.end_age !== undefined)
          .map(cm => daysToYears(cm.end_age))
      )
    },
    medianSeasons: medianProperty(castMembers, 'total_seasons'),
    meanSeasons: meanSeasons,
    standardDevSeasons: standardDeviation(castMembers, 'total_seasons', meanSeasons),
    count: castMembers.length
  };
}

function groupedAges(ages) {
  const wholeAges = {};
  ages.forEach(age => {
    const whole = Math.floor(age);
    if ( wholeAges[whole] === undefined ) {
      wholeAges[whole] = 1;
    } else {
      wholeAges[whole]++;
    }
  });
  const years = Object.keys(wholeAges).map(a => parseInt(a, 10));
  const min = Math.min.apply(null, years);
  const max = Math.max.apply(null, years);
  const length = (max - min) + 1;
  const agesArray = Array.from(new Array(length)).map((u, index) => {
    const trueYear = index + min;
    return wholeAges[trueYear] === undefined ? 0 : wholeAges[trueYear];
  });
  return {
    offset: min,
    ages: agesArray
  };
}

