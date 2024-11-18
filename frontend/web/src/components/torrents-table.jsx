/* 
Example of a torrent object

{
    "url": "https://yts.mx/torrent/download/EF3306DABDB1BC32704B0AD5FEA45582C8AC7C6B",
    "hash": "EF3306DABDB1BC32704B0AD5FEA45582C8AC7C6B",
    "quality": "720p",
    "type": "web",
    "is_repack": "0",
    "video_codec": "x264",
    "bit_depth": "8",
    "audio_channels": "2.0",
    "seeds": 100,
    "peers": 100,
    "size": "936.11 MB",
    "size_bytes": 981582479,
    "date_uploaded": "2024-10-15 07:38:57",
    "date_uploaded_unix": 1728970737
}
*/

import styles from "../styles/torrents-table.module.css";

export function TorrentsTable({ children }) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th data-cell="quality">quality</th>
            <th data-cell="type">type</th>
            <th data-cell="seeds">seeds</th>
            <th data-cell="peers">peers</th>
            <th data-cell="size">size</th>
            <th data-cell="codec">codec</th>
            <th data-cell="uploaded">uploaded</th>
            <th data-cell="get"></th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function TorrentRow({
  quality,
  type,
  seeds,
  peers,
  size,
  codec,
  uploaded,
}) {
  return (
    <tr>
      <td data-cell="quality">{quality}</td>
      <td data-cell="type">{type}</td>
      <td data-cell="seeds">{seeds}</td>
      <td data-cell="peers">{peers}</td>
      <td data-cell="size">{size}</td>
      <td data-cell="codec">{codec}</td>
      <td data-cell="uploaded">{uploaded}</td>
      <td>
        <button>Get</button>
      </td>
    </tr>
  );
}
