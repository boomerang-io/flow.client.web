import React from "react";
import cx from "classnames";
import Wombat from "../WombatSuccessGraphic";
import styles from "./wombatMessage.module.scss";

interface WombatSuccessMessageProps {
  className?: string;
  message: string;
  wombatClassName?: string;
}

const WombatSuccessMessage: React.FC<WombatSuccessMessageProps> = ({ className = "", message, wombatClassName ="" }) => {
  return (
    <div className={cx(styles.container, className)}>
      <h1 className={styles.message}>{message}</h1>
      <Wombat className={wombatClassName} />
    </div>
  );
}

export default WombatSuccessMessage;
