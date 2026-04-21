export function getTmdbPath(type, id) {
  return type === 'movie' ? '/movie/' + id : '/tv/' + id;
}
