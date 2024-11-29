/*
Donwload object looks like this: { name, progress, downloadSpeed, timeRemaining }

timeRemaining is given in ms
*/

import styles from "../styles/downloads-table.module.css";

function msToString(ms) {
  const hours = parseInt(ms / 3_600_000);
  const minutes = parseInt((ms % 3_600_000) / 60_000);
  const seconds = parseInt((ms % 60_000) / 1000);
  return [
    hours ? `${hours}h` : null,
    minutes ? `${minutes}m` : null,
    seconds ? `${seconds}s` : null,
  ].filter(i => i).join(" ");
}

export function DownloadsTable({ children }) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th data-cell="name">name</th>
            <th data-cell="progress">progress</th>
            <th data-cell="timeRemaining">time remaining</th>
            <th data-cell="downloadSpeed">download speed</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function DownloadsRow({ name, progress, timeRemaining, downloadSpeed }) {
  return (
    <tr>
      <td data-cell="name">{name}</td>
      <td data-cell="progress">{progress}%</td>
      <td data-cell="timeRemaining">{msToString(timeRemaining)}</td>
      {/* 
      downloadSpeed is given in bytes per second
      convert it to mb per second
        bytes/1000000 = megabytes
      */}
      <td data-cell="downloadSpeed">{Math.floor(downloadSpeed / 1_000_000)} mb/sec</td>
    </tr>
  );
}
