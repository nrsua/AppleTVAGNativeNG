export function isEpisodeCard(cardEl) {
  return !!(cardEl && cardEl.classList && cardEl.classList.contains('card-episode'));
}
