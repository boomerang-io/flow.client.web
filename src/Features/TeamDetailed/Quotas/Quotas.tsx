//@ts-nocheck
import React from "react";
import { Helmet } from "react-helmet";
import { Tile, Button, InlineNotification } from "@carbon/react";
import { TooltipHover, ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import { ComposedModalChildProps, ModalTriggerProps, FlowTeamQuotas, FlowTeam } from "Types";
import { Edit } from "@carbon/react/icons";
import ProgressBar from "Components/ProgressBar";
import RestoreDefaults from "./RestoreDefaults";
import QuotaEditModalContent from "./QuotaEditModalContent";
import { resolver, serviceUrl } from "Config/servicesConfig";
import styles from "./Quotas.module.scss";

function Quotas({ team, canEdit, teamDetailsUrl }: { team: FlowTeam; canEdit: boolean; teamDetailsUrl: string }) {
  let workflowLimitPercentage = (team.quotas.currentWorkflowCount / team.quotas.maxWorkflowCount) * 100;
  let monthlyExecutionPercentage = (team.quotas.currentRuns / team.quotas.maxWorkflowExecutionMonthly) * 100;

  if (workflowLimitPercentage > 100) workflowLimitPercentage = 100;
  if (monthlyExecutionPercentage > 100) monthlyExecutionPercentage = 100;

  const coverageBarStyle = { height: "1rem", width: "17.625rem" };

  return (
    <section aria-label={`${team.name} Team Quotas`} className={styles.container}>
      <Helmet>
        <title>{`Quotas - ${team.name}`}</title>
      </Helmet>
      {!canEdit ? (
        <section className={styles.notificationsContainer}>
          <InlineNotification
            lowContrast
            hideCloseButton={true}
            kind="info"
            title="Read-only"
            subtitle="You don’t have permission to change these Quotas, but you can still see what’s going on behind the
            scenes."
          />
        </section>
      ) : null}
      <section className={styles.actionsContainer}>
        <div className={styles.leftActions}>
          <p className={styles.featureDescription}>
            The following quotas have been set for the team - only Admins have access to adjust these.
          </p>
        </div>
        <div className={styles.rightActions}>
          <RestoreDefaults team={team} disabled={!canEdit} />
        </div>
      </section>
      <section className={styles.cardsSection}>
        <QuotaCard
          subtitle="Number of Workflows that can be created for this team."
          title="Number of Workflows"
          modalSubtitle="Set the maximum number of Workflows that can be created for this team."
          //   minValue={team.quotas.currentWorkflowCount}
          minValue={1}
          detailedTitle="Current Usage"
          detailedData={`${team.quotas.currentWorkflowCount}/${team.quotas.maxWorkflowCount}`}
          inputLabel="Maximum Workflows"
          inputUnits="Workflows"
          stepValue={1}
          teamId={team.id}
          quotaProperty="maxWorkflowCount"
          quotaValue={team.quotas.maxWorkflowCount}
          teamQuotas={team.quotas}
          disabled={!canEdit}
          teamDetailsUrl={teamDetailsUrl}
        >
          <h3 className={styles.detailedHeading}> {`${team.quotas.maxWorkflowCount} Workflows`}</h3>
          <ProgressBar
            maxValue={team.quotas.maxWorkflowCount}
            value={workflowLimitPercentage}
            coverageBarStyle={coverageBarStyle}
          />
          <p className={styles.detailedSmallText}>{`Current usage: ${team.quotas.currentWorkflowCount}`}</p>
        </QuotaCard>
        <QuotaCard
          subtitle="Number of executions per month across all Workflows for this Team"
          title="Number of Executions"
          modalSubtitle="Set the maximum total number of executions per month - this is the total amount across all Workflows for this Team."
          //   minValue={team.quotas.currentWorkflowExecutionMonthly}
          minValue={1}
          detailedTitle="Current Usage"
          detailedData={`${team.quotas.currentWorkflowExecutionMonthly}/${team.quotas.maxWorkflowExecutionMonthly}`}
          inputLabel="Maximum executions"
          inputUnits="executions"
          stepValue={1}
          teamId={team.id}
          quotaProperty="maxWorkflowExecutionMonthly"
          quotaValue={team.quotas.maxWorkflowExecutionMonthly}
          teamQuotasData={team.quotas}
          disabled={!canEdit}
          teamDetailsUrl={teamDetailsUrl}
        >
          <h3 className={styles.detailedHeading}> {`${team.quotas.maxWorkflowExecutionMonthly} per month`}</h3>
          <ProgressBar
            maxValue={team.quotas.maxWorkflowExecutionMonthly}
            value={monthlyExecutionPercentage}
            coverageBarStyle={coverageBarStyle}
          />
          <p className={styles.detailedSmallText}>{`Current usage: ${team.quotas.currentWorkflowExecutionMonthly}`}</p>
        </QuotaCard>
        <QuotaCard
          subtitle="Storage type"
          title="Storage size capacity"
          modalSubtitle="Set the storage size limit for each Workflow using persistent storage on this Team."
          minValue={0}
          detailedTitle="Current Workflows with persistent storage"
          detailedData={`${team.quotas.currentWorkflowsPersistentStorage} Worklows`}
          inputLabel="Storage limit"
          inputUnits="GB"
          stepValue={1}
          teamId={team.id}
          quotaProperty="maxWorkflowStorage"
          quotaValue={team.quotas.maxWorkflowStorage}
          teamQuotasData={team.quotas}
          disabled={!canEdit}
          teamDetailsUrl={teamDetailsUrl}
        >
          <h5 className={styles.persistentStorage}>Persistent Storage</h5>
          <dt className={styles.subtitle}>Size limit</dt>
          <dd className={styles.detailedData}>{`${team.quotas.maxWorkflowStorage}GB per Workflow`}</dd>
        </QuotaCard>
        <QuotaCard
          subtitle="Maximum amount of time that a single Workflow can take for one execution."
          title="Execution time"
          modalSubtitle="Set the maximum amount of time that a single Workflow can take for one execution."
          minValue={0}
          detailedTitle="Current average execution time"
          detailedData={`${team.quotas.currentRunMedianDuration} minutes`}
          inputLabel="Maximum duration"
          inputUnits="minutes"
          stepValue={1}
          teamId={team.id}
          quotaProperty="maxWorkflowExecutionTime"
          quotaValue={team.quotas.maxWorkflowExecutionTime}
          teamQuotasData={team.quotas}
          disabled={!canEdit}
          teamDetailsUrl={teamDetailsUrl}
        >
          <h3 className={styles.detailedHeading}> {`${team.quotas.maxWorkflowExecutionTime} minutes`}</h3>
        </QuotaCard>
        <QuotaCard
          subtitle="Max number of Workflows able to run at the same time."
          title="Concurrent Workflows"
          modalSubtitle="Set the maximum number of Workflows that are able to run at the same time."
          minValue={1}
          detailedTitle="Current number of Concurrent Workflow Runs"
          detailedData={`${team.quotas.currentConcurrentRuns} Workflow Runs`}
          inputLabel="Maximum concurrent"
          inputUnits="Workflows"
          stepValue={1}
          teamId={team.id}
          quotaProperty="maxConcurrentWorkflows"
          quotaValue={team.quotas.maxConcurrentWorkflows}
          teamQuotasData={team.quotas}
          disabled={!canEdit}
          teamDetailsUrl={teamDetailsUrl}
        >
          <h3 className={styles.detailedHeading}> {`${team.quotas.maxConcurrentWorkflows} Workflows`}</h3>
        </QuotaCard>
      </section>
    </section>
  );
}

interface QuotaCardProps {
  subtitle: boolean;
  title: string;
  modalSubtitle: string;
  detailedData: string;
  detailedTitle: string;
  inputLabel: string;
  inputUnits: string;
  stepValue: number;
  teamId: string;
  quotaProperty: string;
  quotaValue: number;
  disabled: boolean;
  minValue: number;
  teamQuotasData: FlowTeamQuotas;
  teamDetailsUrl: string;
}

const QuotaCard: React.FC<QuotaCardProps> = ({
  children,
  subtitle,
  title,
  modalSubtitle,
  detailedData,
  detailedTitle,
  inputLabel,
  inputUnits,
  stepValue,
  teamId,
  quotaProperty,
  quotaValue,
  disabled,
  minValue,
  teamQuotasData,
  teamDetailsUrl,
}) => {
  return (
    <Tile className={styles.cardContainer}>
      <section className={styles.titleSection}>
        <h1 className={styles.title}>{title}</h1>
        <ComposedModal
          composedModalProps={{
            containerClassName: styles.modalContainer,
          }}
          modalHeaderProps={{
            title: title,
            subtitle: modalSubtitle,
          }}
          modalTrigger={({ openModal }: ModalTriggerProps) => (
            <TooltipHover direction="top" content={"Edit"}>
              <Button
                className={styles.editButton}
                iconDescription="Edit"
                kind="ghost"
                onClick={openModal}
                renderIcon={Edit}
                size="md"
                disabled={disabled}
              />
            </TooltipHover>
          )}
        >
          {({ closeModal }: ComposedModalChildProps) => (
            <QuotaEditModalContent
              closeModal={closeModal}
              detailedData={detailedData}
              detailedTitle={detailedTitle}
              inputLabel={inputLabel}
              inputUnits={inputUnits}
              stepValue={stepValue}
              teamId={teamId}
              quotaProperty={quotaProperty}
              quotaValue={quotaValue}
              minValue={minValue}
              teamQuotasData={teamQuotasData}
              teamDetailsUrl={teamDetailsUrl}
            />
          )}
        </ComposedModal>
      </section>
      <h2 className={styles.subtitle}>{subtitle}</h2>
      <section>{children}</section>
    </Tile>
  );
};

export default Quotas;
