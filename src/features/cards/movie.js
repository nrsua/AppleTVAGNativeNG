export function isMovieCard(data) {
  return !!(data && (data.movie || data.media_type === 'movie' || data.type === 'movie'));
}
