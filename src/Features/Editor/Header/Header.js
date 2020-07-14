import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Button,
  ConfirmModal,
  ComposedModal,
  DelayedRender,
  InlineLoading,
} from "@boomerang-io/carbon-addons-boomerang-react";
import FeatureHeader from "Components/FeatureHeader";
import Navigation from "./Navigation";
import VersionCommentForm from "./VersionCommentForm";
import VersionSwitcher from "./VersionSwitcher";
import { appLink } from "Config/appConfig";
import { QueryStatus } from "Constants";
import { Add16, DocumentExport16 } from "@carbon/icons-react";
import styles from "./header.module.scss";

DesignerHeader.propTypes = {
  createRevision: PropTypes.func,
  currentRevision: PropTypes.number,
  isOnDesigner: PropTypes.bool.isRequired,
  performActionButtonText: PropTypes.string,
  revisionMutation: PropTypes.object,
  revisionState: PropTypes.object,
  revisionQuery: PropTypes.object,
  summaryData: PropTypes.object,
};

DesignerHeader.defaultProps = {
  includeResetVersionAlert: false,
};

function DesignerHeader({
  createRevision,
  changeRevision,
  isOnDesigner,
  revisionMutation,
  revisionState,
  revisionQuery,
  summaryData,
}) {
  const { revisionCount, name } = summaryData;
  const { version: currentRevision } = revisionState;
  const isPreviousVersion = currentRevision < revisionCount;
  const isQueryLoading = revisionQuery.status === QueryStatus.Loading;
  const performActionButtonText = currentRevision < revisionCount ? "Set version to latest" : "Create new version";

  // Need to hardcode that the version is being reset in the change log for now based on the current implementation
  const resetVersionToLatestWithMessage = () => {
    createRevision({ reason: `Set ${currentRevision} to the latest version` });
  };

  return (
    <FeatureHeader includeBorder className={styles.container}>
      <section className={styles.header}>
        <div className={styles.breadcrumbContainer}>
          <Link className={styles.workflowsLink} to={appLink.workflows()}>
            Workflows
          </Link>
          <span className={styles.breadcrumbDivider}>/</span>
          <p className={styles.workflowName}>{name}</p>
        </div>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Editor</h1>
        </div>
      </section>
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
              modalTrigger={({ openModal }) => (
                <Button
                  disabled={!isOnDesigner}
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
              modalTrigger={({ openModal }) => (
                <Button
                  disabled={!isOnDesigner}
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
              {({ closeModal }) => (
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
      <Navigation />
    </FeatureHeader>
  );
}

export default DesignerHeader;
