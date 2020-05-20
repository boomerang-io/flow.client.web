import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useMutation, queryCache } from "react-query";
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
} from "@boomerang/carbon-addons-boomerang-react";
import WorkflowWarningButton from "Components/WorkflowWarningButton";
import UpdateWorkflow from "./UpdateWorkflow";
import WorkflowInputModalContent from "./WorkflowInputModalContent";
import WorkflowRunModalContent from "./WorkflowRunModalContent";
import fileDownload from "js-file-download";
import { QueryStatus } from "Constants";
import { appLink } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import { Run20 } from "@carbon/icons-react";
import workflowIcons from "Assets/workflowIcons";
import styles from "./workflowCard.module.scss";

WorkflowCard.propTypes = {
  teamId: PropTypes.string.isRequired,
  workflow: PropTypes.object.isRequired,
};

function WorkflowCard({ teamId, workflow }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateWorkflowModalOpen, setIsUpdateWorkflowModalOpen] = useState(false);

  const history = useHistory();

  const [deleteWorkflowMutator, { status: deleteWorkflowStatus }] = useMutation(resolver.deleteWorkflow, {
    onSuccess: () => queryCache.refetchQueries(serviceUrl.getTeams()),
  });

  const [executeWorkflowMutator, { error: executeError, status: executeWorkflowStatus }] = useMutation(
    resolver.postExecuteWorkflow
  );

  const handleOverflowMenuOpen = () => {
    window.addEventListener("keydown", preventKeyScrolling, false);
  };

  const handleOverflowMenuClose = () => {
    window.removeEventListener("keydown", preventKeyScrolling, false);
  };

  useEffect(() => {
    return handleOverflowMenuClose();
  });

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
    try {
      await deleteWorkflowMutator({ id: workflow.id });
      notify(<ToastNotification kind="success" title="Delete Workflow" subtitle="Workflow successfully deleted" />);
    } catch {
      notify(<ToastNotification kind="error" title="Something's Wrong" subtitle="Request to delete workflow failed" />);
    }
  };

  const handleExportWorkflow = (workflow) => {
    notify(<ToastNotification kind="info" title="Export Workflow" subtitle="Export starting soon" />);
    axios
      .get(`${BASE_SERVICE_URL}/workflow/export/${workflow.id}`)
      .then(({ data }) => {
        fileDownload(JSON.stringify(data, null, 4), `${workflow.name}.json`);
      })
      .catch((error) => {
        notify(<ToastNotification kind="error" title="Something's Wrong" subtitle="Export workflow failed" />);
      });
  };

  const handleExecuteWorkflow = async ({ closeModal, redirect = false, properties = {} }) => {
    const { id: workflowId } = workflow;
    try {
      const { data: execution } = await executeWorkflowMutator({ id: workflowId, properties });
      notify(
        <ToastNotification kind="success" title="Run Workflow" subtitle="Successfully started workflow execution" />
      );
      if (redirect) {
        history.push({
          pathname: appLink.execution({ executionId: execution.id, workflowId }),
          state: { fromUrl: appLink.workflows(), fromText: "Workflows" },
        });
      } else {
        closeModal();
      }
    } catch {
      //no-op
    }
  };

  /* prevent page scroll when up or down arrows are pressed **/
  const preventKeyScrolling = (e) => {
    if ([38, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  };

  const menuOptions = [
    {
      itemText: "Edit Workflow",
      onClick: () => history.push(appLink.designer({ teamId: workflow.flowTeamId, workflowId: workflow.id })),
      primaryFocus: true,
    },
    {
      itemText: "View Activity",
      onClick: () => history.push(appLink.workflowActivity({ workflowId: workflow.id })),
    },

    {
      itemText: "Export .json",
      onClick: () => handleExportWorkflow(workflow),
    },
    {
      itemText: "Update .json",
      onClick: () => setIsUpdateWorkflowModalOpen(true),
    },
    {
      hasDivider: true,
      itemText: "Delete",
      isDelete: true,
      onClick: () => setIsDeleteModalOpen(true),
    },
  ];

  const formattedProperties = formatPropertiesForEdit();
  const isDeleting = deleteWorkflowStatus === QueryStatus.Loading;
  const isExecuting = executeWorkflowStatus === QueryStatus.Loading;
  const { name, Icon } = workflowIcons.find((icon) => icon.name === workflow.icon);

  return (
    <div className={styles.container}>
      <Link disabled={isDeleting} to={appLink.designer({ teamId: workflow.flowTeamId, workflowId: workflow.id })}>
        <section className={styles.details}>
          <div className={styles.iconContainer}>
            <Icon className={styles.icon} alt={`${name}`} />
          </div>
          <div className={styles.descriptionContainer}>
            <h1 className={styles.name}>{workflow.name}</h1>
            <p className={styles.description}>{workflow.shortDescription}</p>
          </div>
        </section>
      </Link>
      <section className={styles.launch}>
        {Array.isArray(formattedProperties) && formattedProperties.length !== 0 ? (
          <ComposedModal
            modalHeaderProps={{
              title: "Workflow Properties",
              subtitle: "Provide property values for your workflow",
            }}
            modalTrigger={({ openModal }) => (
              <Button
                disabled={isDeleting}
                iconDescription="Run Workflow"
                renderIcon={Run20}
                size="field"
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
                inputs={formattedProperties}
              />
            )}
          </ComposedModal>
        ) : (
          <ComposedModal
            composedModalProps={{ containerClassName: `${styles.executeWorkflow}` }}
            modalHeaderProps={{
              title: "Execute Workflow",
              subtitle: '"Run and View" will navigate you to the workflow exeuction view.',
            }}
            modalTrigger={({ openModal }) => (
              <Button
                disabled={isDeleting}
                iconDescription="Run Workflow"
                renderIcon={Run20}
                size="field"
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
              />
            )}
          </ComposedModal>
        )}
      </section>
      {workflow.templateUpgradesAvailable && (
        <div className={styles.templatesWarningIcon}>
          <TooltipIcon direction="top" tooltipText={"New version of a task available! To update, edit your workflow."}>
            <WorkflowWarningButton />
          </TooltipIcon>
        </div>
      )}
      {isDeleting || isExecuting ? (
        <InlineLoading
          description={isDeleting ? "Deleting..." : "Executing..."}
          style={{ position: "absolute", right: "0.5rem", top: "0", width: "fit-content" }}
        />
      ) : (
        <OverflowMenu
          flipped
          ariaLabel="Overflow card menu"
          iconDescription="Overflow menu icon"
          onOpen={handleOverflowMenuOpen}
          onClose={handleOverflowMenuClose}
          style={{ position: "absolute", right: "0" }}
        >
          {menuOptions.map(({ onClick, itemText, ...rest }, index) => (
            <OverflowMenuItem onClick={onClick} itemText={itemText} key={`${itemText}-${index}`} {...rest} />
          ))}
        </OverflowMenu>
      )}
      {isUpdateWorkflowModalOpen && (
        <UpdateWorkflow
          onCloseModal={() => setIsUpdateWorkflowModalOpen(false)}
          teamId={teamId}
          workflowId={workflow.id}
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
          title="Delete Workflow"
        >
          Are you sure you want to delete this workflow? There's no going back from this Decision.
        </ConfirmModal>
      )}
    </div>
  );
}

export default WorkflowCard;
