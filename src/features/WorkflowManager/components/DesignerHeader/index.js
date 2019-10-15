import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "carbon-components-react";
import { ConfirmModal, ModalFlow } from "@boomerang/carbon-addons-boomerang-react";
import FeatureHeader from "Components/FeatureHeader";
import Navigation from "./Navigation";
import VersionCommentForm from "./VersionCommentForm";
import VersionSwitcher from "./VersionSwitcher";
import { Add16, CheckmarkOutline16, DocumentExport16, Flash16 } from "@carbon/icons-react";
import styles from "./DesignerHeader.module.scss";

class DesignerHeader extends Component {
  static propTypes = {
    currentRevision: PropTypes.number,
    fetchWorkflowRevisionNumber: PropTypes.func,
    handleChangeLogReasonChange: PropTypes.func,
    onDesigner: PropTypes.bool.isRequired,
    performAction: PropTypes.func,
    performActionButtonText: PropTypes.string,
    revisionCount: PropTypes.number,
    workflowName: PropTypes.string.isRequired
  };

  static defaultProps = {
    includeResetVersionAlert: false
  };

  // Need to hardcode that the version is being reset in the change log for now based on the current implementation
  resetVersionToLatestWithMessage = () => {
    this.props.handleChangeLogReasonChange(`Reverting ${this.props.currentRevision} to the latest version`);
    this.props.performAction();
  };

  determinePerformActionRender() {
    const {
      currentRevision,
      includeResetVersionAlert,
      loading,
      onDesigner,
      performAction,
      performActionButtonText
    } = this.props;

    // If user is resetting to latest version show this alert,
    if (includeResetVersionAlert) {
      return (
        <ConfirmModal
          affirmativeAction={this.resetVersionToLatestWithMessage}
          children="A new version will be created"
          title={`Set version ${currentRevision} to be the latest?`}
          modalTrigger={({ openModal }) => (
            <Button
              disabled={loading || !onDesigner}
              iconDescription="Set version to latest"
              kind="ghost"
              onClick={openModal}
              renderIcon={DocumentExport16}
              size="field"
            >
              {performActionButtonText}
            </Button>
          )}
        />
      );
    }

    return (
      <ModalFlow
        confirmModalProps={{
          title: "Are you sure?",
          children: "A new version will not be created"
        }}
        modalHeaderProps={{
          title: "Create New Version",
          subtitle: "Enter a comment for record keeping"
        }}
        modalTrigger={({ openModal }) => (
          <Button
            disabled={loading || !onDesigner}
            iconDescription="Create new version"
            kind="ghost"
            onClick={openModal}
            renderIcon={Add16}
            size="field"
          >
            {performActionButtonText}
          </Button>
        )}
      >
        <VersionCommentForm
          handleOnChange={this.props.handleChangeLogReasonChange}
          loading={loading}
          onSave={performAction}
        />
      </ModalFlow>
    );
  }

  render() {
    const { currentRevision, fetchWorkflowRevisionNumber, onDesigner, revisionCount, workflowName } = this.props;

    return (
      <FeatureHeader>
        <div className={styles.container}>
          <header className={styles.header}>
            <p className={styles.label}>Workflow Editor</p>
            <h1 className={styles.title}>{workflowName}</h1>
          </header>
          <section className={styles.versionSwitcherContainer}>
            <VersionSwitcher
              disabled={!onDesigner}
              currentRevision={currentRevision}
              onChangeVersion={fetchWorkflowRevisionNumber}
              revisionCount={revisionCount}
            />
            {this.determinePerformActionRender()}
          </section>
          <section className={styles.workflowButtons}>
            <Button
              disabled={!onDesigner}
              iconDescription="Test workflow"
              kind="ghost"
              renderIcon={Flash16}
              size="field"
            >
              Test this workflow
            </Button>
            <Button
              disabled={!onDesigner}
              iconDescription="Publish workflow"
              kind="ghost"
              renderIcon={CheckmarkOutline16}
              size="field"
            >
              Publish this version
            </Button>
          </section>
        </div>
        <Navigation />
      </FeatureHeader>
    );
  }
}

export default DesignerHeader;
