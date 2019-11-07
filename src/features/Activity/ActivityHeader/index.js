import React from "react";
import PropTypes from "prop-types";
import FeatureHeader from "Components/FeatureHeader";
import ActivityHeaderWidget from "./ActivityHeaderWidtget";
import { SkeletonPlaceholder } from "carbon-components-react";
import { ArrowDownRight32, ArrowUpRight32 } from "@carbon/icons-react";
import styles from "./activityHeader.module.scss";

ActivityHeader.propTypes = {
  inProgressActivities: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  failedActivities: PropTypes.number,
  runActivities: PropTypes.number,
  succeededActivities: PropTypes.number
};

function ActivityHeader({ inProgressActivities, isLoading, runActivities, succeededActivities, failedActivities }) {
  const successRate = runActivities > 0 ? (succeededActivities + inProgressActivities) / runActivities : 0;
  const successRatePercentage = Math.round(successRate * 100);
  const emoji = successRatePercentage > 79 ? "🙌" : successRatePercentage > 49 ? "😮" : "😨";

  return (
    <FeatureHeader includeBorder={false}>
      <div className={styles.container}>
        <section className={styles.headline}>
          <p className={styles.subtitle}>This is all of the</p>
          <p className={styles.title}>Activity</p>
        </section>
        <section className={styles.content}>
          {isLoading ? (
            <SkeletonPlaceholder className={styles.summarySkeleton} />
          ) : (
            <>
              <p className={styles.text}>Today's numbers</p>
              <ActivityHeaderWidget icon={ArrowUpRight32} text="Runs" value={runActivities} />
              <ActivityHeaderWidget icon={ArrowUpRight32} text="Successes" value={succeededActivities} />
              <ActivityHeaderWidget icon={ArrowDownRight32} text="Failures" value={failedActivities} />
              <ActivityHeaderWidget icon={emoji} text="Success rate" value={`${successRatePercentage}%`} />
            </>
          )}
        </section>
      </div>
    </FeatureHeader>
  );
}

export default ActivityHeader;
