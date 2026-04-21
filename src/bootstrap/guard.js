const PLUGIN_GUARD_KEY = '__APPLETV_AGNATIVE_TOPNAV__';

export function canBootPlugin() {
  if (typeof window === 'undefined') return false;
  if (window[PLUGIN_GUARD_KEY]) return false;
  window[PLUGIN_GUARD_KEY] = true;
  return true;
}
