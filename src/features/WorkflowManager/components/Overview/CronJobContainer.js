import React, { Component } from "react";
import PropTypes from "prop-types";
import ModalContentBody from "@boomerang/boomerang-components/lib/ModalContentBody";
import ModalContentHeader from "@boomerang/boomerang-components/lib/ModalContentHeader";
import ModalContentFooter from "@boomerang/boomerang-components/lib/ModalContentFooter";
import ModalConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import cronstrue from "cronstrue";
import "./styles.scss";

export class CronJobContainer extends Component {
  static propTypes = {
    cronExpression: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = { cronExpression: this.props.cronExpression, error: {} };
  }

  //receives input value from TextInput
  validateCron = value => {
    try {
      cronstrue.toString(value); //just need to run it
    } catch (e) {
      console.log("we are in catch");
      return false;
    }
    return true;
  };

  onSave = () => {
    this.props.handleOnChange(this.state.cronExpression, {}, "cronString"); //BEN TODO: change this to pass back an object so it can be more understood what those values correspond to
    this.props.closeModal();
  };

  render() {
    return (
      <>
        <ModalContentHeader title="CRON Schedule" subtitle="" theme="bmrg-white" />
        <ModalContentBody style={{ maxWidth: "20rem", margin: "0 auto", alignItems: "center" }}>
          <TextInput
            required
            value={this.state.cronExpression}
            title="CRON Exrpession"
            placeholder="Enter a CRON Expression"
            name="cron"
            theme="bmrg-white"
            onChange={(value, error) => this.setState({ cronExpression: value, error })}
            validationFunction={this.validateCron} //pass validation function here
            validationText="Enter a valid CRON expression"
          />
        </ModalContentBody>
        <ModalContentFooter>
          <ModalConfirmButton
            onClick={this.onSave}
            text="SAVE"
            confirmModalProps={this.confirmModalProps}
            theme="bmrg-white"
            disabled={!this.state.cronExpression || Object.keys(this.state.error).length} //disable if there is no expression, or if the error object is not empty
          />
        </ModalContentFooter>
      </>
    );
  }
}
