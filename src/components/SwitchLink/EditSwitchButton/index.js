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
    onClick: PropTypes.func,
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

  testFunc = () => {
    this.props.onClick();
  };

  render() {
    return (
      <>
        {/*
        <foreignObject>
          <Modal
            ModalTrigger={() => <img src={pencilIcon} className="b-editswitch-button__img" alt="Task node type" />}
            modalContent={(closeModal, ...rest) => (
              <ModalFlow
                headerTitle="Edit Properties"
                components={[{ step: 0, component: SwitchLabelModal }]}
                closeModal={closeModal}
                confirmModalProps={{ affirmativeAction: closeModal, theme: "bmrg-black" }}
                handleOnChange={this.handleOnSave}
                theme={"bmrg-white"}
                initialSwitchCondition={this.state.initialSwitchCondition}
                //confirmModalProps={{ affirmativeAction: () => closeModal(), theme: "bmrg-white" }}
                {...rest}
              />
            )}
          />
        </foreignObject>
          */}
        <img src={pencilIcon} className="b-editswitch-button__img" alt="Task node type" onclick={this.testFunc} />
      </>
    );
  }
}

export default EditSwitchButton;
