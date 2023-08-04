//@ts-nocheck
import React from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { Tile, Button } from "@carbon/react";
import { TooltipHover, Loading, ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import { ComposedModalChildProps, ModalTriggerProps, FlowTeamQuotas, FlowTeam } from "Types";
import { Edit } from "@carbon/react/icons";
import ProgressBar from "Components/ProgressBar";
import RestoreDefaults from "./RestoreDefaults";
import QuotaEditModalContent from "./QuotaEditModalContent";
import EmptyState from "Components/EmptyState";
import { resolver, serviceUrl } from "Config/servicesConfig";
import styles from "./Quotas.module.scss";

function Quotas({ team, canEdit }: { team: FlowTeam; canEdit: boolean }) {
  // const teamQuotasUrl = serviceUrl.getTeamQuotas({ id: team.id });

  // const {
  //   data: teamQuotasData,
  //   teamQuotasIsError,
  //   teamQuotasIsLoading,
  // } = useQuery({
  //   queryKey: teamQuotasUrl,
  //   queryFn: resolver.query(teamQuotasUrl),
  // });

  const {
    data: defaultQuotasData,
    defaultQuotasError,
    defaultQuotasIsLoading,
  } = useQuery({
    queryKey: serviceUrl.getTeamQuotaDefaults(),
    queryFn: resolver.query(serviceUrl.getTeamQuotaDefaults()),
  });

  // if (teamQuotasIsError) {
  //   return (
  //     <EmptyState
  //       title="Team not found"
  //       message="Crikey. An error occurred in getting the Quotas you are looking for."
  //     />
  //   );
  // }
  // if (teamQuotasIsLoading) {
  //   return <Loading />;
  // }

  // if (teamQuotasData) {
  // console.log(teamQuotasData);
  let workflowLimitPercentage = (teamQuotasData.currentWorkflowCount / teamQuotasData.maxWorkflowCount) * 100;
  let monthlyExecutionPercentage = (teamQuotasData.currentRuns / teamQuotasData.maxWorkflowExecutionMonthly) * 100;

  if (workflowLimitPercentage > 100) workflowLimitPercentage = 100;
  if (monthlyExecutionPercentage > 100) monthlyExecutionPercentage = 100;

  const coverageBarStyle = { height: "1rem", width: "17.625rem" };

  return (
    <section aria-label={`${team.name} Team Quotas`} className={styles.container}>
      <Helmet>
        <title>{`Quotas - ${team.name}`}</title>
      </Helmet>
      <section className={styles.actionsContainer}>
        <div className={styles.leftActions}>
          <p className={styles.featureDescription}>These are the quotas that have been set for the team.</p>
        </div>
        <div className={styles.rightActions}>
          <RestoreDefaults
            defaultQuotasError={defaultQuotasError}
            defaultQuotasIsLoading={defaultQuotasIsLoading}
            defaultQuotasData={defaultQuotasData}
            selectedTeam={team}
            disabled={!canEdit}
          />
        </div>
      </section>
      <section className={styles.cardsSection}>
        <QuotaCard
          subtitle="Number of Workflows that can be created for this team."
          title="Number of Workflows"
          modalSubtitle="Set the maximum number of Workflows that can be created for this team."
          //   minValue={teamQuotasData.currentWorkflowCount}
          minValue={1}
          detailedTitle="Current Usage"
          detailedData={`${teamQuotasData.currentWorkflowCount}/${teamQuotasData.maxWorkflowCount}`}
          inputLabel="Maximum Workflows"
          inputUnits="Workflows"
          stepValue={1}
          teamId={team.id}
          quotaProperty="maxWorkflowCount"
          quotaValue={teamQuotasData.maxWorkflowCount}
          teamQuotasData={teamQuotasData}
          disabled={!canEdit}
        >
          <h3 className={styles.detailedHeading}> {`${teamQuotasData.maxWorkflowCount} Workflows`}</h3>
          <ProgressBar
            maxValue={teamQuotasData.maxWorkflowCount}
            value={workflowLimitPercentage}
            coverageBarStyle={coverageBarStyle}
          />
          <p className={styles.detailedSmallText}>{`Current usage: ${teamQuotasData.currentWorkflowCount}`}</p>
        </QuotaCard>
        <QuotaCard
          subtitle="Number of executions per month across all Workflows for this Team"
          title="Number of Executions"
          modalSubtitle="Set the maximum total number of executions per month - this is the total amount across all Workflows for this Team."
          //   minValue={teamQuotasData.currentWorkflowExecutionMonthly}
          minValue={1}
          detailedTitle="Current Usage"
          detailedData={`${teamQuotasData.currentWorkflowExecutionMonthly}/${teamQuotasData.maxWorkflowExecutionMonthly}`}
          inputLabel="Maximum executions"
          inputUnits="executions"
          stepValue={1}
          teamId={team.id}
          quotaProperty="maxWorkflowExecutionMonthly"
          quotaValue={teamQuotasData.maxWorkflowExecutionMonthly}
          teamQuotasData={teamQuotasData}
          disabled={!canEdit}
        >
          <h3 className={styles.detailedHeading}> {`${teamQuotasData.maxWorkflowExecutionMonthly} per month`}</h3>
          <ProgressBar
            maxValue={teamQuotasData.maxWorkflowExecutionMonthly}
            value={monthlyExecutionPercentage}
            coverageBarStyle={coverageBarStyle}
          />
          <p
            className={styles.detailedSmallText}
          >{`Current usage: ${teamQuotasData.currentWorkflowExecutionMonthly}`}</p>
        </QuotaCard>
        <QuotaCard
          subtitle="Storage type"
          title="Storage size capacity"
          modalSubtitle="Set the storage size limit for each Workflow using persistent storage on this Team."
          minValue={0}
          detailedTitle="Current Workflows with persistent storage"
          detailedData={`${teamQuotasData.currentWorkflowsPersistentStorage} Worklows`}
          inputLabel="Storage limit"
          inputUnits="GB"
          stepValue={1}
          teamId={team.id}
          quotaProperty="maxWorkflowStorage"
          quotaValue={teamQuotasData.maxWorkflowStorage}
          teamQuotasData={teamQuotasData}
          disabled={!canEdit}
        >
          <h5 className={styles.persistentStorage}>Persistent Storage</h5>
          <dt className={styles.subtitle}>Size limit</dt>
          <dd className={styles.detailedData}>{`${teamQuotasData.maxWorkflowStorage}GB per Workflow`}</dd>
        </QuotaCard>
        <QuotaCard
          subtitle="Maximum amount of time that a single Workflow can take for one execution."
          title="Execution time"
          modalSubtitle="Set the maximum amount of time that a single Workflow can take for one execution."
          minValue={0}
          detailedTitle="Current average execution time"
          detailedData={`${teamQuotasData.currentRunMedianDuration} minutes`}
          inputLabel="Maximum duration"
          inputUnits="minutes"
          stepValue={1}
          teamId={team.id}
          quotaProperty="maxWorkflowExecutionTime"
          quotaValue={teamQuotasData.maxWorkflowExecutionTime}
          teamQuotasData={teamQuotasData}
          disabled={!canEdit}
        >
          <h3 className={styles.detailedHeading}> {`${teamQuotasData.maxWorkflowExecutionTime} minutes`}</h3>
        </QuotaCard>
        <QuotaCard
          subtitle="Max number of Workflows able to run at the same time."
          title="Concurrent Workflows"
          modalSubtitle="Set the maximum number of Workflows that are able to run at the same time."
          minValue={1}
          detailedTitle="Current number of Concurrent Workflow Runs"
          detailedData={`${teamQuotasData.currentConcurrentRuns} Workflow Runs`}
          inputLabel="Maximum concurrent"
          inputUnits="Workflows"
          stepValue={1}
          teamId={team.id}
          quotaProperty="maxConcurrentWorkflows"
          quotaValue={teamQuotasData.maxConcurrentWorkflows}
          teamQuotasData={teamQuotasData}
          disabled={!canEdit}
        >
          <h3 className={styles.detailedHeading}> {`${teamQuotasData.maxConcurrentWorkflows} Workflows`}</h3>
        </QuotaCard>
      </section>
    </section>
  );
  // }
  // return null;
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
