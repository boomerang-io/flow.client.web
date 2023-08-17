import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, Button } from "@carbon/react";
import {
  ConfirmModal,
  ComposedModal,
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureNavTab as Tab,
  FeatureNavTabs as Tabs,
} from "@boomerang-io/carbon-addons-boomerang-react";
import VersionCommentForm from "./VersionCommentForm";
import VersionSwitcher from "./VersionSwitcher";
import { appLink } from "Config/appConfig";
import { Add, DocumentExport } from "@carbon/react/icons";
import { AxiosResponse } from "axios";
import { UseMutationResult } from "react-query";
import {
  ModalTriggerProps,
  ComposedModalChildProps,
  WorkflowCanvasState,
  WorkflowView,
  WorkflowViewType,
  ChangeLog,
} from "Types";
import styles from "./header.module.scss";

interface DesignerHeaderProps {
  changeLog: ChangeLog;
  createRevision: (reason: string, callback?: () => any) => void;
  changeRevision: (revisionNumber: string) => void;
  isOnDesigner: boolean;
  revisionMutator: UseMutationResult<AxiosResponse<any, any>, unknown, { workflowId: any; body: any }, unknown>;
  revisionState: WorkflowCanvasState;
  viewType: WorkflowViewType;
  revisionCount: number;
}

const DesignerHeader: React.FC<DesignerHeaderProps> = ({
  createRevision,
  changeRevision,
  isOnDesigner,
  revisionCount,
  revisionMutator,
  revisionState,
  viewType,
}) => {
  const routeMatch: { params: { teamId: string; workflowId: string } } = useRouteMatch();
  const {
    params: { teamId, workflowId },
  } = routeMatch;
  const { name } = revisionState;
  const { version: currentRevision } = revisionState;
  const isPreviousVersion = currentRevision < revisionCount;
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
            {viewType === WorkflowView.Workflow ? (
              <Link to={appLink.workflows({ teamId })}>Workflows</Link>
            ) : (
              <Link to={appLink.templateWorkflows()}>Template Workflows</Link>
            )}
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <p>{name}</p>
          </BreadcrumbItem>
        </Breadcrumb>
      }
      header={<HeaderTitle>Editor</HeaderTitle>}
      footer={
        <Tabs ariaLabel="Editor pages">
          <Tab label="Workflow" to={appLink.editorDesigner({ teamId, workflowId })} />
          <Tab label="Parameters" to={appLink.editorProperties({ teamId, workflowId })} />
          <Tab label="Configure" to={appLink.editorConfigure({ teamId, workflowId })} />
          <Tab label="Schedule" to={appLink.editorSchedule({ teamId, workflowId })} />
          <Tab label="Change Log" to={appLink.editorChangelog({ teamId, workflowId })} />
        </Tabs>
      }
      actions={
        <section className={styles.workflowButtons}>
          <VersionSwitcher
            currentRevision={currentRevision}
            disabled={!isOnDesigner}
            onChangeVersion={changeRevision}
            revisionCount={revisionCount}
          />
          <div className={styles.workflowActionContainer}>
            <>
              <ConfirmModal
                affirmativeAction={resetVersionToLatestWithMessage}
                children="A new version will be created"
                title={`Set version ${currentRevision} to be the latest`}
                modalTrigger={({ openModal }: ModalTriggerProps) => (
                  <Button
                    disabled={!isOnDesigner}
                    iconDescription="Set version to latest"
                    kind="ghost"
                    onClick={openModal}
                    renderIcon={DocumentExport}
                    size="md"
                    style={!isPreviousVersion ? { display: "none" } : null}
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
                    disabled={!isOnDesigner}
                    iconDescription="Create new version"
                    kind="ghost"
                    onClick={openModal}
                    renderIcon={Add}
                    size="md"
                    style={isPreviousVersion ? { display: "none" } : null}
                  >
                    {performActionButtonText}
                  </Button>
                )}
              >
                {({ closeModal }: ComposedModalChildProps) => (
                  <VersionCommentForm
                    closeModal={closeModal}
                    createRevision={createRevision}
                    revisionMutator={revisionMutator}
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
