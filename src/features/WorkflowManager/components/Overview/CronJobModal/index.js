import React, { Component } from "react";
import PropTypes from "prop-types";
import cronstrue from "cronstrue";
import moment from "moment-timezone";
import { Formik } from "formik";
import * as Yup from "yup";
import { ComboBox, TextInput, ModalFlowForm } from "@boomerang/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter } from "carbon-components-react";
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
      errorMessage: undefined,
      message: props.cronExpression ? cronstrue.toString(props.cronExpression) : cronstrue.toString("0 18 * * *"),
      defaultTimeZone: moment.tz.guess()
    };

    this.timezoneOptions = moment.tz
      .names()
      .filter(tz => !exludedTimezones.includes(tz))
      .map(element => this.transformTimeZone(element));
  }

  handleOnChange = (e, handleChange) => {
    this.props.setShouldConfirmModalClose(true);
    this.validateCron(e.target.value);
    handleChange(e);
  };

  handleTimeChange = (selectedItem, id, setFieldValue) => {
    this.props.setShouldConfirmModalClose(true);
    setFieldValue(id, selectedItem);
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

  // transform timeZone in { label, value } object
  transformTimeZone = timeZone => {
    return { label: `${timeZone} (UTC ${moment.tz(timeZone).format("Z")})`, value: timeZone };
  };

  handleOnSave = (e, values) => {
    e.preventDefault();
    this.props.handleOnChange(values.cronExpression, "schedule");
    this.props.handleOnChange(values.timeZone.value ? values.timeZone.value : this.state.defaultTimeZone, "timezone");
    this.props.forceCloseModal();
  };

  render() {
    const { defaultTimeZone, errorMessage, message } = this.state;
    const { cronExpression, timeZone } = this.props;

    return (
      <Formik
        initialValues={{
          cronExpression: cronExpression || "0 18 * * *",
          timeZone: timeZone ? this.transformTimeZone(timeZone) : this.transformTimeZone(defaultTimeZone)
        }}
        validationSchema={Yup.object().shape({
          cronExpression: Yup.string().required(),
          timeZone: Yup.object().shape({ label: Yup.string(), value: Yup.string() })
        })}
        onSubmit={this.handleOnSave}
        isInitialValid
      >
        {formikProps => {
          const { values, touched, errors, handleBlur, handleChange, setFieldValue, isValid } = formikProps;

          return (
            <ModalFlowForm>
              <ModalBody style={{ maxWidth: "40rem", margin: "0 2rem", flexDirection: "column", overflow: "visible" }}>
                <div className="b-cron-fieldset">
                  <div className="b-cron">
                    <TextInput
                      id="cronExpression"
                      labelText="CRON Expression"
                      value={values.cronExpression}
                      placeholder="Enter a CRON Expression"
                      onBlur={handleBlur}
                      onChange={e => this.handleOnChange(e, handleChange)}
                      invalid={(errors.cronExpression || errorMessage) && touched.cronExpression}
                      invalidText={errorMessage}
                    />
                    {
                      // check for cronExpression being present for both b/c validation function doesn't always run and state is stale
                    }
                    {values.cronExpression && message && <div className="b-cron-fieldset__message">{message}</div>}
                  </div>
                  <div className="b-timezone">
                    <ComboBox
                      id="timeZone"
                      items={this.timezoneOptions}
                      initialSelectedItem={values.timeZone}
                      onChange={({ selectedItem }) =>
                        this.handleTimeChange(
                          selectedItem !== null ? selectedItem : { label: "", value: "" },
                          "timeZone",
                          setFieldValue
                        )
                      }
                      titleText="Timezone"
                      placeholder="Timezone"
                      tooltipContent="We make an educated guess at your timezone as a default value"
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter style={{ bottom: "0", position: "absolute", width: "100%" }}>
                <Button kind="secondary" type="button" onClick={this.props.closeModal}>
                  Cancel
                </Button>
                <Button
                  disabled={!isValid || errorMessage} //disable if the form is invalid or if there is an error message
                  type="submit"
                  onClick={e => {
                    this.handleOnSave(e, values);
                  }}
                >
                  Save
                </Button>
              </ModalFooter>
            </ModalFlowForm>
          );
        }}
      </Formik>
    );
  }
}
