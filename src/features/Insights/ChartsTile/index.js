import React from "react";
import PropTypes from "prop-types";
import { Tile } from "@boomerang/carbon-addons-boomerang-react";
import styles from "./chartsTile.module.scss";

ChartsTile.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

function ChartsTile({ title, type, totalCount, children, tileWidth = "auto", tileMaxHeight = "none" }) {
  return (
    <Tile className={styles.container} style={{ width: tileWidth, maxHeight: tileMaxHeight }}>
      <div>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.totalCountContainer}>
          <p className={styles.totalCount}>{totalCount}</p>
          <p className={styles.type}>{type}</p>
        </div>
      </div>
      {children}
    </Tile>
  );
}

export default ChartsTile;
