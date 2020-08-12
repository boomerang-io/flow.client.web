//@ts-nocheck
import React from "react";

import { useParams } from "react-router-dom";
import { useMutation, useQuery, queryCache } from "react-query";
import {
  Tile,
  Button,
  Error404,
  notify,
  ToastNotification,
  TooltipHover,
  Loading,
  ComposedModal,
  InlineLoading,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { ComposedModalChildProps, ModalTriggerProps } from "Types";
import { Edit16 } from "@carbon/icons-react";

import Header from "../Header";
import QuotaEditModalContent from "./QuotaEditModalContent";
import { resolver, serviceUrl } from "Config/servicesConfig";
import styles from "./TeamQuotasOverview.module.scss";

export function TeamQuotasOverview({ teams }) {
  const params = useParams();
  const { teamId = "" } = params;
  const teamQuotasUrl = serviceUrl.getTeamQuotas({ id: teamId });

  const { data: teamQuotasData, error, isLoading } = useQuery({
    queryKey: teamQuotasUrl,
    queryFn: resolver.query(teamQuotasUrl),
  });

  const [defaultQuotasMutator, { isLoading: defaultIsLoading }] = useMutation(resolver.putTeamQuotasDefault, {
    onSuccess: () => queryCache.invalidateQueries(teamQuotasUrl),
  });

  const teamData = teams.find((team) => team.id === teamId);

  const handleRestoreDefaultQuota = () => {
    try {
      defaultQuotasMutator({ teamId });
      notify(
        <ToastNotification
          kind="success"
          title="Restore Default Quotas"
          subtitle="Successfully restored default quotas"
        />
      );
    } catch {
      notify(<ToastNotification kind="error" title="Something's wrong" subtitle="Failed to restore default quotas" />);
    }
  };

  if (error)
    return <Error404 header="Team not found" title="Crikey. We can't find the team you are looking for." message="" />;

  if (isLoading) {
    return <Loading />;
  }

  let workflowLimitPercentage = (teamQuotasData.currentWorkflowCount / teamQuotasData.maxWorkflowCount) * 100;
  let monthlyExecutionPercentage =
    (teamQuotasData.currentWorkflowExecutionMonthly / teamQuotasData.maxWorkflowExecutionMonthly) * 100;

  if (workflowLimitPercentage > 100) workflowLimitPercentage = 100;
  if (monthlyExecutionPercentage > 100) monthlyExecutionPercentage = 100;

  return (
    <div className={styles.container}>
      <Header handleRestoreDefaultQuota={handleRestoreDefaultQuota} selectedTeam={teamData} />
      <section className={styles.cardsSection}>
        <QuotaCard
          isLoading={defaultIsLoading}
          subtitle="Number of Workflows that can be created for this team."
          title="Number of Workflows"
          modalSubtitle="Set the maximum number of Workflows that can be created for this team."
          //   minValue={teamQuotasData.currentWorkflowCount}
          minValue={1}
          detailedTitle="Current Usage"
          detailedData={`${teamQuotasData.currentWorkflowCount}/${teamQuotasData.maxWorkflowCount}`}
          inputLabel="Maximum Workflows"
          stepValue={1}
          teamId={teamId}
          quotaProperty="maxWorkflowCount"
          quotaValue={teamQuotasData.maxWorkflowCount}
        >
          <h3 className={styles.detailedHeading}> {`${teamQuotasData.maxWorkflowCount} Workflows`}</h3>
          <div className={styles.coverageBar}>
            <div className={styles.coverageFiller} style={{ width: `${workflowLimitPercentage}%` }} />
          </div>
          <p className={styles.detailedSmallText}>{`Current usage: ${teamQuotasData.currentWorkflowCount}`}</p>
        </QuotaCard>

        <QuotaCard
          isLoading={defaultIsLoading}
          subtitle="Number of executions per month across all Workflows for this Team"
          title="Number of Executions"
          modalSubtitle="Set the maximum total number of executions per month - this is the total amount across all Workflows for this Team."
          //   minValue={teamQuotasData.currentWorkflowExecutionMonthly}
          minValue={1}
          detailedTitle="Current Usage"
          detailedData={`${teamQuotasData.currentWorkflowExecutionMonthly}/${teamQuotasData.maxWorkflowExecutionMonthly}`}
          inputLabel="Maximum executions"
          stepValue={1}
          teamId={teamId}
          quotaProperty="maxWorkflowExecutionMonthly"
          quotaValue={teamQuotasData.maxWorkflowExecutionMonthly}
        >
          <h3 className={styles.detailedHeading}> {`${teamQuotasData.maxWorkflowExecutionMonthly} per month`}</h3>
          <div className={styles.coverageBar}>
            <div className={styles.coverageFiller} style={{ width: `${monthlyExecutionPercentage}%` }} />
          </div>
          <p
            className={styles.detailedSmallText}
          >{`Current usage: ${teamQuotasData.currentWorkflowExecutionMonthly}`}</p>
        </QuotaCard>

        <QuotaCard
          isLoading={defaultIsLoading}
          subtitle="Storage type"
          title="Storage size capacity"
          modalSubtitle="Set the storage size limit for each Workflow using persistent storage on this Team."
          minValue={0}
          detailedTitle="Current Workflows with persistent storage"
          detailedData={`${teamQuotasData.currentWorkflowsPersistentStorage} Worklows`}
          inputLabel="Storage limit"
          inputUnits="GB"
          stepValue={1}
          teamId={teamId}
          quotaProperty="maxWorkflowStorage"
          quotaValue={teamQuotasData.maxWorkflowStorage}
        >
          <h5 className={styles.persistentStorage}>Persistent Storage</h5>
          <dt className={styles.subtitle}>Size limit</dt>
          <dd className={styles.detailedData}>{`${teamQuotasData.maxWorkflowStorage}GB per Workflow`}</dd>
        </QuotaCard>

        {/**
         * removed for now
         */}
        {/*<QuotaCard
          isLoading={defaultIsLoading}
          subtitle="Maximum amount of time that a single Workflow can take for one execution."
          title="Execution time"
          modalSubtitle="Set the maximum amount of time that a single Workflow can take for one execution."
          minValue={0}
          detailedTitle="Current average execution time"
          detailedData={`${teamQuotasData.currentAverageExecutionTime} minutes`}
          inputLabel="Maximum duration"
          inputUnits="minutes"
          stepValue={1}
          teamId={teamId}
          quotaProperty="maxWorkflowExecutionTime"
          quotaValue={teamQuotasData.maxWorkflowExecutionTime}
        >
          <h3 className={styles.detailedHeading}> {`${teamQuotasData.maxWorkflowExecutionTime} minutes`}</h3>
        </QuotaCard>*/}

        <QuotaCard
          isLoading={defaultIsLoading}
          subtitle="Max number of Workflows able to run at the same time."
          title="Concurrent Workflows"
          modalSubtitle="Set the maximum number of Workflows that are able to run at the same time."
          minValue={1}
          detailedTitle="Current number of Workflows"
          detailedData={`${teamQuotasData.currentWorkflowCount} Workflows`}
          inputLabel="Maximum concurrent"
          inputUnits="Workflows"
          stepValue={1}
          teamId={teamId}
          quotaProperty="maxConcurrentWorkflows"
          quotaValue={teamQuotasData.maxConcurrentWorkflows}
        >
          <h3 className={styles.detailedHeading}> {`${teamQuotasData.maxConcurrentWorkflows} Workflows`}</h3>
        </QuotaCard>
      </section>
    </div>
  );
}

interface QuotaCardProps {
  isLoading: boolean;
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

  minValue: number;
}

const QuotaCard: React.FC<QuotaCardProps> = ({
  children,
  isLoading,
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
  minValue,
}) => {
  return (
    <Tile className={styles.cardContainer}>
      <section className={styles.titleSection}>
        <h1 className={styles.title}>{title}</h1>
        {isLoading ? (
          <InlineLoading
            description={"Updating..."}
            style={{ position: "absolute", right: "0.5rem", top: "0", width: "fit-content" }}
          />
        ) : (
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
                  renderIcon={Edit16}
                  size="field"
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
              />
            )}
          </ComposedModal>
        )}
      </section>
      <h2 className={styles.subtitle}>{subtitle}</h2>
      <section>{children}</section>
    </Tile>
  );
};

export default TeamQuotasOverview;
