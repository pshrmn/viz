/*
 * take a string of form YYYY-MM-DD and return a new Date object
 * months are 0 based, so subtract 1 from it to get the correct month
 */
export function parseDate(dateString) {
  const [year, month, day] = dateString
    .split('-')
    .map(e => parseInt(e, 10));
  return new Date(year, month-1, day);
}

/*
 * given a number of days, convert to Gregorian years
 */
export function daysToYears(days) {
  return days / 365.2425;
}
