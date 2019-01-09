import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import ToolTip from "@boomerang/boomerang-components/lib/Tooltip";
import pencilIcon from "./pencil.svg";
import SwitchLabelModal from "./SwitchLabelModal";
//import "./styles.scss";

class EditSwitchButton extends Component {
  static defaultProps = {
    fullscreen: false,
    initialSwitchCondition: PropTypes.string
  };

  static propTypes = {
    className: PropTypes.string,
    passedOnClick: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      initialSwitchCondition: props.initialSwitchCondition ? props.initialSwitchCondition : "default"
    };
  }

  //trigger a modal
  handleOnSave = condition => {
    this.setState({ initialSwitchCondition: condition }, () => {
      this.props.onClick(condition);
    });
  };

  render() {
    //const executionConditionConfig = EXECUTION_CONDITIONS[this.state.executionConditionIndex];
    const { modelId } = this.props;
    return (
      <>
        <foreignObject>
          <Modal
            ModalTrigger={() => <img src={pencilIcon} className="b-editswitch-button" alt="Task node type" />}
            modalContent={(closeModal, ...rest) => (
              <ModalFlow
                headerTitle="Edit Properties"
                components={[{ step: 0, component: SwitchLabelModal }]}
                closeModal={closeModal}
                confirmModalProps={{ affirmativeAction: closeModal, theme: "bmrg-black" }}
                //config={this.props.nodeConfig}
                onSave={this.handleOnSave}
                theme={"bmrg-white"}
                initialSwitchCondition={this.state.initialSwitchCondition}
                //nodeConfig={nodeConfig}
                {...rest}
              />
            )}
          />
        </foreignObject>
      </>
    );
  }
}

export default EditSwitchButton;
