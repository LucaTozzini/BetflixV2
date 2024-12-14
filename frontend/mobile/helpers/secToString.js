/**
 * Convert seconds to human-readable string
 * @param {number} sec
 * @returns {string}
 */
export default function secToString(sec, includeSec) {
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  let string = [];
  if (hours) string.push(hours + "h");
  if (minutes) string.push(minutes + "m");
  if (includeSec) string.push(Math.floor(sec % 60) + "s");
  return string.join(" ");
}
