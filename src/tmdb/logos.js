export function pickLogo(data, lang) {
  if (!data || !data.logos || !data.logos.length) return null;
  var preferred = data.logos.filter(function (l) { return l.iso_639_1 === lang; });
  var english = data.logos.filter(function (l) { return l.iso_639_1 === 'en'; });
  return preferred[0] || english[0] || data.logos[0] || null;
}
