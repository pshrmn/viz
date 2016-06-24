import chartTotalCredits from './credits/totalCredits';
import chartTotalSeasons from './credits/totalSeasons';
import chartGenderCredits from './credits/totalCreditsByGender';
import chartGenderSeasons from './credits/totalSeasonsByGender';
import chartCreditsVsStartAge from './credits/creditsByStartAge';
import chartSeasonsVsStartAge from './credits/seasonsByStartAge';

export default function render(castMembers) {
  chartTotalCredits(castMembers, '#total-credits');
  chartTotalSeasons(castMembers, '#total-seasons');
  chartGenderCredits(castMembers, '#gender-credits');
  chartGenderSeasons(castMembers, '#gender-seasons');
  chartCreditsVsStartAge(castMembers, '#credits-vs-start-age');
  chartSeasonsVsStartAge(castMembers, '#seasons-vs-start-age');
}