import React from "react";
import styles from "./insightsHeader.module.scss";

function InsightsHeader() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.info}>
          <h1 className={styles.title}>There are some</h1>
          <h2 className={styles.subtitle}>Insights</h2>
        </div>
      </div>
    </div>
  );
}

export default InsightsHeader;
