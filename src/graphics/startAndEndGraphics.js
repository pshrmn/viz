import chartStartAndEnd from './startAndEnd/startingAndEndingAges';
import chartStartVsEnd from './startAndEnd/startingVsEndingAges';

export default function render(castMembers, genders) {
  chartStartAndEnd(genders, '#start-and-end');
  // chartStartVsEnd(castMembers, '#start-vs-end');
}