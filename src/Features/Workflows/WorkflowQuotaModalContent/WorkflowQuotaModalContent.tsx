import React from "react";
import moment from "moment";
import { FlowTeamQuotas } from "Types";
import styles from "./WorkflowQuotaModalContent.module.scss";

export default function WorkflowQuotaModalContent({
  closeModal,
  quotas,
}: {
  closeModal: () => void;
  quotas: FlowTeamQuotas;
}) {
  let workflowLimitPercentage = (quotas.currentWorkflowCount / quotas.maxWorkflowCount) * 100;
  let monthlyExecutionPercentage = (quotas.currentWorkflowExecutionMonthly / quotas.maxWorkflowExecutionMonthly) * 100;

  if (workflowLimitPercentage > 100) workflowLimitPercentage = 100;
  if (monthlyExecutionPercentage > 100) monthlyExecutionPercentage = 100;

  return (
    <div className={styles.container}>
      <div className={styles.divider} />
      <section className={styles.detailedSection}>
        <div className={styles.detailedContainer}>
          <dt className={styles.detailedTitle}>Number of Workflows</dt>
          <dd className={styles.detailedData}>Number of Workflows that can be created for this team.</dd>
          <h2 className={styles.sectionHeader}>{`${quotas.currentWorkflowCount} Workflows`}</h2>
          <div className={styles.coverageBar}>
            <div className={styles.coverageFiller} style={{ width: `${workflowLimitPercentage}%` }} />
          </div>
          <p
            className={styles.currentUsage}
          >{`Current usage: ${quotas.currentWorkflowCount} of ${quotas.maxWorkflowCount}`}</p>
        </div>

        <div className={styles.detailedContainer}>
          <dt className={styles.detailedTitle}>Total Workflow executions</dt>
          <dd className={styles.detailedData}>Number of executions per month across all Workflows</dd>
          <h2 className={styles.sectionHeader}>{`${quotas.maxWorkflowExecutionMonthly} per month`}</h2>
          <div className={styles.coverageBar}>
            <div className={styles.coverageFiller} style={{ width: `${monthlyExecutionPercentage}%` }} />
          </div>
          <p
            className={styles.detailedText}
          >{`Current usage: ${quotas.currentWorkflowExecutionMonthly} of ${quotas.maxWorkflowExecutionMonthly}`}</p>
          <p className={styles.detailedText}>{`Resets on ${moment
            .utc(quotas.monthlyResetDate)
            .format("MMMM DD, YYYY")}`}</p>
        </div>
      </section>
      <div className={styles.divider} />

      <section className={styles.detailedSection}>
        <div className={styles.detailedContainer}>
          <dt className={styles.detailedTitle}>Storage size capacity </dt>
          <dd className={styles.detailedData}>Persistent storage size limit per Workflow</dd>
          <h2 className={styles.sectionHeader}>{`${quotas.maxWorkflowStorage} GB`}</h2>
        </div>
        {/*<div className={styles.detailedContainer}>
          <dt className={styles.detailedTitle}>Max Workflow execution time </dt>
          <dd className={styles.detailedData}>
            Maximum amount of time that a single Workflow can take for one execution
          </dd>
          <h2 className={styles.sectionHeader}>{`${quotas.maxWorkflowExecutionTime} minutes`}</h2>
  </div>*/}
        <div className={styles.detailedContainer}>
          <dt className={styles.detailedTitle}>Concurrent Workflows </dt>
          <dd className={styles.detailedData}>Max number of Workflows able to run at the same time</dd>
          <h2 className={styles.sectionHeader}>{`${quotas.maxConcurrentWorkflows} Workflows`}</h2>
        </div>
      </section>
    </div>
  );
}
