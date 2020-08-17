import React from "react";
import moment from "moment";
import { ModalBody } from "@boomerang-io/carbon-addons-boomerang-react";
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
    <ModalBody className={styles.container}>
      <hr className={styles.divider} />
      <QuotaSection
        description="Number of Workflows that can be created for this team."
        title="Number of Workflows"
        value={quotas.currentWorkflowCount}
        valueUnit="Workflows"
      >
        <ProgressBar maxValue={quotas.maxWorkflowCount} value={workflowLimitPercentage} />
        <p
          className={styles.currentUsage}
        >{`Current usage: ${quotas.currentWorkflowCount} of ${quotas.maxWorkflowCount}`}</p>
      </QuotaSection>
      <QuotaSection
        description="Number of executions per month across all Workflows"
        title="Total Workflow executions"
        value={quotas.maxWorkflowExecutionMonthly}
        valueUnit="per month"
      >
        <ProgressBar maxValue={quotas.maxWorkflowExecutionMonthly} value={monthlyExecutionPercentage} />
        <p
          className={styles.detailedText}
        >{`Current usage: ${quotas.currentWorkflowExecutionMonthly} of ${quotas.maxWorkflowExecutionMonthly}`}</p>
        <time className={styles.detailedText}>
          {`Resets on ${moment.utc(quotas.monthlyResetDate).format("MMMM DD, YYYY")}`}
        </time>
      </QuotaSection>
      <hr className={styles.divider} />
      <QuotaSection
        description="Persistent storage size limit per Workflow"
        title="Storage size capacity"
        value={quotas.maxWorkflowStorage}
        valueUnit="GB"
      ></QuotaSection>
      <QuotaSection
        title="Concurrent Workflows"
        description="Max number of Workflows able to run at the same time"
        value={quotas.maxConcurrentWorkflows}
        valueUnit="Workflows"
      />
    </ModalBody>
  );
}

interface QuotaSectionProps {
  description: string;
  title: string;
  value: number;
  valueUnit: string;
}

const QuotaSection: React.FC<QuotaSectionProps> = ({ children, description, title, value, valueUnit }) => {
  return (
    <section>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <data className={styles.sectionValue} value={value}>{`${value} ${valueUnit}`}</data>
      {children}
    </section>
  );
};

interface ProgressBarProps {
  value: number;
  maxValue: number;
  minValue?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ maxValue = 100, minValue = 0, value = 0 }) => {
  return (
    <div className={styles.coverageBar}>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={minValue}
        aria-valuemax={maxValue}
        className={styles.coverageFiller}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};
