import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button } from "carbon-components-react";
import { ConfirmModal, ModalFlow } from "@boomerang/carbon-addons-boomerang-react";
import FeatureHeader from "Components/FeatureHeader";
import Navigation from "./Navigation";
import VersionCommentForm from "./VersionCommentForm";
import VersionSwitcher from "./VersionSwitcher";
import { Add16, DocumentExport16 } from "@carbon/icons-react";
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
    workflowName: PropTypes.string.isRequired,
  };

  static defaultProps = {
    includeResetVersionAlert: false,
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
      isCreating,
      loading,
      onDesigner,
      performAction,
      performActionButtonText,
    } = this.props;

    // If user is resetting to latest version show this alert,
    if (includeResetVersionAlert) {
      return (
        <ConfirmModal
          affirmativeAction={this.resetVersionToLatestWithMessage}
          children="A new version will be created."
          title={`Set version ${currentRevision} to the latest`}
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
        composedModalProps={{ shouldCloseOnOverlayClick: false }}
        confirmModalProps={{
          title: "Are you sure?",
          children: "A new version will not be created",
        }}
        modalHeaderProps={{
          title: "Create New Version",
          subtitle: "Enter a comment for record keeping",
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
          isCreating={isCreating}
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
      <FeatureHeader includeBorder className={styles.container}>
        <section className={styles.header}>
          <div className={styles.breadcrumbContainer}>
            <Link className={styles.workflowsLink} to="/workflows">
              Workflows
            </Link>
            <span className={styles.breadcrumbDivider}>/</span>
            <p className={styles.workflowName}> {workflowName}</p>
            {/* <Button
              className={styles.validateButton}
              disabled={!onDesigner}
              iconDescription="Validate workflow"
              kind="ghost"
              renderIcon={Flash16}
              size="field"
            >
              Validate this workflow
            </Button> */}
          </div>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>Editor</h1>
          </div>
        </section>
        <section className={styles.workflowButtons}>
          <VersionSwitcher
            disabled={!onDesigner}
            currentRevision={currentRevision}
            onChangeVersion={fetchWorkflowRevisionNumber}
            revisionCount={revisionCount}
          />
          {this.determinePerformActionRender()}
        </section>
        <Navigation />
      </FeatureHeader>
    );
  }
}

export default DesignerHeader;
