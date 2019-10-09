import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "carbon-components-react";
import { ConfirmModal, ModalFlow } from "@boomerang/carbon-addons-boomerang-react";
import VersionCommentForm from "./VersionCommentForm";
import VersionSwitcher from "./VersionSwitcher";
import { Add16, CheckmarkOutline16, Flash16, ZoomIn16, ZoomOut16 } from "@carbon/icons-react";
import styles from "./ActionBar.module.scss";

/*function to add add/subtract to the zoom level*/

class ActionBar extends Component {
  static propTypes = {
    diagramApp: PropTypes.object.isRequired,
    diagramBoundingClientRect: PropTypes.object,
    currentRevision: PropTypes.number,
    handleChangeLogReasonChange: PropTypes.func,
    fetchWorkflowRevisionNumber: PropTypes.func,
    // includePerformActionAlert: PropTypes.bool,
    includeZoom: PropTypes.bool,
    isValidOverview: PropTypes.bool,
    performAction: PropTypes.func,
    performActionButtonText: PropTypes.string,
    revisionCount: PropTypes.number,
    showActionButton: PropTypes.bool,
    workflowName: PropTypes.string.isRequired
  };

  static defaultProps = {
    includeCreateNewVersionComment: false,
    includeResetVersionAlert: false,
    includeVersionSwitcher: false,
    includeZoom: false,
    showActionButton: true
  };

  handleZoomIncrease = () => {
    for (let i = 0; i < 200; i++) {
      setTimeout(() => {
        this.handleZoomChange(1.0015);
      }, 0);
    }
  };

  handleZoomDecrease = () => {
    for (let i = 0; i < 200; i++) {
      setTimeout(() => {
        this.handleZoomChange(0.9985);
      }, 0);
    }
  };

  handleZoomChange = zoomDelta => {
    const diagramModel = this.props.diagramApp.getDiagramEngine().getDiagramModel();
    const oldZoomFactor = diagramModel.getZoomLevel() / 100;

    if (diagramModel.getZoomLevel() + zoomDelta > 10) {
      diagramModel.setZoomLevel(diagramModel.getZoomLevel() * zoomDelta);
    }

    const zoomFactor = diagramModel.getZoomLevel() / 100;
    const boundingRect = this.props.diagramBoundingClientRect;
    const clientWidth = boundingRect.width;
    const clientHeight = boundingRect.height;

    // compute difference between rect before and after
    const widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor;
    const heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor;

    // compute coords relative to canvas
    const clientX = Math.round(boundingRect.left * 2);
    const clientY = Math.round(boundingRect.top * 2);

    // compute width and height increment factor
    const xFactor = (clientX - diagramModel.getOffsetX()) / oldZoomFactor / clientWidth;
    const yFactor = (clientY - diagramModel.getOffsetY()) / oldZoomFactor / clientHeight;

    diagramModel.setOffset(
      diagramModel.getOffsetX() - widthDiff * xFactor,
      diagramModel.getOffsetY() - heightDiff * yFactor
    );

    this.props.diagramApp.getDiagramEngine().enableRepaintEntities([]);
    this.props.diagramApp.diagramEngine.repaintCanvas();
  };

  // Need to hardcode that the version is being reset in the change log for now based on the current implementation
  resetVersionToLatestWithMessage = () => {
    this.props.handleChangeLogReasonChange(`Reverting ${this.props.currentRevision} to the latest version`);
    this.props.performAction();
  };

  determinePerformActionRender() {
    const {
      currentRevision,
      loading,
      includeResetVersionAlert,
      includeCreateNewVersionComment,
      //isValidOverview,
      performAction,
      performActionButtonText
      //showActionButton
    } = this.props;

    if (includeResetVersionAlert) {
      return (
        <ConfirmModal
          affirmativeAction={this.resetVersionToLatestWithMessage}
          children="A new version will be created"
          title={`Set version ${currentRevision} to be the latest?`}
          modalTrigger={({ openModal }) => (
            <Button
              disabled={loading}
              kind="ghost"
              iconDescription="Add"
              renderIcon={Add16}
              size="field"
              onClick={openModal}
            >
              {performActionButtonText}
            </Button>
          )}
        />
      );
    }

    if (includeCreateNewVersionComment) {
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
            <div style={{ minWidth: "14rem" }}>
              <Button iconDescription="Add" kind="ghost" renderIcon={Add16} size="field" onClick={openModal}>
                {performActionButtonText}
              </Button>
            </div>
          )}
        >
          <VersionCommentForm
            onSave={performAction}
            loading={loading}
            handleOnChange={this.props.handleChangeLogReasonChange}
          />
        </ModalFlow>
      );
    }

    return null;
  }

  render() {
    const { fetchWorkflowRevisionNumber, includeZoom, currentRevision, revisionCount, workflowName } = this.props;

    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.label}>Workflow Editor</p>
          <h1 className={styles.title}>{workflowName}</h1>
        </header>
        <section className={styles.bar}>
          {includeZoom && (
            <div className={styles.zoomIcons}>
              <button className={styles.zoomButton} onClick={this.handleZoomDecrease}>
                <ZoomOut16 className={styles.zoomIcon} />
              </button>
              <button className={styles.zoomButton} onClick={this.handleZoomIncrease}>
                <ZoomIn16 className={styles.zoomIcon} />
              </button>
            </div>
          )}
          <VersionSwitcher
            revisionCount={revisionCount}
            currentRevision={currentRevision}
            onChangeVersion={fetchWorkflowRevisionNumber}
          />
          {this.determinePerformActionRender()}
        </section>
        <section className={styles.workflowButtons}>
          <Button kind="ghost" iconDescription="Test workflow" renderIcon={Flash16} size="field">
            Test this workflow
          </Button>
          <Button kind="ghost" iconDescription="Publish workflow" renderIcon={CheckmarkOutline16} size="field">
            Publish this version
          </Button>
        </section>
      </div>
    );
  }
}

export default ActionBar;
