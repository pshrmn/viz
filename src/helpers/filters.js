export function onlyRepertory(castMembers) {
  return castMembers.filter(cm => cm.repertory.length && !cm.featured.length);
}

export function onlyFeatured(castMembers) {
  return castMembers.filter(cm => !cm.repertory.length && cm.featured.length);
}

export function bothRoles(castMembers) {
  return castMembers.filter(cm => cm.repertory.length && cm.featured.length);
}

export function male(castMembers) {
  return castMembers.filter(cm => cm.gender === 'male');
}

export function female(castMembers) {
  return castMembers.filter(cm => cm.gender === 'female');
}