import chartTotalCredits from './credits/totalCredits';
import chartTotalSeasons from './credits/totalSeasons';
import chartCreditsVsStartAge from './credits/creditsByStartAge';
import chartSeasonsVsStartAge from './credits/seasonsByStartAge';

export default function render(castMembers) {
  chartTotalCredits(castMembers, '#total-credits');
  chartTotalSeasons(castMembers, '#total-seasons');
  chartCreditsVsStartAge(castMembers, '#credits-vs-start-age');
  chartSeasonsVsStartAge(castMembers, '#seasons-vs-start-age');
}