import {
  ConfirmModal,
  ComposedModal,
  ToastNotification,
  notify,
  TooltipHover,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { Button, InlineLoading, OverflowMenu, OverflowMenuItem } from "@carbon/react";
import { Run, Bee, CircleFill, InformationFilled } from "@carbon/react/icons";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Link, useHistory } from "react-router-dom";
import { formatErrorMessage } from "@boomerang-io/utils";
import workflowIcons from "Assets/workflowIcons";
import axios from "axios";
import { useFeature } from "flagged";
import fileDownload from "js-file-download";
import cloneDeep from "lodash/cloneDeep";
import WorkflowWarningButton from "Components/WorkflowWarningButton";
// @ts-ignore:next-line
import { swapValue } from "Utils";
import UpdateWorkflow from "./UpdateWorkflow";
import WorkflowInputModalContent from "./WorkflowInputModalContent";
import WorkflowRunModalContent from "./WorkflowRunModalContent";
import styles from "./workflowCard.module.scss";
import { appLink, FeatureFlag } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { BASE_URL } from "Config/servicesConfig";
import { WorkflowView } from "Constants";
import { FlowTeamQuotas, ModalTriggerProps, Workflow, WorkflowViewType, DataDrivenInput } from "Types";

interface WorkflowCardProps {
  teamName: string;
  quotas: FlowTeamQuotas | null;
  workflow: Workflow;
  viewType: WorkflowViewType;
  getWorkflowsUrl: string;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({ teamName, quotas, workflow, viewType, getWorkflowsUrl }) => {
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateWorkflowModalOpen, setIsUpdateWorkflowModalOpen] = useState(false);
  const workflowQuotasEnabled = useFeature(FeatureFlag.WorkflowQuotasEnabled);
  const activityEnabled = useFeature(FeatureFlag.ActivityEnabled);

  const history = useHistory();
  const [errorMessage, seterrorMessage] = useState(null);

  const { mutateAsync: deleteWorkflowMutator, isLoading: isDeleting } = useMutation(resolver.deleteWorkflow, {});

  const {
    mutateAsync: executeWorkflowMutator,
    error: executeError,
    isLoading: isExecuting,
  } = useMutation(resolver.postSubmitWorkflow);

  const { mutateAsync: duplicateWorkflowMutator, isLoading: duplicateWorkflowIsLoading } = useMutation(
    resolver.postDuplicateWorkflow,
  );

  const isDuplicating = duplicateWorkflowIsLoading;

  /**
   * Format properties to be edited in form by Formik. It doesn't work with property notation :(
   * See: https://jaredpalmer.com/formik/docs/guides/arrays#nested-objects
   * This is safe to do because we don't accept "-" characters in property keys
   * @returns {Array}
   */
  const formatPropertiesForEdit = () => {
    const { config = [] } = workflow;
    return config.filter((configParam: DataDrivenInput) => !configParam.readOnly);
  };

  const handleDeleteWorkflow = async () => {
    const workflowId = workflow.id;
    try {
      await deleteWorkflowMutator({ id: workflowId });
      notify(
        <ToastNotification kind="success" title={`Delete ${viewType}`} subtitle={`${viewType} successfully deleted`} />,
      );
      if (viewType === WorkflowView.Template) {
        queryClient.invalidateQueries(serviceUrl.getWorkflowTemplates());
      } else {
        queryClient.invalidateQueries(getWorkflowsUrl);
      }
    } catch {
      notify(
        <ToastNotification
          kind="error"
          title="Something's Wrong"
          subtitle={`Request to delete ${viewType.toLowerCase()} failed`}
        />,
      );
    }
  };

  const handleDuplicateWorkflow = async (workflow: Workflow) => {
    try {
      await duplicateWorkflowMutator({ workflowId: workflow.id });
      notify(
        <ToastNotification
          kind="success"
          title={`Duplicate ${viewType}`}
          subtitle={`Successfully duplicated ${viewType.toLowerCase()}`}
        />,
      );
      if (viewType === WorkflowView.Template) {
        queryClient.invalidateQueries(serviceUrl.getWorkflowTemplates());
      } else {
        queryClient.invalidateQueries(getWorkflowsUrl);
      }
      return;
    } catch (e) {
      notify(
        <ToastNotification
          kind="error"
          title="Something's Wrong"
          subtitle={`Request to duplicate ${viewType.toLowerCase()} failed`}
        />,
      );
      return;
    }
  };

  const handleExportWorkflow = (workflow: Workflow) => {
    notify(<ToastNotification kind="info" title={`Export ${viewType}`} subtitle="Export starting soon" />);
    axios
      .get(`${BASE_URL}/workflow/${workflow.id}/export`)
      .then(({ data }) => {
        fileDownload(JSON.stringify(data, null, 4), `${workflow.name}.json`);
      })
      .catch((error) => {
        notify(
          <ToastNotification
            kind="error"
            title="Something's Wrong"
            subtitle={`Export ${viewType.toLowerCase()} failed`}
          />,
        );
      });
  };

  /*
   * This function is used to handle the execution of a workflow. It only needs to work for WorkflowView.Workflow as Templates cant be executed
   */
  const handleExecuteWorkflow = async (closeModal: () => void, redirect: boolean = false, properties: {} = {}) => {
    const { id: workflowId } = workflow;
    let newProperties = properties;
    if (Object.values(properties).includes("")) {
      newProperties = cloneDeep(properties);
      swapValue(newProperties);
    }
    const params = Object.entries(newProperties).map(([name, value]) => ({ name, value }));
    const body = { params: params, trigger: "manual" };
    console.log(body);
    try {
      // @ts-ignore:next-line
      const { data: execution } = await executeWorkflowMutator({
        workflowId: workflowId,
        body: body,
      });
      notify(
        <ToastNotification
          kind="success"
          title={`Run ${viewType}`}
          subtitle={`Successfully started ${viewType.toLowerCase()} execution`}
        />,
      );
      if (redirect) {
        history.push({
          pathname: appLink.execution({ team: teamName, runId: execution.id, workflowId }),
          state: { fromUrl: appLink.workflows({ team: teamName }), fromText: `${viewType}s` },
        });
      } else {
        queryClient.invalidateQueries(getWorkflowsUrl);
        closeModal();
      }
    } catch (err) {
      seterrorMessage(
        formatErrorMessage({
          error: err,
          defaultMessage: "Run Workflow Failed",
        }),
      );
      //no-op
    }
  };

  let menuOptions = [
    {
      itemText: "Edit",
      onClick: () => history.push(appLink.editorCanvas({ team: teamName, workflowId: workflow.id })),
    },
    {
      itemText: "View Activity",
      onClick: () => history.push(appLink.workflowActivity({ team: teamName, workflowId: workflow.id })),
    },
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
  const { name, Icon = Bee } = workflowIcons.find((icon) => icon.name === workflow.icon) ?? {};
  let hasReachedMonthlyRunLimit = false;

  if (quotas) {
    hasReachedMonthlyRunLimit = quotas?.maxWorkflowRunMonthly <= quotas?.currentRuns;
  }

  const canRunManually = workflow?.triggers?.manual?.enabled ?? false;
  const isDisabledViaQuota = workflowQuotasEnabled && hasReachedMonthlyRunLimit;
  const isDisabledViaTrigger = canRunManually === false;
  const isDisabled = isDisabledViaQuota || isDisabledViaTrigger;

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
      <Link to={!isDeleting ? appLink.editorCanvas({ team: teamName, workflowId: workflow.id }) : ""}>
        <section className={styles.details}>
          <div className={styles.iconContainer}>
            <Icon className={styles.icon} alt={`${name}`} />
          </div>
          <div className={styles.descriptionContainer}>
            <h1 title={workflow.name} className={styles.name} data-testid="workflow-card-title">
              {workflow.name}
            </h1>
            <p title={workflow.description} className={styles.description}>
              {workflow.description}
            </p>
          </div>
        </section>
      </Link>
      <section className={styles.launch}>
        {Array.isArray(formattedProperties) && formattedProperties.length !== 0 ? (
          <ComposedModal
            modalHeaderProps={{
              title: `Workflow Parameters`,
              subtitle: `Provide parameter values for your Workflow`,
            }}
            modalTrigger={({ openModal }: ModalTriggerProps) => (
              <Button
                disabled={isDeleting || isDisabled}
                iconDescription={`Run ${viewType}`}
                renderIcon={Run}
                size="md"
                onClick={openModal}
              >
                Run it
              </Button>
            )}
          >
            {({ closeModal }) => (
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
              title: `Execute ${viewType}`,
              subtitle: `"Run and View" will navigate you to the ${viewType.toLowerCase()} exeuction view.`,
            }}
            modalTrigger={({ openModal }: ModalTriggerProps) => (
              <Button
                disabled={isDeleting || isDisabled}
                iconDescription={`Run ${viewType}`}
                renderIcon={Run}
                size="md"
                onClick={openModal}
              >
                Run it
              </Button>
            )}
          >
            {({ closeModal }) => (
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
      {workflow.upgradesAvailable && (
        <div className={styles.templatesWarningIcon}>
          <TooltipHover
            direction="top"
            tooltipContent={`New version of a task available! To update, edit your ${viewType.toLowerCase()}.`}
          >
            <div>
              <WorkflowWarningButton />
            </div>
          </TooltipHover>
        </div>
      )}
      {isDuplicating || isDeleting || isExecuting ? (
        <InlineLoading
          description={loadingText}
          style={{ position: "absolute", left: "0.5rem", top: "0", width: "fit-content" }}
        />
      ) : (
        <div className={styles.status}>
          {isDisabledViaQuota ? (
            <TooltipHover
              direction="top"
              tooltipText="This team has reached the maximum number of runs (executions) allowed this month. Contact your administrator or team owner to increase the quota, or wait until the quota resets next month."
            >
              <InformationFilled className={styles.warningIcon} style={{ fill: "#ff832b" }} />
            </TooltipHover>
          ) : isDisabledViaTrigger ? (
            <TooltipHover direction="top" tooltipText="Trigger disabled">
              <InformationFilled className={styles.warningIcon} style={{ fill: "#ff832b" }} />
            </TooltipHover>
          ) : workflow.status === "active" ? (
            <TooltipHover direction="top" tooltipText="Active">
              <CircleFill className={styles.warningIcon} style={{ fill: "#009d9a" }} />
            </TooltipHover>
          ) : (
            <TooltipHover direction="top" tooltipText="Inactive">
              <CircleFill className={styles.warningIcon} style={{ fill: "#da1e28" }} />
            </TooltipHover>
          )}
          {/* <p className={styles.statusText}>{workflow.status === "active" ? "Active" : "Inactive"}</p> */}
        </div>
      )}
      <div style={{ position: "absolute", right: "0" }}>
        <OverflowMenu flipped ariaLabel="Overflow card menu" iconDescription="Overflow menu icon" size="sm">
          {menuOptions.map(({ onClick, itemText, ...rest }, index) => (
            <OverflowMenuItem
              onClick={onClick}
              itemText={itemText}
              key={`${itemText}-${index}`}
              disabled={isDuplicating || isDeleting || isExecuting}
              {...rest}
            />
          ))}
        </OverflowMenu>
      </div>
      {isUpdateWorkflowModalOpen && (
        <UpdateWorkflow
          onCloseModal={() => setIsUpdateWorkflowModalOpen(false)}
          workflowId={workflow.id}
          teamName={teamName}
          type={viewType}
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
          title={`Delete ${viewType}`}
        >
          {`Are you sure you want to delete this ${viewType.toLowerCase()}? There's no going back from this decision.`}
        </ConfirmModal>
      )}
    </div>
  );
};

export default WorkflowCard;
