import React, { useState } from "react";
import axios from "axios";
import { useAppContext } from "Hooks";
import { useFeature } from "flagged";
import { useMutation, useQueryClient } from "react-query";
import { Link, useHistory } from "react-router-dom";
import {
  Button,
  ConfirmModal,
  ComposedModal,
  InlineLoading,
  OverflowMenu,
  OverflowMenuItem,
  ToastNotification,
  TooltipIcon,
  notify,
} from "@boomerang-io/carbon-addons-boomerang-react";
import WorkflowWarningButton from "Components/WorkflowWarningButton";
import UpdateWorkflow from "./UpdateWorkflow";
import WorkflowInputModalContent from "./WorkflowInputModalContent";
import WorkflowRunModalContent from "./WorkflowRunModalContent";
import cloneDeep from "lodash/cloneDeep";
import fileDownload from "js-file-download";
import { formatErrorMessage } from "@boomerang-io/utils";
import { appLink, FeatureFlag } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { BASE_URL } from "Config/servicesConfig";
import { Run20, Bee20 } from "@carbon/icons-react";
import workflowIcons from "Assets/workflowIcons";
import { ComposedModalChildProps, FlowTeamQuotas, ModalTriggerProps, WorkflowSummary } from "Types";
import { WorkflowScope } from "Constants";
import styles from "./workflowCard.module.scss";
// @ts-ignore:next-line
import { swapValue } from "Utils";

interface WorkflowCardProps {
  scope: string;
  teamId: string | null;
  quotas: FlowTeamQuotas | null;
  workflow: WorkflowSummary;
  canEditWorkflow: boolean;
}

type FunctionAnyReturn = () => any;

const WorkflowCard: React.FC<WorkflowCardProps> = ({ scope, teamId, quotas, workflow, canEditWorkflow }) => {
  const { teams } = useAppContext();
  const queryClient = useQueryClient();
  const type = scope === WorkflowScope.Template ? "Template" : "Workflow";
  const cancelRequestRef = React.useRef<FunctionAnyReturn | null>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateWorkflowModalOpen, setIsUpdateWorkflowModalOpen] = useState(false);
  const workflowQuotasEnabled = useFeature(FeatureFlag.WorkflowQuotasEnabled);
  const activityEnabled = useFeature(FeatureFlag.ActivityEnabled);

  const history = useHistory();
  const [errorMessage, seterrorMessage] = useState(null);

  const { mutateAsync: deleteWorkflowMutator, isLoading: isDeleting } = useMutation(resolver.deleteWorkflow, {});

  const { mutateAsync: executeWorkflowMutator, error: executeError, isLoading: isExecuting } = useMutation(
    (args: { id: string; properties: {} }) => {
      const { promise, cancel } = resolver.postExecuteWorkflow(args);
      cancelRequestRef.current = cancel;
      return promise;
    }
  );

  const { mutateAsync: duplicateWorkflowMutator, isLoading: duplicateWorkflowIsLoading } = useMutation(
    resolver.postDuplicateWorkflow
  );

  const isDuplicating = duplicateWorkflowIsLoading;

  /**
   * Format properties to be edited in form by Formik. It doesn't work with property notation :(
   * See: https://jaredpalmer.com/formik/docs/guides/arrays#nested-objects
   * This is safe to do because we don't accept "-" characters in property keys
   * @returns {Array}
   */
  const formatPropertiesForEdit = () => {
    const { properties = [] } = workflow;
    return properties.filter((property) => !property.readOnly);
  };

  const handleDeleteWorkflow = async () => {
    const workflowId = workflow.id;
    try {
      await deleteWorkflowMutator({ id: workflowId });
      notify(<ToastNotification kind="success" title={`Delete ${type}`} subtitle={`${type} successfully deleted`} />);
      if (scope === WorkflowScope.Team) {
        /**
         * teams query takes a while. optomistic update here
         */
        const specificTeam = teams.find((team) => team.id === teamId);
        const specificTeamIndex = teams.findIndex((team) => team.id === teamId);
        const newTeamWorkflows = specificTeam?.workflows.filter((workflow) => workflow.id !== workflowId);
        // @ts-ignore
        teams[specificTeamIndex].workflows = newTeamWorkflows;
        queryClient.setQueryData(serviceUrl.getTeams(), teams);
        queryClient.invalidateQueries(serviceUrl.getTeams());
      } else if (scope === WorkflowScope.System) {
        queryClient.invalidateQueries(serviceUrl.getSystemWorkflows());
      } else if (scope === WorkflowScope.Template) {
        queryClient.invalidateQueries(serviceUrl.workflowTemplates());
      } else {
        queryClient.invalidateQueries(serviceUrl.getUserWorkflows());
      }
    } catch {
      notify(
        <ToastNotification
          kind="error"
          title="Something's Wrong"
          subtitle={`Request to delete ${type.toLowerCase()} failed`}
        />
      );
    }
  };

  const handleDuplicateWorkflow = async (workflow: WorkflowSummary) => {
    try {
      await duplicateWorkflowMutator({ workflowId: workflow.id });
      notify(
        <ToastNotification
          kind="success"
          title={`Duplicate ${type}`}
          subtitle={`Successfully duplicated ${type.toLowerCase()}`}
        />
      );
      if (scope === WorkflowScope.System) {
        queryClient.invalidateQueries(serviceUrl.getSystemWorkflows());
      } else if (scope === WorkflowScope.Team) {
        queryClient.invalidateQueries(serviceUrl.getTeams());
      } else if (scope === WorkflowScope.Template) {
        queryClient.invalidateQueries(serviceUrl.workflowTemplates());
      } else {
        queryClient.invalidateQueries(serviceUrl.getUserWorkflows());
      }
      return;
    } catch (e) {
      notify(
        <ToastNotification
          kind="error"
          title="Something's Wrong"
          subtitle={`Request to duplicate ${type.toLowerCase()} failed`}
        />
      );
      return;
    }
  };

  const handleExportWorkflow = (workflow: WorkflowSummary) => {
    notify(<ToastNotification kind="info" title={`Export ${type}`} subtitle="Export starting soon" />);
    axios
      .get(`${BASE_URL}/workflow/export/${workflow.id}`)
      .then(({ data }) => {
        fileDownload(JSON.stringify(data, null, 4), `${workflow.name}.json`);
      })
      .catch((error) => {
        notify(
          <ToastNotification kind="error" title="Something's Wrong" subtitle={`Export ${type.toLowerCase()} failed`} />
        );
      });
  };

  const handleExecuteWorkflow = async (closeModal: () => void, redirect: boolean = false, properties: {} = {}) => {
    const { id: workflowId } = workflow;
    let newProperties = properties;
    if (Object.values(properties).includes("")) {
      newProperties = cloneDeep(properties);
      swapValue(newProperties);
    }
    try {
      // @ts-ignore:next-line
      const { data: execution } = await executeWorkflowMutator({ id: workflowId, properties: newProperties });
      notify(
        <ToastNotification
          kind="success"
          title={`Run ${type}`}
          subtitle={`Successfully started ${type.toLowerCase()} execution`}
        />
      );
      if (redirect) {
        history.push({
          pathname: appLink.execution({ executionId: execution.id, workflowId }),
          state: { fromUrl: appLink.workflows(), fromText: `${type}s` },
        });
      } else {
        if (scope === WorkflowScope.System) {
          queryClient.invalidateQueries(serviceUrl.getSystemWorkflows());
        } else if (scope === WorkflowScope.Team) {
          queryClient.invalidateQueries(serviceUrl.getTeams());
        } else {
          queryClient.invalidateQueries(serviceUrl.getUserWorkflows());
        }
        closeModal();
      }
    } catch (err) {
      seterrorMessage(
        formatErrorMessage({
          error: err,
          defaultMessage: "Run Workflow Failed",
        })
      );
      //no-op
    }
  };

  let menuOptions = [
    {
      itemText: "Edit",
      onClick: () => history.push(appLink.editorDesigner({ workflowId: workflow.id })),
    },
    // {
    //   itemText: "View Activity",
    //   onClick: () => history.push(appLink.workflowActivity({ workflowId: workflow.id })),
    // },
    {
      itemText: "Update",
      onClick: () => setIsUpdateWorkflowModalOpen(true),
    },
    {
      itemText: "Export",
      onClick: () => handleExportWorkflow(workflow),
    },
    {
      itemText: "Duplicate",
      onClick: () => handleDuplicateWorkflow(workflow),
    },
    {
      hasDivider: true,
      itemText: "Delete",
      isDelete: true,
      onClick: () => setIsDeleteModalOpen(true),
    },
  ];

  if (!activityEnabled) {
    menuOptions = menuOptions.filter((el) => el.itemText !== "View Activity");
  }

  const formattedProperties = formatPropertiesForEdit();

  const { name, Icon = Bee20 } = workflowIcons.find((icon) => icon.name === workflow.icon) ?? {};

  let hasReachedMonthlyRunLimit = false;

  if (quotas) {
    hasReachedMonthlyRunLimit = quotas?.maxWorkflowExecutionMonthly <= quotas?.currentWorkflowExecutionMonthly;
  }

  const canRunManually = workflow?.triggers?.manual?.enable ?? false;

  const isDisabled = workflowQuotasEnabled && (hasReachedMonthlyRunLimit || !canRunManually);

  let loadingText = "";

  if (isExecuting) {
    loadingText = "Executing...";
  } else if (isDuplicating) {
    loadingText = "Duplicating...";
  } else if (isDeleting) {
    loadingText = "Deleting...";
  }

  return (
    <div className={styles.container}>
      <Link to={!isDeleting ? appLink.editorDesigner({ workflowId: workflow.id }) : ""}>
        <section className={styles.details}>
          <div className={styles.iconContainer}>
            <Icon className={styles.icon} alt={`${name}`} />
          </div>
          <div className={styles.descriptionContainer}>
            <h1 title={workflow.name} className={styles.name} data-testid="workflow-card-title">
              {workflow.name}
            </h1>
            <p title={workflow.shortDescription} className={styles.description}>
              {workflow.shortDescription}
            </p>
          </div>
        </section>
      </Link>
      {/*<div className={styles.quotaDescriptionContainer}>
        <h3
          className={styles.teamQuotaText}
        >{`Run quota - ${quotas.currentWorkflowExecutionMonthly} of ${quotas.maxWorkflowExecutionMonthly} this month`}</h3>
        {hasReachedMonthlyRunLimit && (
          <TooltipHover
            direction="top"
            tooltipText="This Workflow has reached the maximum number of executions allowed this month. Contact your Team administrator/owner to increase the quota, or wait until the quota resets next month."
          >
            <WarningAlt16 className={styles.warningIcon} />
          </TooltipHover>
        )}
        </div>*/}
      <section className={styles.launch}>
        {Array.isArray(formattedProperties) && formattedProperties.length !== 0 ? (
          <ComposedModal
            modalHeaderProps={{
              title: `${type} Parameters`,
              subtitle: `Provide parameter values for your ${type.toLowerCase()}`,
            }}
            modalTrigger={({ openModal }: ModalTriggerProps) => (
              <Button
                disabled={isDeleting || isDisabled}
                iconDescription={`Run ${type}`}
                renderIcon={Run20}
                size="field"
                onClick={openModal}
              >
                Run it
              </Button>
            )}
            onCloseModal={() => {
              if (cancelRequestRef.current) cancelRequestRef.current();
            }}
          >
            {({ closeModal }: ComposedModalChildProps) => (
              <WorkflowInputModalContent
                closeModal={closeModal}
                executeError={executeError}
                executeWorkflow={handleExecuteWorkflow}
                isExecuting={isExecuting}
                /* @ts-ignore-next-line */
                inputs={formattedProperties}
              />
            )}
          </ComposedModal>
        ) : (
          <ComposedModal
            composedModalProps={{ containerClassName: `${styles.executeWorkflow}` }}
            modalHeaderProps={{
              title: `Execute ${type}`,
              subtitle: `"Run and View" will navigate you to the ${type.toLowerCase()} exeuction view.`,
            }}
            modalTrigger={({ openModal }: ModalTriggerProps) => (
              <Button
                disabled={isDeleting || isDisabled}
                iconDescription={`Run ${type}`}
                renderIcon={Run20}
                size="field"
                onClick={openModal}
              >
                Run it
              </Button>
            )}
          >
            {({ closeModal }: ComposedModalChildProps) => (
              <WorkflowRunModalContent
                closeModal={closeModal}
                executeError={executeError}
                executeWorkflow={handleExecuteWorkflow}
                isExecuting={isExecuting}
                errorMessage={errorMessage}
              />
            )}
          </ComposedModal>
        )}
      </section>
      {workflow.templateUpgradesAvailable && (
        <div className={styles.templatesWarningIcon}>
          <TooltipIcon
            direction="top"
            tooltipText={`New version of a task available! To update, edit your ${type.toLowerCase()}.`}
          >
            {canEditWorkflow && <WorkflowWarningButton />}
          </TooltipIcon>
        </div>
      )}

      {canEditWorkflow &&
        (isDuplicating || isDeleting || isExecuting ? (
          <InlineLoading
            description={loadingText}
            style={{ position: "absolute", right: "0.5rem", top: "0", width: "fit-content" }}
          />
        ) : (
          <OverflowMenu
            flipped
            ariaLabel="Overflow card menu"
            iconDescription="Overflow menu icon"
            style={{ position: "absolute", right: "0" }}
          >
            {menuOptions.map(({ onClick, itemText, ...rest }, index) => (
              <OverflowMenuItem onClick={onClick} itemText={itemText} key={`${itemText}-${index}`} {...rest} />
            ))}
          </OverflowMenu>
        ))}
      {isUpdateWorkflowModalOpen && (
        <UpdateWorkflow
          onCloseModal={() => setIsUpdateWorkflowModalOpen(false)}
          teamId={teamId}
          workflowId={workflow.id}
          scope={scope}
          type={type}
        />
      )}
      {isDeleteModalOpen && (
        <ConfirmModal
          affirmativeAction={handleDeleteWorkflow}
          affirmativeButtonProps={{ kind: "danger" }}
          affirmativeText="Delete"
          isOpen={isDeleteModalOpen}
          negativeAction={() => {
            setIsDeleteModalOpen(false);
          }}
          negativeText="Cancel"
          onCloseModal={() => {
            setIsDeleteModalOpen(false);
          }}
          title={`Delete ${type}`}
        >
          {`Are you sure you want to delete this ${type.toLowerCase()}? There's no going back from this decision.`}
        </ConfirmModal>
      )}
    </div>
  );
};

export default WorkflowCard;
