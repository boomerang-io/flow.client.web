import React, { Component } from "react";
import PropTypes from "prop-types";
import ModalContentBody from "@boomerang/boomerang-components/lib/ModalContentBody";
import ModalContentHeader from "@boomerang/boomerang-components/lib/ModalContentHeader";
import ModalContentFooter from "@boomerang/boomerang-components/lib/ModalContentFooter";
import ModalConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";

export default class SwitchLabelModal extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    handleOnChange: PropTypes.func.isRequired
    //shouldConfirmExit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      initialSwitchCondition: props.initialSwitchCondition
    };
  }

  render() {
    return <ModalContentHeader title="Edit Switch Valie" subtitle="" theme="bmrg-white" />;
  }
}
