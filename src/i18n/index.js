import { ru } from './ru.js';
import { en } from './en.js';
import { uk } from './uk.js';
import { be } from './be.js';
import { GENRE_MAP_LOCALIZED } from './genres.js';

const I18N = { ru, en, uk, be };
const I18N_CODES = Object.keys(I18N);

export function hasI18nCode(code) {
  return I18N_CODES.indexOf(code) !== -1;
}

export function registerI18nToLampa() {
  if (!window.Lampa || !Lampa.Lang || typeof Lampa.Lang.add !== 'function') return;
  if (window.__APPLETV_AGNATIVE_I18N_REGISTERED__) return;

  var payload = {};

  I18N_CODES.forEach(function (code) {
    var dict = I18N[code] || {};
    Object.keys(dict).forEach(function (key) {
      if (!payload[key]) payload[key] = {};
      payload[key][code] = dict[key];
    });
  });

  Lampa.Lang.add(payload);
  window.__APPLETV_AGNATIVE_I18N_REGISTERED__ = true;
}

export { GENRE_MAP_LOCALIZED };
