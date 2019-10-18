import React from "react";
import PropTypes from "prop-types";
import styles from "./activityHeader.module.scss";
import ActivityHeaderWidget from "./ActivityHeaderWidtget";
import { ArrowDownRight32, ArrowUpRight32 } from "@carbon/icons-react";

ActivityHeader.propTypes = {
  failedActivities: PropTypes.number.isRequired,
  runActivities: PropTypes.number.isRequired,
  succeededActivities: PropTypes.number.isRequired
};

function ActivityHeader({ runActivities, succeededActivities, failedActivities }) {
  const successRate = runActivities > 0 ? succeededActivities / runActivities : 0;
  const successRatePercentage = successRate.toFixed(2) * 100;
  const emoji = successRatePercentage > 80 ? "🙌" : successRatePercentage > 50 ? "😮" : "😨";

  return (
    <header className={styles.container}>
      <div className={styles.headline}>
        <p className={styles.subtitle}>This is all of the</p>
        <p className={styles.title}>Activity</p>
      </div>
      <div className={styles.content}>
        <p className={styles.text}>Today's numbers</p>
        <ActivityHeaderWidget icon={ArrowUpRight32} text="Runs" value={runActivities} />
        <ActivityHeaderWidget icon={ArrowUpRight32} text="Successes" value={succeededActivities} />
        <ActivityHeaderWidget icon={ArrowDownRight32} text="Failures" value={failedActivities} />
        <ActivityHeaderWidget icon={emoji} text="Success rate" value={`${successRatePercentage}%`} />
      </div>
    </header>
  );
}

export default ActivityHeader;
