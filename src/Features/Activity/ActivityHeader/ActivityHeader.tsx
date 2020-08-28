//@ts-nocheck
import React from "react";
import PropTypes from "prop-types";
import FeatureHeader from "Components/FeatureHeader";
import ActivityHeaderWidget from "./ActivityHeaderWidget";
import { SkeletonPlaceholder } from "@boomerang-io/carbon-addons-boomerang-react";
import { ArrowDownRight32, ArrowUpRight32 } from "@carbon/icons-react";
import styles from "./activityHeader.module.scss";

ActivityHeader.propTypes = {
  inProgressActivities: PropTypes.number,
  isError: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  failedActivities: PropTypes.number,
  runActivities: PropTypes.number,
  succeededActivities: PropTypes.number,
};

function ActivityHeader({
  inProgressActivities,
  isError,
  isLoading,
  runActivities,
  succeededActivities,
  failedActivities,
}) {
  const successRate = runActivities > 0 ? (succeededActivities + inProgressActivities) / runActivities : 0;
  const successRatePercentage = Math.round(successRate * 100);
  const emoji = successRatePercentage > 79 ? "🙌" : successRatePercentage > 49 ? "😮" : "😨";

  return (
    <FeatureHeader includeBorder={false}>
      <div className={styles.container}>
        <hgroup>
          <p className={styles.subtitle}>This is all of the</p>
          <h1 className={styles.title}>Activity</h1>
        </hgroup>
        <section className={styles.content}>
          {isLoading ? (
            <SkeletonPlaceholder className={styles.summarySkeleton} />
          ) : isError ? (
            <>
              <p className={styles.text}>Today's numbers</p>
              <ActivityHeaderWidget text="Runs" value={"--"} />
              <ActivityHeaderWidget text="Successes" value={"--"} />
              <ActivityHeaderWidget text="Failures" value={"--"} />
              <ActivityHeaderWidget text="Success rate" value={"--"} />
            </>
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
