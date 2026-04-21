export function formatRating(vote) {
  var n = Number(vote || 0);
  return Number.isFinite(n) ? n.toFixed(1) : '';
}
