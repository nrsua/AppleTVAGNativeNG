export function formatClock(date, withSeconds) {
  var h = String(date.getHours()).padStart(2, '0');
  var m = String(date.getMinutes()).padStart(2, '0');
  if (!withSeconds) return h + ':' + m;
  return h + ':' + m + ':' + String(date.getSeconds()).padStart(2, '0');
}
