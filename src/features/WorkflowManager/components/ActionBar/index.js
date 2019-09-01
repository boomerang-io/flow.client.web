import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "carbon-components-react";
import AlertModal from "@boomerang/boomerang-components/lib/AlertModal";
import ConfirmModal from "@boomerang/boomerang-components/lib/ConfirmModal";
import Modal from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import VersionCommentForm from "./VersionCommentForm";
import VersionSwitcher from "./VersionSwitcher";
import minusIcon from "./assets/minus.svg";
import plusIcon from "./assets/plus.svg";
import { Add16, Save16 } from "@carbon/icons-react";
import "./styles.scss";

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
    isValidOverview: PropTypes.bool.isRequired,
    performAction: PropTypes.func,
    performActionButtonText: PropTypes.string,
    revisionCount: PropTypes.number,
    showActionButton: PropTypes.bool
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
    //const currentTarget = Array.from(document.getElementsByClassName("srd-diagram srd-demo-canvas"))[0];
    //const boundingRect = currentTarget.getBoundingClientRect();
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
      includeResetVersionAlert,
      includeCreateNewVersionComment,
      isValidOverview,
      performAction,
      performActionButtonText,
      showActionButton,
      loading
    } = this.props;

    if (includeResetVersionAlert) {
      return (
        <AlertModal
          modalProps={{ shouldCloseOnOverlayClick: false }}
          ModalTrigger={() => (
            <div style={{ minWidth: "13rem" }}>
              <Button disabled={loading} iconDescription="Add" renderIcon={Add16} size="field">
                {performActionButtonText}
              </Button>
            </div>
          )}
          modalContent={closeModal => (
            <ConfirmModal
              title={`Set version ${currentRevision} to latest?`}
              subTitleTop="A new version will be created"
              closeModal={closeModal}
              affirmativeAction={this.resetVersionToLatestWithMessage}
              affirmativeText="Yes"
              theme="bmrg-flow"
            />
          )}
        />
      );
    }

    if (includeCreateNewVersionComment) {
      return (
        <Modal
          modalProps={{ shouldCloseOnOverlayClick: false }}
          ModalTrigger={() => (
            <div style={{ minWidth: "13rem" }}>
              <Button iconDescription="Add" renderIcon={Add16} size="field">
                {performActionButtonText}
              </Button>
            </div>
          )}
          modalContent={(closeModal, ...rest) => (
            <ModalFlow
              closeModal={closeModal}
              headerTitle="Create New Version"
              headerSubtitle="Enter a comment for record keeping"
              theme={"bmrg-flow"}
              confirmModalProps={{
                affirmativeAction: closeModal,
                theme: "bmrg-flow",
                subTitleTop: "A new version will not be created"
              }}
              {...rest}
            >
              <VersionCommentForm
                onSave={performAction}
                loading={loading}
                handleOnChange={this.props.handleChangeLogReasonChange}
              />
            </ModalFlow>
          )}
        />
      );
    }
    if (showActionButton) {
      return (
        <Button
          disabled={!isValidOverview || loading}
          iconDescription="Save"
          onClick={performAction}
          renderIcon={Save16}
          size="field"
        >
          {performActionButtonText}
        </Button>
      );
    }

    return null;
  }

  render() {
    const {
      fetchWorkflowRevisionNumber,
      includeVersionSwitcher,
      includeZoom,
      currentRevision,
      revisionCount
    } = this.props;

    return (
      <div className="c-action-bar">
        <div className="b-action-bar">
          {includeZoom && [
            <Button iconOnly className="b-action-bar__zoom" onClick={this.handleZoomDecrease} key="out" kind="ghost">
              <img src={minusIcon} alt="Zoom out" />
            </Button>,
            <Button iconOnly className="b-action-bar__zoom" onClick={this.handleZoomIncrease} key="in" kind="ghost">
              <img src={plusIcon} alt="Zoom in" />
            </Button>
          ]}
          {includeVersionSwitcher && (
            <VersionSwitcher
              revisionCount={revisionCount}
              currentRevision={currentRevision}
              onChangeVersion={fetchWorkflowRevisionNumber}
            />
          )}
          {this.determinePerformActionRender()}
        </div>
      </div>
    );
  }
}

export default ActionBar;
