import genderChart from './basics/genders';
import roleChart from './basics/roles';

export default function render(castMembers) {
  genderChart(castMembers, '#basic-genders');
  roleChart(castMembers, '#basic-roles');
}
