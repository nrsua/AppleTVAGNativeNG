export function resetWithDefaults(keys, defaults) {
  if (!window.Lampa || !Lampa.Storage) return;
  Object.keys(defaults).forEach(function (key) {
    if (!keys[key]) return;
    Lampa.Storage.set(keys[key], defaults[key]);
  });
}
