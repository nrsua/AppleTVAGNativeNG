export function storageGet(key, fallback) {
  try {
    if (!window.Lampa || !Lampa.Storage || !Lampa.Storage.get) return fallback;
    return Lampa.Storage.get(key, fallback);
  } catch (e) {
    return fallback;
  }
}

export function storageSet(key, value) {
  try {
    if (!window.Lampa || !Lampa.Storage || !Lampa.Storage.set) return;
    Lampa.Storage.set(key, value);
  } catch (e) {
    // no-op
  }
}
