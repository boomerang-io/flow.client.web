import { Tile } from "@boomerang-io/carbon-addons-boomerang-react";
import styles from "./chartsTile.module.scss";

interface ChartsTileProps {
  children: React.ReactNode;
}

function ChartsTile(props: ChartsTileProps) {
  return (
    <Tile className={styles.container}>
      {props.children}
    </Tile>
  );
}

export default ChartsTile;
