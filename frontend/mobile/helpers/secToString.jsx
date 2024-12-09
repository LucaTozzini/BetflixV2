/**
 * Convert seconds to human-readable string
 * @param {number} sec 
 * @returns {string}
 */
export default function secToString(sec) {
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  let string = [];
  if (hours) string.push(hours + "h");
  if (minutes) string.push(minutes + "m");
  return string.join(" ");
}