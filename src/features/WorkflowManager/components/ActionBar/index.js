import React, { Component } from "react";
import PropTypes from "prop-types";
import AlertModal from "@boomerang/boomerang-components/lib/AlertModal";
import Button from "@boomerang/boomerang-components/lib/Button";
import ConfirmModal from "@boomerang/boomerang-components/lib/ConfirmModal";
import Modal from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import VersionCommentForm from "./VersionCommentForm";
import VersionSwitcher from "./VersionSwitcher";
import minusIcon from "./assets/minus";
import plusIcon from "./assets/plus";
//import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import "./styles.scss";

/*function to add add/subtract to the zoom level*/

class ActionBar extends Component {
  static propTypes = {
    actionButtonText: PropTypes.string.isRequired,
    currentRevision: PropTypes.string.isRequired,
    handleChangeLogReasonChange: PropTypes.func.isRequired,
    fetchWorkflowRevisionNumber: PropTypes.func.isRequired,
    includePerformActionAlert: PropTypes.bool,
    includeVersionSwitcher: PropTypes.bool,
    includeZoom: PropTypes.bool,
    performAction: PropTypes.func.isRequired,
    revisionCount: PropTypes.string.isRequired
  };

  static defaultProps = {
    includeCreateNewVersionComment: false,
    includeResetVersionAlert: false,
    includeVersionSwitcher: false,
    includeZoom: false
  };

  handleZoomIncrease = () => {
    this.props.diagramApp.getDiagramEngine().getDiagramModel().zoom += 10;
    this.props.diagramApp.diagramEngine.repaintCanvas();
  };

  handleZoomDecrease = () => {
    this.props.diagramApp.getDiagramEngine().getDiagramModel().zoom -= 10;
    this.props.diagramApp.diagramEngine.repaintCanvas();
  };

  determinePerformActionRender() {
    const {
      includeResetVersionAlert,
      includeCreateNewVersionComment,
      actionButtonText,
      performAction,
      currentRevision
    } = this.props;

    if (includeResetVersionAlert) {
      return (
        <AlertModal
          ModalTrigger={() => <Button theme="bmrg-black">{actionButtonText}</Button>}
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
          ModalTrigger={() => <Button theme="bmrg-black">{actionButtonText}</Button>}
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

    return (
      <Button theme="bmrg-black" onClick={performAction}>
        {actionButtonText}
      </Button>
    );
  }

  render() {
    const {
      fetchWorkflowRevisionNumber,
      includeZoom,
      includeVersionSwitcher,
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
