import React, { Component } from "react";
import PropTypes from "prop-types";
import AlertModal from "@boomerang/boomerang-components/lib/AlertModal";
import Button from "@boomerang/boomerang-components/lib/Button";
import ConfirmModal from "@boomerang/boomerang-components/lib/ConfirmModal";
import Modal from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import VersionCommentForm from "./VersionCommentForm";
import VersionSwitcher from "./VersionSwitcher";
import minusIcon from "./assets/minus.svg";
import plusIcon from "./assets/plus.svg";
//import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import "./styles.scss";

/*function to add add/subtract to the zoom level*/

class ActionBar extends Component {
  static propTypes = {
    currentRevision: PropTypes.number,
    handleChangeLogReasonChange: PropTypes.func,
    fetchWorkflowRevisionNumber: PropTypes.func,
    includePerformActionAlert: PropTypes.bool,
    includeZoom: PropTypes.bool,
    isValidOverview: PropTypes.bool.isRequired,
    performAction: PropTypes.func.isRequired,
    performActionButtonText: PropTypes.string.isRequired,
    revisionCount: PropTypes.number
  };

  static defaultProps = {
    includeCreateNewVersionComment: false,
    includeResetVersionAlert: false,
    includeVersionSwitcher: false,
    includeZoom: false
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

  determinePerformActionRender() {
    const {
      currentRevision,
      includeResetVersionAlert,
      includeCreateNewVersionComment,
      isValidOverview,
      performActionButtonText,
      performAction
    } = this.props;

    if (includeResetVersionAlert) {
      return (
        <AlertModal
          ModalTrigger={() => <Button theme="bmrg-black">{performActionButtonText}</Button>}
          modalContent={closeModal => (
            <ConfirmModal
              title={`Set version ${currentRevision} to latest?`}
              subTitleTop="A new version will be created"
              closeModal={closeModal}
              affirmativeAction={performAction}
              affirmativeText="Yes"
              theme="bmrg-white"
            />
          )}
        />
      );
    }

    if (includeCreateNewVersionComment) {
      return (
        <Modal
          ModalTrigger={() => <Button theme="bmrg-black">{performActionButtonText}</Button>}
          modalContent={(closeModal, ...rest) => (
            <ModalFlow
              headerTitle="Create New Version"
              headerSubtitle="Enter a comment for record keeping"
              components={[{ step: 0, component: VersionCommentForm }]}
              closeModal={closeModal}
              onSave={performAction}
              handleOnChange={this.props.handleChangeLogReasonChange}
              theme={"bmrg-white"}
              {...rest}
            />
          )}
        />
      );
    }
    console.log("action", isValidOverview);
    if (isValidOverview) {
      return (
        <Button theme="bmrg-black" onClick={performAction}>
          {performActionButtonText}
        </Button>
      );
    }

    // If not valid overview, return as disabled button
    return (
      <Button disabled theme="bmrg-black">
        {performActionButtonText}
      </Button>
    );
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
            <Button className="b-action-bar__zoom" onClick={this.handleZoomDecrease} key="out">
              <img src={minusIcon} alt="Zoom out" />
            </Button>,
            <Button className="b-action-bar__zoom" onClick={this.handleZoomIncrease} key="in">
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
