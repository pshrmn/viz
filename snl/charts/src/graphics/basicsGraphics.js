import totalChart from './basics/total';
import genderChart from './basics/genders';
import roleChart from './basics/roles';
import genderRoleChart from './basics/genderRoles';

export default function render(castMembers) {
  totalChart(castMembers, '#basic-total');
  genderChart(castMembers, '#basic-genders');
  roleChart(castMembers, '#basic-roles');
  genderRoleChart(castMembers, '#basic-gender-roles');
}
