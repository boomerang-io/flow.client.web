import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ConfirmModal,
  ComposedModal,
  DelayedRender,
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureNavTab as Tab,
  FeatureNavTabs as Tabs,
  InlineLoading,
} from "@boomerang-io/carbon-addons-boomerang-react";
import VersionCommentForm from "./VersionCommentForm";
import VersionSwitcher from "./VersionSwitcher";
import { appLink } from "Config/appConfig";
import { QueryStatus } from "Constants";
import { Add16, DocumentExport16 } from "@carbon/icons-react";
import { AxiosResponse } from "axios";
import { UseQueryResult, MutateFunction } from "react-query";
import {
  ModalTriggerProps,
  ComposedModalChildProps,
  WorkflowSummary,
  WorkflowRevision,
  WorkflowRevisionState,
} from "Types";
import { WorkflowScope } from "Constants";
import styles from "./header.module.scss";

interface DesignerHeaderProps {
  createRevision: (reason: string, callback?: () => any) => void;
  changeRevision: (revisionNumber: number) => void;
  isOnDesigner: boolean;
  revisionMutation: MutateFunction<AxiosResponse<any>, Error>;
  revisionState: WorkflowRevisionState;
  revisionQuery: UseQueryResult<WorkflowRevision, unknown>;
  summaryData: WorkflowSummary;
  canEditWorkflow: boolean;
}

const DesignerHeader: React.FC<DesignerHeaderProps> = ({
  createRevision,
  changeRevision,
  isOnDesigner,
  revisionMutation,
  revisionState,
  revisionQuery,
  summaryData,
  canEditWorkflow,
}) => {
  const routeMatch: { params: { workflowId: string } } = useRouteMatch();
  const {
    params: { workflowId },
  } = routeMatch;
  const { revisionCount, name, scope } = summaryData;
  const { version: currentRevision } = revisionState;
  const isPreviousVersion = currentRevision < revisionCount;
  const isQueryLoading = revisionQuery.status === QueryStatus.Loading;
  const performActionButtonText = currentRevision < revisionCount ? "Set version to latest" : "Create new version";

  // Need to hardcode that the version is being reset in the change log for now based on the current implementation
  const resetVersionToLatestWithMessage = () => {
    createRevision(`Set ${currentRevision} to the latest version`);
  };

  return (
    <Header
      className={styles.container}
      nav={
        <Breadcrumb noTrailingSlash>
          <BreadcrumbItem>
            {scope === WorkflowScope.System ? (
              <Link to={appLink.systemWorkflows()}>System Workflows</Link>
            ) : scope === WorkflowScope.Team ? (
              <Link to={appLink.workflowsTeams()}>Workflows</Link>
            ) : scope === WorkflowScope.Template ? (
              <Link to={appLink.templateWorkflows()}>Template Workflows</Link>
            ) : (
              <Link to={appLink.workflowsMine()}>My Workflows</Link>
            )}
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <p>{name}</p>
          </BreadcrumbItem>
        </Breadcrumb>
      }
      header={<HeaderTitle>Editor</HeaderTitle>}
      footer={
        <Tabs>
          <Tab label="Workflow" to={appLink.editorDesigner({ workflowId })} />
          <Tab label="Parameters" to={appLink.editorProperties({ workflowId })} />
          <Tab label="Configure" to={appLink.editorConfigure({ workflowId })} />
          <Tab label="Schedule" to={appLink.editorSchedule({ workflowId })} />
          <Tab label="Change Log" to={appLink.editorChangelog({ workflowId })} />
        </Tabs>
      }
      actions={
        <section className={styles.workflowButtons}>
          <VersionSwitcher
            currentRevision={currentRevision}
            disabled={isQueryLoading || !isOnDesigner}
            onChangeVersion={changeRevision}
            revisionCount={revisionCount}
          />
          <div className={styles.workflowActionContainer}>
            <>
              {isQueryLoading && (
                <DelayedRender>
                  <InlineLoading description="Loading version..." style={{ height: "2.5rem" }} />
                </DelayedRender>
              )}
              <ConfirmModal
                affirmativeAction={resetVersionToLatestWithMessage}
                children="A new version will be created"
                title={`Set version ${currentRevision} to be the latest`}
                modalTrigger={({ openModal }: ModalTriggerProps) => (
                  <Button
                    disabled={!isOnDesigner || !canEditWorkflow}
                    iconDescription="Set version to latest"
                    kind="ghost"
                    onClick={openModal}
                    renderIcon={DocumentExport16}
                    size="field"
                    style={!isPreviousVersion || isQueryLoading ? { display: "none" } : null}
                  >
                    {performActionButtonText}
                  </Button>
                )}
              />
              <ComposedModal
                composedModalProps={{ containerClassName: styles.versionCommentModalContainer }}
                modalHeaderProps={{
                  title: "Create New Version",
                  subtitle: "Enter a comment for record keeping",
                }}
                modalTrigger={({ openModal }: ModalTriggerProps) => (
                  <Button
                    disabled={!isOnDesigner || !canEditWorkflow}
                    iconDescription="Create new version"
                    kind="ghost"
                    onClick={openModal}
                    renderIcon={Add16}
                    size="field"
                    style={isPreviousVersion || isQueryLoading ? { display: "none" } : null}
                  >
                    {performActionButtonText}
                  </Button>
                )}
              >
                {({ closeModal }: ComposedModalChildProps) => (
                  <VersionCommentForm
                    closeModal={closeModal}
                    createRevision={createRevision}
                    revisionMutation={revisionMutation}
                  />
                )}
              </ComposedModal>
            </>
          </div>
        </section>
      }
    />
  );
};

export default DesignerHeader;
