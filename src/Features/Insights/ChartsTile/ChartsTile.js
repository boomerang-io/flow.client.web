import React from "react";
import { Tile } from "@boomerang-io/carbon-addons-boomerang-react";
import styles from "./chartsTile.module.scss";


function ChartsTile({ children }) {
  return (
    <Tile className={styles.container}>
      {children}
    </Tile>
  );
}

export default ChartsTile;
