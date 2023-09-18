//@ts-nocheck
import React from "react";
import PropTypes from "prop-types";
import HeaderWidget from "Components/HeaderWidget";
import {
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { SkeletonPlaceholder, Breadcrumb, BreadcrumbItem } from "@carbon/react";
import { ArrowDownRight, ArrowUpRight } from "@carbon/react/icons";
import { Link } from "react-router-dom";
import { appLink } from "Config/appConfig";
import styles from "./activityHeader.module.scss";

ActivityHeader.propTypes = {
  inProgressActivities: PropTypes.number,
  isError: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  failedActivities: PropTypes.number,
  runActivities: PropTypes.number,
  team: PropTypes.any,
  succeededActivities: PropTypes.number,
};

function ActivityHeader({
  inProgressActivities,
  isError,
  isLoading,
  runActivities,
  team,
  succeededActivities,
  failedActivities,
}) {
  const successRate = runActivities > 0 ? (succeededActivities + inProgressActivities) / runActivities : 0;
  const successRatePercentage = Math.round(successRate * 100);
  const emoji = successRatePercentage > 79 ? "🙌" : successRatePercentage > 49 ? "😮" : "😨";

  const NavigationComponent = () => {
    return (
      <Breadcrumb noTrailingSlash>
        <BreadcrumbItem>
          <Link to={appLink.home()}>Home</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <p>{team.displayName}</p>
        </BreadcrumbItem>
      </Breadcrumb>
    );
  };

  return (
    <Header
      className={styles.container}
      includeBorder={false}
      nav={<NavigationComponent />}
      header={
        <>
          <HeaderTitle>Activity</HeaderTitle>
          <HeaderSubtitle className={styles.headerMessage}>The place to view WorkflowRuns</HeaderSubtitle>
        </>
      }
      actions={
        <section className={styles.content}>
          {isLoading ? (
            <SkeletonPlaceholder className={styles.summarySkeleton} />
          ) : isError ? (
            <>
              <p className={styles.text}>Today's numbers</p>
              <HeaderWidget text="Runs" value={"--"} />
              <HeaderWidget text="In Progress" value={"--"} />
              <HeaderWidget text="Successes" value={"--"} />
              <HeaderWidget text="Failures" value={"--"} />
              <HeaderWidget text="Success rate" value={"--"} />
            </>
          ) : (
            <>
              <p className={styles.text}>Today's numbers</p>
              <HeaderWidget icon={ArrowUpRight} text="Runs" value={runActivities} />
              <HeaderWidget icon={ArrowUpRight} text="In Progress" value={inProgressActivities} />
              <HeaderWidget icon={ArrowUpRight} text="Successes" value={succeededActivities} />
              <HeaderWidget icon={ArrowDownRight} text="Failures" value={failedActivities} />
              <HeaderWidget icon={emoji} text="Success rate" value={`${successRatePercentage}%`} />
            </>
          )}
        </section>
      }
    />
  );
}

export default ActivityHeader;
