import styles from "../styles/media-table.module.css";
import moreIcon from "../assets/more-vertical.svg"

export function MediaTable({ title, children }) {
  return (
    <div className={styles.table}>
      <h2>{title} <span>{children.length}</span></h2>
      <div>
        <div className={styles.row}>
          <div></div>
          <div>Title</div>
          <div>Year</div>
          <div>Type</div>
        </div>
        {children}
      </div>
    </div>
  );
}

export function MediaRow({ title, year, type }) {
  return (
    <a onClick={() => window.location.href = "/console"} className={styles.row}>
      <button onClick={(e) => {e.stopPropagation() }}>
        <img src={moreIcon}/>
      </button>
      <div>{title}</div>
      <div>{year}</div>
      <div>{type}</div>
    </a>
  );
}
