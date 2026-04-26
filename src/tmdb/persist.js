var DB_NAME = 'agnative-cache';
var DB_VERSION = 1;
var STORE_META = 'meta';
var STORE_IMG = 'img';
var FAILED_TTL = 24 * 60 * 60 * 1000;

var _db = null;
var _dbQueue = [];
var _dbOpening = false;

function openDB(callback) {
  if (_db) { callback(_db); return; }
  _dbQueue.push(callback);
  if (_dbOpening) return;
  _dbOpening = true;

  try {
    var req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = function (e) {
      var db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_META)) db.createObjectStore(STORE_META, { keyPath: 'key' });
      if (!db.objectStoreNames.contains(STORE_IMG)) db.createObjectStore(STORE_IMG, { keyPath: 'key' });
    };
    req.onsuccess = function (e) {
      _db = e.target.result;
      _dbOpening = false;
      var q = _dbQueue.splice(0);
      q.forEach(function (cb) { cb(_db); });
    };
    req.onerror = function () {
      _dbOpening = false;
      var q = _dbQueue.splice(0);
      q.forEach(function (cb) { cb(null); });
    };
  } catch (e) {
    _dbOpening = false;
    var q = _dbQueue.splice(0);
    q.forEach(function (cb) { cb(null); });
  }
}

function idbGet(store, key, callback) {
  openDB(function (db) {
    if (!db) { callback(undefined); return; }
    try {
      var req = db.transaction(store, 'readonly').objectStore(store).get(key);
      req.onsuccess = function () {
        var entry = req.result;
        if (!entry) { callback(undefined); return; }
        callback(entry.v);
      };
      req.onerror = function () { callback(undefined); };
    } catch (e) { callback(undefined); }
  });
}

function idbSet(store, key, value, extra) {
  openDB(function (db) {
    if (!db) return;
    try {
      var record = { key: key, v: value, t: Date.now() };
      if (extra) Object.keys(extra).forEach(function (k) { record[k] = extra[k]; });
      db.transaction(store, 'readwrite').objectStore(store).put(record);
    } catch (e) {}
  });
}

function idbPruneMeta() {
}

function idbPruneImg(maxBytes) {
  openDB(function (db) {
    if (!db) return;
    try {
      var now = Date.now();
      var surviving = [];
      db.transaction(STORE_IMG, 'readwrite').objectStore(STORE_IMG).openCursor().onsuccess = function (e) {
        var cursor = e.target.result;
        if (!cursor) {
          if (maxBytes === Infinity) return;
          var total = surviving.reduce(function (s, r) { return s + r.s; }, 0);
          if (total <= maxBytes) return;
          surviving.sort(function (a, b) { return a.t - b.t; });
          try {
            var tx2 = db.transaction(STORE_IMG, 'readwrite');
            var store2 = tx2.objectStore(STORE_IMG);
            for (var i = 0; i < surviving.length && total > maxBytes; i++) {
              store2.delete(surviving[i].key);
              total -= surviving[i].s;
            }
          } catch (e2) {}
          return;
        }
        if (cursor.value.failed && now - cursor.value.t > FAILED_TTL) {
          cursor.delete();
        } else {
          surviving.push({ key: cursor.value.key, t: cursor.value.t, s: cursor.value.s || 0 });
        }
        cursor.continue();
      };
    } catch (e) {}
  });
}

export function metaGet(key, callback) {
  idbGet(STORE_META, key, callback);
}

export function metaSet(key, value) {
  idbSet(STORE_META, key, value);
}

export function prune(maxImgBytes) {
  idbPruneMeta();
  idbPruneImg(maxImgBytes === undefined ? Infinity : maxImgBytes);
}

export function clearAll() {
  openDB(function (db) {
    if (!db) return;
    try {
      var tx = db.transaction([STORE_META, STORE_IMG], 'readwrite');
      tx.objectStore(STORE_META).clear();
      tx.objectStore(STORE_IMG).clear();
    } catch (e) {}
  });
}

var _fetchTried = {};

function imgKey(url) {
  if (typeof url !== 'string') return url;
  var i = url.indexOf('/t/p/');
  if (i < 0) return url;
  var key = url.substring(i);
  var q = key.indexOf('?');
  if (q >= 0) key = key.substring(0, q);
  return key;
}

function getImgEntry(key, callback) {
  openDB(function (db) {
    if (!db) { callback(null); return; }
    try {
      var req = db.transaction(STORE_IMG, 'readonly').objectStore(STORE_IMG).get(key);
      req.onsuccess = function () {
        var entry = req.result;
        if (!entry) { callback(null); return; }
        if (entry.failed && Date.now() - entry.t > FAILED_TTL) { callback(null); return; }
        callback(entry);
      };
      req.onerror = function () { callback(null); };
    } catch (e) { callback(null); }
  });
}

function attemptStore(url, key) {
  if (_fetchTried[key]) return;
  _fetchTried[key] = true;
  fetch(url).then(function (r) {
    if (!r.ok) { idbSet(STORE_IMG, key, null, { s: 0, failed: true }); return; }
    r.blob().then(function (b) { idbSet(STORE_IMG, key, b, { s: b.size }); });
  }).catch(function () {
    idbSet(STORE_IMG, key, null, { s: 0, failed: true });
  });
}

export function imgLoad(url, callback) {
  var key = imgKey(url);
  getImgEntry(key, function (entry) {
    if (entry && entry.v) {
      try {
        callback(URL.createObjectURL(entry.v));
        return;
      } catch (e) {}
    }
    callback(url);
    if (entry && entry.failed) {
      _fetchTried[key] = true;
      return;
    }
    attemptStore(url, key);
  });
}

export function imgPreload(url) {
  var key = imgKey(url);
  getImgEntry(key, function (entry) {
    if (entry && (entry.v || entry.failed)) return;
    attemptStore(url, key);
  });
}