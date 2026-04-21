export function qs(sel, root) {
  return (root || document).querySelector(sel);
}

export function qsa(sel, root) {
  return Array.prototype.slice.call((root || document).querySelectorAll(sel));
}

export function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
