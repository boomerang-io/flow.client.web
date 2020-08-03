import React from "react";
import { FlowTeamSettings } from "Types";
import styles from "./WorkflowQuotaModalContent.module.scss";

export default function WorkflowQuotaModalContent({
  closeModal,
  settings,
}: {
  closeModal: () => void;
  settings: FlowTeamSettings;
}) {
  const { quotas } = settings;

  const workflowLimitPercentage = (quotas.currentWorkflows / quotas.availableWorkflows) * 100;
  const monthlyExecutionPercentage = (quotas.currentMonthlyExecutions / quotas.availableMonthlyExecutions) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.divider} />
      <section className={styles.detailedSection}>
        <div className={styles.detailedContainer}>
          <dt className={styles.detailedTitle}>Number of Workflows</dt>
          <dd className={styles.detailedData}>Number of Workflows that can be created for this team.</dd>
          <h2 className={styles.sectionHeader}>{`${quotas.availableWorkflows} Workflows`}</h2>
          <div className={styles.coverageBar}>
            <div className={styles.coverageFiller} style={{ width: `${workflowLimitPercentage}%` }} />
          </div>
          <p
            className={styles.currentUsage}
          >{`Current usage: ${quotas.currentWorkflows} of ${quotas.availableWorkflows}`}</p>
        </div>

        <div className={styles.detailedContainer}>
          <dt className={styles.detailedTitle}>Total Workflow executions</dt>
          <dd className={styles.detailedData}>Number of executions per month across all Workflows</dd>
          <h2 className={styles.sectionHeader}>{`${quotas.availableMonthlyExecutions} per month`}</h2>
          <div className={styles.coverageBar}>
            <div className={styles.coverageFiller} style={{ width: `${monthlyExecutionPercentage}%` }} />
          </div>
          <p
            className={styles.detailedText}
          >{`Current usage: ${quotas.currentMonthlyExecutions} of ${quotas.availableMonthlyExecutions}`}</p>
          <p className={styles.detailedText}>{`Resets on ${quotas.monthlyResetDate}`}</p>
        </div>
      </section>
      <div className={styles.divider} />

      <section className={styles.detailedSection}>
        <div className={styles.detailedContainer}>
          <dt className={styles.detailedTitle}>Storage size capacity </dt>
          <dd className={styles.detailedData}>Persistent storage size limit per Workflow</dd>
          <h2 className={styles.sectionHeader}>{`${quotas.storageCapacity} GB`}</h2>
        </div>
        <div className={styles.detailedContainer}>
          <dt className={styles.detailedTitle}>Max Workflow execution time </dt>
          <dd className={styles.detailedData}>
            Maximum amount of time that a single Workflow can take for one execution
          </dd>
          <h2 className={styles.sectionHeader}>{`${quotas.maxExecutionTime} minutes`}</h2>
        </div>
        <div className={styles.detailedContainer}>
          <dt className={styles.detailedTitle}>Concurrent Workflows </dt>
          <dd className={styles.detailedData}>Max number of Workflows able to run at the same time</dd>
          <h2 className={styles.sectionHeader}>{`${quotas.concurrentWorkflows} Workflows`}</h2>
        </div>
      </section>
    </div>
  );
}
