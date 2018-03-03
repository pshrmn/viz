export function episodes(seasons) {
  return seasons
    .map(s => ({
      season: s.season,
      episodes: s.episodes
    }));
}