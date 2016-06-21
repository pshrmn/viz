import chartSeasonCastMembers from './season/seasonCastMembers';
import chartSeasonCastMembersByGender from './season/groupedSeasonGenders';
import chartSeasonCastMembersByRole from './season/groupedSeasonRoles';
import chartSeasonGenderPercents from './season/seasonGenderPercents';
import chartSeasonRolePercents from './season/seasonRolePercents';

export default function render(seasons) { 
  chartSeasonCastMembers(seasons, '#season-casts');
  chartSeasonCastMembersByGender(seasons, '#season-genders');
  chartSeasonCastMembersByRole(seasons, '#season-roles')
  chartSeasonGenderPercents(seasons, '#season-gender-percents');
  chartSeasonRolePercents(seasons, '#season-role-percents');
}
