//@ts-nocheck
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ModalFlow } from "@boomerang-io/carbon-addons-boomerang-react";
import WorkFlowCloseButton from "Components/WorkflowCloseButton";
import WorkflowLink from "Components/WorkflowLink";
import SwitchLinkExecutionConditionButton from "Components/SwitchLinkExecutionConditionButton";
import ConfigureSwitchModal from "./ConfigureSwitchModal";
import styles from "./SwitchLink.module.scss";

//TOOD: context
class SwitchLink extends PureComponent {
  static propTypes = {
    diagramEngine: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      defaultState: props.model.switchCondition === null ? true : false,
      isModalOpen: false,
      switchCondition: props.model.switchCondition,
    };
  }

  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  updateSwitchState = (switchCondition, saveFunction) => {
    this.setState(
      { switchCondition: switchCondition },

      () => saveFunction()
    );
  };

  closeModal = () => {
    this.setState({ isModalOpen: false, switchCondition: this.props.model.switchCondition }, () => {
      if (this.props.model.switchCondition === null) {
        this.setState({ defaultState: true });
      } else {
        this.setState({ defaultState: false });
      }
    });
    this.props.diagramEngine.repaintCanvas();
  };

  handleSave = () => {
    this.setState({ isModalOpen: false });
    //also save back the state
    if (this.state.defaultState) {
      this.props.model.switchCondition = null;
    } else {
      this.props.model.switchCondition = this.state.switchCondition;
    }
  };

  updateDefaultState = () => {
    this.setState(
      (prevState) => ({ defaultState: !prevState.defaultState }),
      () => {
        if (this.state.defaultState) {
          this.setState({ switchCondition: null });
        }
      }
    );
  };

  render() {
    const { diagramEngine, model, path } = this.props;
    let seperatedLinkState;
    if (this.props.model.switchCondition) {
      seperatedLinkState = this.props.model.switchCondition.replace(/\n/g, ",");
    }

    return (
      <>
        <ModalFlow
          confirmModalProps={{
            title: "Are you sure?",
            children: "Your changes will not be saved",
          }}
          modalHeaderProps={{
            title: "Switch",
            subtitle: "Set up the conditions",
          }}
          isOpen={this.state.isModalOpen}
          onCloseModal={() => {
            this.setState({ isModalOpen: false });
          }}
        >
          <ConfigureSwitchModal
            defaultState={this.state.defaultState}
            onSubmit={this.handleSave}
            switchCondition={this.state.switchCondition}
            updateDefaultState={this.updateDefaultState}
            updateSwitchState={this.updateSwitchState}
          />
        </ModalFlow>
        <WorkflowLink className={styles.container} diagramEngine={diagramEngine} model={model} path={path}>
          {({ halfwayPoint, handleOnDelete }) => (
            <>
              <g transform={`translate(${halfwayPoint.x - 12}, ${halfwayPoint.y - 12})`}>
                <WorkFlowCloseButton onClick={handleOnDelete} className={styles.deleteButton} />
              </g>
              <g transform={`translate(${halfwayPoint.x + 16}, ${halfwayPoint.y - 12})`}>
                <SwitchLinkExecutionConditionButton
                  kind="designer"
                  inputText={seperatedLinkState}
                  onClick={this.openModal}
                />
              </g>
            </>
          )}
        </WorkflowLink>
      </>
    );
  }
}

export default SwitchLink;
