import React from "react";
import styles from "./FeatureHeader.module.scss";

function FeatureHeader({ children }) {
  return <div className={styles.container}>{children}</div>;
}

export default FeatureHeader;
