import React, { Component } from "react";
import PropTypes from "prop-types";
import ModalContentBody from "@boomerang/boomerang-components/lib/ModalContentBody";
import ModalContentHeader from "@boomerang/boomerang-components/lib/ModalContentHeader";
import ModalContentFooter from "@boomerang/boomerang-components/lib/ModalContentFooter";
import ModalConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import cronstrue from "cronstrue";
import "./styles.scss";

export default class CronJobModal extends Component {
  static propTypes = {
    cronExpression: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      cronExpression: props.cronExpression,
      inputError: {},
      errorMessage: undefined,
      message: props.cronExpression ? cronstrue.toString(props.cronExpression) : undefined
    };
  }

  handleOnChange = (value, error) => {
    this.setState({ cronExpression: value, inputError: error });
  };

  //receives input value from TextInput
  validateCron = value => {
    try {
      const message = cronstrue.toString(value); //just need to run it
      this.setState({ message, errorMessage: undefined });
    } catch (e) {
      this.setState({ message: undefined, errorMessage: e.slice(7) });
      return false;
    }
    return true;
  };

  handleOnSave = () => {
    this.props.handleOnChange(this.state.cronExpression, {}, "cronString"); //BEN TODO: change this to pass back an object so it can be more understood what those values correspond to
    this.props.closeModal();
  };

  render() {
    const { cronExpression, inputError, errorMessage, message } = this.state;
    return (
      <>
        <ModalContentHeader title="CRON Schedule" subtitle="" theme="bmrg-white" />
        <ModalContentBody style={{ maxWidth: "20rem", margin: "0 auto", flexDirection: "column" }}>
          <fieldset className="b-cron-fieldset">
            <TextInput
              required
              value={cronExpression}
              title="CRON Expression"
              placeholder="Enter a CRON Expression"
              name="cron"
              theme="bmrg-white"
              onChange={this.handleOnChange}
              validationFunction={this.validateCron} //pass validation function here
              style={{ paddingBottom: "1rem" }}
            />
            {
              // check for cronExpression being present for both bc validation function doesn't always run and state is stale
            }
            {cronExpression && errorMessage && <div className="b-cron-fieldset__message --error">{errorMessage}</div>}
            {cronExpression && message && <div className="b-cron-fieldset__message">{message}</div>}
          </fieldset>
        </ModalContentBody>
        <ModalContentFooter>
          <ModalConfirmButton
            onClick={this.handleOnSave}
            text="SAVE"
            confirmModalProps={this.confirmModalProps}
            theme="bmrg-white"
            disabled={!cronExpression || !!Object.keys(inputError).length} //disable if there is no expression, or if the error object is not empty
          />
        </ModalContentFooter>
      </>
    );
  }
}
