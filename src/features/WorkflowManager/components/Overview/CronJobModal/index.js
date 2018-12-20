import React, { Component } from "react";
import PropTypes from "prop-types";
import AlertModal from "@boomerang/boomerang-components/lib/AlertModal";
import ConfirmModal from "@boomerang/boomerang-components/lib/ConfirmModal";
import ModalContentBody from "@boomerang/boomerang-components/lib/ModalContentBody";
import ModalContentHeader from "@boomerang/boomerang-components/lib/ModalContentHeader";
import ModalContentFooter from "@boomerang/boomerang-components/lib/ModalContentFooter";
import ModalConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import SelectDropdown from "@boomerang/boomerang-components/lib/SelectDropdown";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import ToolTip from "@boomerang/boomerang-components/lib/Tooltip";
import cronstrue from "cronstrue";
import moment from "moment-timezone";
import infoIcon from "../assets/info.svg";
import "./styles.scss";

export default class CronJobModal extends Component {
  static propTypes = {
    cronExpression: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      cronExpression: props.cronExpression,
      timeZone: props.timeZone,
      inputError: {},
      errorMessage: undefined,
      message: props.cronExpression ? cronstrue.toString(props.cronExpression) : undefined,
      defaultTimeZone: moment.tz.guess()
    };
  }

  handleOnChange = (value, error) => {
    this.setState({ cronExpression: value, inputError: error }, () => this.props.shouldConfirmExit(true));
  };

  handleTimeChange = (value, error) => {
    this.setState({ timeZone: value }, () => this.props.shouldConfirmExit(true));
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
    this.props.handleOnChange(this.state.cronExpression, {}, "schedule");
    this.props.handleOnChange(
      this.state.timeZone.value ? this.state.timeZone.value : this.state.defaultTimeZone,
      {},
      "timezone"
    );
    this.props.closeModal();
  };

  render() {
    const { cronExpression, inputError, errorMessage, message, timeZone } = this.state;
    const exludedTimezones = ["GMT+0", "GMT-0", "ROC"];
    let subset = moment.tz.names().filter(tz => !exludedTimezones.includes(tz));
    const filteredSubset = [];
    subset.forEach(element => {
      filteredSubset.push({
        label: `${element} (UTC ${moment.tz(element).format("Z")})`,
        value: `${element}`,
        urlPath: "test",
        className: "bmrg--b-repos-dropdown__option"
      });
    });
    return (
      <>
        <ModalContentHeader title="CRON Schedule" subtitle="" theme="bmrg-white" />
        <ModalContentBody style={{ maxWidth: "25rem", margin: "0 auto", flexDirection: "column", overflow: "visible" }}>
          <fieldset className="b-cron-fieldset">
            <div className="b-cron">
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
            </div>
            <div className="b-timezone">
              <SelectDropdown
                options={filteredSubset}
                theme="bmrg-white"
                value={timeZone}
                onChange={this.handleTimeChange}
                isCreatable={false}
                title="Timezone"
                style={{ width: "100%" }}
              />
              <img
                className="b-cronModal__infoIcon"
                src={infoIcon}
                data-tip
                data-for={"b-cronModal__infoIcon"}
                alt="Show/Hide Token"
              />
              <ToolTip id="b-cronModal__infoIcon" theme="bmrg-white" place="bottom">
                we have guessed your timezone for a default value
              </ToolTip>
            </div>
          </fieldset>
        </ModalContentBody>
        <ModalContentFooter>
          <ModalConfirmButton
            onClick={this.handleOnSave}
            text="SAVE"
            theme="bmrg-white"
            disabled={!cronExpression || !!Object.keys(inputError).length} //disable if there is no expression, or if the error object is not empty
          />
        </ModalContentFooter>
      </>
    );
  }
}
