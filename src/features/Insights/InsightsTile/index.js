import React from "react";
import PropTypes from "prop-types";
import { Tile } from "@boomerang/carbon-addons-boomerang-react";
import styles from "./insightsTile.module.scss";

InsightsTile.propTypes = {
  type: PropTypes.string,
  totalCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  infoList: PropTypes.array,
  valueWidth: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};

function InsightsTile({ title, type, totalCount, infoList, valueWidth = "2rem", tileMaxHeight = "none" }) {
  return (
    <Tile className={styles.container} style={{ maxHeight: tileMaxHeight }}>
      <div>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.totalCountContainer}>
          <p className={styles.totalCount}>{totalCount}</p>
          <p className={styles.type}>{type}</p>
        </div>
      </div>
      <ul className={styles.list}>
        {infoList.map((item, index) => (
          <li className={styles.row} key={index}>
            <p className={styles.itemValue} style={{ width: valueWidth }}>
              {item.value}
            </p>
            <p className={styles.itemLabel}>{item.label}</p>
          </li>
        ))}
      </ul>
    </Tile>
  );
}

export default InsightsTile;
