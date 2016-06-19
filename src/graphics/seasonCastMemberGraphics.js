import chartSeasonCastMembers from './season/seasonCastMembers';
import chartSeasonCastMembersByGender from './season/groupedSeasonGenders';
import chartSeasonGenderPercents from './season/seasonGenderPercents';
import chartSeasonRolePercents from './season/seasonRolePercents';

export default function render(seasons) { 
  chartSeasonCastMembers(seasons, '#season-casts');
  chartSeasonCastMembersByGender(seasons, '#season-genders');
  chartSeasonGenderPercents(seasons, '#season-percents');
  chartSeasonRolePercents(seasons, '#season-roles');
}
