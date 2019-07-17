import React, { Component } from "react";
import PropTypes from "prop-types";
import cronstrue from "cronstrue";
import moment from "moment-timezone";
import ModalContentBody from "@boomerang/boomerang-components/lib/ModalContentBody";
import ModalContentHeader from "@boomerang/boomerang-components/lib/ModalContentHeader";
import ModalContentFooter from "@boomerang/boomerang-components/lib/ModalContentFooter";
import ModalConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import SelectDropdown from "@boomerang/boomerang-components/lib/SelectDropdown";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import ToolTip from "@boomerang/boomerang-components/lib/Tooltip";
import infoIcon from "../assets/info.svg";
import "./styles.scss";

//Timezones that don't have a match in Java and can't be saved via the service
const exludedTimezones = ["GMT+0", "GMT-0", "ROC"];

export default class CronJobModal extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    timeZone: PropTypes.object,
    cronExpression: PropTypes.string,
    handleOnChange: PropTypes.func.isRequired,
    shouldConfirmExit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      cronExpression: props.cronExpression || "0 18 * * *",
      timeZone: props.timeZone || moment.tz.guess(),
      inputError: {},
      errorMessage: undefined,
      message: props.cronExpression ? cronstrue.toString(props.cronExpression) : cronstrue.toString("0 18 * * *"),
      defaultTimeZone: moment.tz.guess()
    };

    this.timezoneOptions = moment.tz
      .names()
      .filter(tz => !exludedTimezones.includes(tz))
      .map(element => ({
        label: `${element} (UTC ${moment.tz(element).format("Z")})`,
        value: element
      }));
  }

  handleOnChange = (value, error) => {
    this.setState({ cronExpression: value, inputError: error }, () => this.props.shouldConfirmExit(true));
  };

  handleTimeChange = (value, error) => {
    this.setState({ timeZone: value }, () => this.props.shouldConfirmExit(true));
  };

  //receives input value from TextInput
  validateCron = value => {
    if (value === "1 1 1 1 1" || value === "* * * * *") {
      this.setState({ message: undefined, errorMessage: `Expression ${value} is not allowed for Boomerang Flow` });
      return false;
    }
    try {
      const message = cronstrue.toString(value); //just need to run it
      this.setState({ message, errorMessage: undefined });
    } catch (e) {
      this.setState({ message: undefined, errorMessage: e.slice(7) });
      return false;
    }
    return true;
  };

  handleOnSave = e => {
    e.preventDefault();
    this.props.handleOnChange(this.state.cronExpression, "schedule");
    this.props.handleOnChange(
      this.state.timeZone.value ? this.state.timeZone.value : this.state.defaultTimeZone,
      "timezone"
    );
    this.props.closeModal();
  };

  render() {
    const { cronExpression, inputError, errorMessage, message, timeZone } = this.state;
    return (
      <form onSubmit={this.handleOnSave}>
        <ModalContentHeader title="CRON Schedule" subtitle="" theme="bmrg-white" />
        <ModalContentBody style={{ maxWidth: "25rem", margin: "0 auto", flexDirection: "column", overflow: "visible" }}>
          <div className="b-cron-fieldset">
            <div className="b-cron">
              <TextInput
                alwaysShowTitle
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
                // check for cronExpression being present for both b/c validation function doesn't always run and state is stale
              }
              {cronExpression && errorMessage && <div className="b-cron-fieldset__message --error">{errorMessage}</div>}
              {cronExpression && message && <div className="b-cron-fieldset__message">{message}</div>}
            </div>
            <div className="b-timezone">
              <SelectDropdown
                options={this.timezoneOptions}
                theme="bmrg-white"
                value={timeZone}
                onChange={this.handleTimeChange}
                isCreatable={false}
                title="Timezone"
                style={{ width: "100%" }}
                noResultsText="No timezones found"
              />
              <img
                className="b-cronModal__infoIcon"
                src={infoIcon}
                data-tip
                data-for={"b-cronModal__infoIcon"}
                alt="Show/Hide Token"
              />
              <ToolTip id="b-cronModal__infoIcon" place="bottom">
                We make an educated guess at your timezone as a default value
              </ToolTip>
            </div>
          </div>
        </ModalContentBody>
        <ModalContentFooter>
          <ModalConfirmButton
            text="SAVE"
            theme="bmrg-white"
            disabled={!cronExpression || !!Object.keys(inputError).length} //disable if there is no expression, or if the error object is not empty
            type="submit"
          />
        </ModalContentFooter>
      </form>
    );
  }
}
