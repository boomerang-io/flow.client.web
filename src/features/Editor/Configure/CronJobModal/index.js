import React, { Component } from "react";
import PropTypes from "prop-types";
import cronstrue from "cronstrue";
import moment from "moment-timezone";
import { Formik } from "formik";
import * as Yup from "yup";
import { CheckboxList, ComboBox, TextInput, ModalFlowForm, Toggle } from "@boomerang/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter } from "@boomerang/carbon-addons-boomerang-react";
import { cronToDateTime } from "Utilities/cronHelper";
import DAYS_OF_WEEK from "Constants/daysOfWeek";
import cronDayNumberMap from "Constants/cronDayNumberMap";
import styles from "./cronJobModal.module.scss";

//Timezones that don't have a match in Java and can't be saved via the service
const exludedTimezones = ["GMT+0", "GMT-0", "ROC"];

export default class CronJobModal extends Component {
  static propTypes = {
    advancedCron: PropTypes.bool,
    closeModal: PropTypes.func,
    cronExpression: PropTypes.string,
    handleOnChange: PropTypes.func.isRequired,
    setShouldConfirmModalClose: PropTypes.func,
    timeZone: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: undefined,
      message: props.cronExpression ? cronstrue.toString(props.cronExpression) : cronstrue.toString("0 18 * * *"),
      defaultTimeZone: moment.tz.guess(),
    };

    this.timezoneOptions = moment.tz
      .names()
      .filter((tz) => !exludedTimezones.includes(tz))
      .map((element) => this.transformTimeZone(element));
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
  validateCron = (value) => {
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
  transformTimeZone = (timeZone) => {
    return { label: `${timeZone} (UTC ${moment.tz(timeZone).format("Z")})`, value: timeZone };
  };

  handleOnSave = (e, values) => {
    e.preventDefault();
    const scheduleValue = values.advancedCron ? values.cronExpression : this.handleSchedule(values);
    this.props.handleOnChange(values.advancedCron, "triggers.scheduler.advancedCron");
    this.props.handleOnChange(scheduleValue, "triggers.scheduler.schedule");
    this.props.handleOnChange(
      values.timeZone.value ? values.timeZone.value : this.state.defaultTimeZone,
      "triggers.scheduler.timezone"
    );
    this.props.forceCloseModal();
  };

  handleSchedule = (values) => {
    let daysCron = [];
    Object.values(values.days).forEach((day) => {
      daysCron.push(cronDayNumberMap[day]);
    });
    const timeCron = !values.time ? ["0", "0"] : values.time.split(":");
    const cronExpression = `0 ${timeCron[1]} ${timeCron[0]} ? * ${daysCron.length !== 0 ? daysCron.toString() : "*"}`;
    return cronExpression;
  };

  handleCheckboxListChange = (setFieldValue, ...args) => {
    const currDays = args[args.length - 1];
    setFieldValue("days", currDays);
  };

  render() {
    const { defaultTimeZone, errorMessage, message } = this.state;
    const { cronExpression, timeZone, advancedCron } = this.props;
    const cronToData = cronToDateTime(!!cronExpression, cronExpression ? cronExpression : undefined);
    const { cronTime, selectedDays } = cronToData;

    let activeDays = [];
    Object.entries(selectedDays).forEach(([key, value]) => {
      if (value) {
        activeDays.push(key);
      }
    });

    return (
      <Formik
        initialValues={{
          cronExpression: cronExpression || "0 18 * * *",
          advancedCron: !!advancedCron,
          days: activeDays,
          time: cronTime || "18:00",
          timeZone: timeZone ? this.transformTimeZone(timeZone) : this.transformTimeZone(defaultTimeZone),
        }}
        validationSchema={Yup.object().shape({
          cronExpression: Yup.string().when("advancedCron", {
            is: true,
            then: (cron) => cron.required("Expression required"),
          }),
          advancedCron: Yup.bool(),
          days: Yup.array(),
          time: Yup.string().when("advancedCron", { is: false, then: (time) => time.required("Enter a time") }),
          timeZone: Yup.object().shape({ label: Yup.string(), value: Yup.string() }),
        })}
        onSubmit={this.handleOnSave}
        isInitialValid
      >
        {(formikProps) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            isValid,
          } = formikProps;

          return (
            <ModalFlowForm onSubmit={handleSubmit}>
              <ModalBody>
                <>
                  <div className={styles.advancedCronToggle}>
                    <Toggle
                      reversed
                      id="advancedCron"
                      labelText="Advanced controls"
                      name="advancedCron"
                      onToggle={(value) => setFieldValue("advancedCron", value)}
                      toggled={values.advancedCron}
                    />
                  </div>
                  {values.advancedCron ? (
                    <>
                      <p className={styles.configureText}>Configure a CRON schedule for this Workflow</p>
                      <div className={styles.cronContainer}>
                        <TextInput
                          id="cronExpression"
                          invalid={(errors.cronExpression || errorMessage) && touched.cronExpression}
                          invalidText={errorMessage}
                          labelText="CRON Expression"
                          onBlur={handleBlur}
                          onChange={(e) => this.handleOnChange(e, handleChange)}
                          placeholder="Enter a CRON Expression"
                          value={values.cronExpression}
                        />
                        {
                          // check for cronExpression being present for both b/c validation function doesn't always run and state is stale
                        }
                        {values.cronExpression && message && <div className={styles.cronMessage}>{message}</div>}
                      </div>
                      <div className={styles.timezone}>
                        <ComboBox
                          id="timeZone"
                          initialSelectedItem={values.timeZone}
                          items={this.timezoneOptions}
                          onChange={({ selectedItem }) =>
                            this.handleTimeChange(
                              selectedItem !== null ? selectedItem : { label: "", value: "" },
                              "timeZone",
                              setFieldValue
                            )
                          }
                          placeholder="Timezone"
                          titleText="Timezone"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.cronAdvancedContainer}>
                        <div className={styles.timeContainer}>
                          <TextInput
                            id="time"
                            data-testid="time"
                            invalid={errors.time && touched.time}
                            invalidText={errors.time}
                            labelText={"Choose a time"}
                            name="time"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Time"
                            style={{ minWidth: "10rem" }}
                            type="time"
                            value={values.time}
                          />
                          <div className={styles.timezone}>
                            <ComboBox
                              id="timeZone"
                              initialSelectedItem={values.timeZone}
                              items={this.timezoneOptions}
                              onChange={({ selectedItem }) =>
                                this.handleTimeChange(
                                  selectedItem !== null ? selectedItem : { label: "", value: "" },
                                  "timeZone",
                                  setFieldValue
                                )
                              }
                              placeholder="Timezone"
                              titleText={null}
                            />
                          </div>
                        </div>
                        <div className={styles.daysContainer}>
                          <CheckboxList
                            initialSelectedItems={values.days}
                            labelText="Choose day(s)"
                            options={DAYS_OF_WEEK}
                            onChange={(...args) => this.handleCheckboxListChange(setFieldValue, ...args)}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </>
              </ModalBody>
              <ModalFooter style={{ bottom: "0", position: "absolute", width: "100%" }}>
                <Button kind="secondary" type="button" onClick={this.props.closeModal}>
                  Cancel
                </Button>
                <Button
                  disabled={!isValid || (errorMessage && values.advancedCron)} //disable if the form is invalid or if there is an error message
                  type="submit"
                  onClick={(e) => {
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
