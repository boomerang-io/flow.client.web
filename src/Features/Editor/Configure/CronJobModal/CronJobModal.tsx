import React, { Component } from "react";
import axios from "axios";
import cronstrue from "cronstrue";
import moment from "moment-timezone";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  CheckboxList,
  ComboBox,
  TextInput,
  ModalFlowForm,
  Toggle,
  InlineLoading,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter } from "@boomerang-io/carbon-addons-boomerang-react";
import { daysOfWeekCronList } from "Constants";
import { serviceUrl } from "Config/servicesConfig";
import { cronToDateTime } from "Utils/cronHelper";
import styles from "./cronJobModal.module.scss";

//Timezones that don't have a match in Java and can't be saved via the service
const exludedTimezones = ["GMT+0", "GMT-0", "ROC"];

const cronDayNumberMap: { [key: string]: string } = {
  sunday: "SUN",
  monday: "MON",
  tuesday: "TUE",
  wednesday: "WED",
  thursday: "THU",
  friday: "FRI",
  saturday: "SAT",
};

type Props = {
  advancedCron?: boolean;
  closeModal: () => void;
  cronExpression?: string;
  handleOnChange: (id: string, item: any) => void;
  timeZone?: string | boolean;
  timezoneOptions?: any;
};

type State = {
  errorMessage?: string;
  message: string | undefined;
  defaultTimeZone: any;
  isValidatingCron: boolean;
  hasValidated: boolean;
};

export default class CronJobModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      errorMessage: undefined,
      message: props.cronExpression ? cronstrue.toString(props.cronExpression) : cronstrue.toString("0 18 * * *"),
      defaultTimeZone: moment.tz.guess(),
      isValidatingCron: false,
      hasValidated: true,
    };

    //@ts-ignore
    this.timezoneOptions = moment.tz
      .names()
      .filter((tz) => !exludedTimezones.includes(tz))
      .map((element) => this.transformTimeZone(element));
  }

  handleTimeChange = (selectedItem: any, id: string, setFieldValue: (id: string, item: any) => void) => {
    setFieldValue(id, selectedItem);
  };

  //receives input value from TextInput
  validateCron = async (value: string) => {
    try {
      this.setState({ isValidatingCron: true });
      const response = await axios.get(serviceUrl.getScheduleCronValidation({ expression: value }));
      if (response.data.valid) {
        const message = cronstrue.toString(value); //just need to run it
        this.setState({ message, errorMessage: undefined, hasValidated: true });
      } else {
        this.setState({
          message: undefined,
          errorMessage: response.data?.message ?? "Expression is invalid and couldn't be converted. Please, try again.",
        });
      }
    } catch (e) {
      this.setState({
        message: undefined,
        errorMessage: typeof e === "string" ? e.slice(7) : "Something went wrong",
        isValidatingCron: false,
      });
      return false;
    } finally {
      this.setState({ isValidatingCron: false });
    }
    return true;
  };

  // transform timeZone in { label, value } object
  transformTimeZone = (timeZone: string) => {
    return { label: `${timeZone} (UTC ${moment.tz(timeZone).format("Z")})`, value: timeZone };
  };

  handleOnSave = (e: any, values: any) => {
    e.preventDefault();
    const scheduleValue = values.advancedCron ? values.cronExpression : this.handleSchedule(values);
    this.props.handleOnChange(values.advancedCron, "triggers.scheduler.advancedCron");
    this.props.handleOnChange(scheduleValue, "triggers.scheduler.schedule");
    this.props.handleOnChange(
      values.timeZone.value ? values.timeZone.value : this.state.defaultTimeZone,
      "triggers.scheduler.timezone"
    );
    this.props.closeModal();
  };

  handleSchedule = (values: { days: Array<string>; time: string }) => {
    let daysCron: Array<string> | [] = [];
    Object.values(values.days).forEach((day) => {
      //@ts-ignore
      daysCron.push(cronDayNumberMap[day]);
    });
    const timeCron = !values.time ? ["0", "0"] : values.time.split(":");
    const cronExpression = `0 ${timeCron[1]} ${timeCron[0]} ? * ${daysCron.length !== 0 ? daysCron.toString() : "*"}`;
    return cronExpression;
  };

  handleCheckboxListChange = (setFieldValue: (id: string, value: any) => void, ...args: any) => {
    const currDays = args[args.length - 1];
    setFieldValue("days", currDays);
  };

  render() {
    const { defaultTimeZone, errorMessage, message, isValidatingCron, hasValidated } = this.state;
    const { cronExpression, timeZone, advancedCron } = this.props;
    const cronToData = cronToDateTime(!!cronExpression, cronExpression ? cronExpression : undefined);
    const { cronTime, selectedDays } = cronToData;
    const initialCron = "0 18 * * *";

    let activeDays: string[] = [];
    Object.entries(selectedDays).forEach(([key, value]) => {
      if (value) {
        activeDays.push(key);
      }
    });

    return (
      <Formik
        validateOnMount
        onSubmit={this.handleOnSave}
        initialValues={{
          cronExpression: cronExpression || initialCron,
          advancedCron: !!advancedCron,
          days: activeDays,
          time: cronTime || "18:00",
          timeZone:
            timeZone && typeof timeZone !== "boolean"
              ? this.transformTimeZone(timeZone)
              : this.transformTimeZone(defaultTimeZone),
        }}
        validationSchema={Yup.object().shape({
          cronExpression: Yup.string().when("advancedCron", {
            is: true,
            then: (cron: any) => cron.required("Expression required"),
          }),
          advancedCron: Yup.bool(),
          days: Yup.array(),
          time: Yup.string().when("advancedCron", { is: false, then: (time: any) => time.required("Enter a time") }),
          timeZone: Yup.object().shape({ label: Yup.string(), value: Yup.string() }),
        })}
      >
        {(formikProps) => {
          const {
            values,
            touched,
            errors,
            dirty: isDirty,
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
                      onToggle={(value: boolean) => setFieldValue("advancedCron", value)}
                      toggled={values.advancedCron}
                    />
                  </div>
                  {values.advancedCron ? (
                    <>
                      <p className={styles.configureText}>Configure a CRON schedule for this Workflow</p>
                      <div className={styles.cronContainer}>
                        <div className={styles.inputContainer}>
                          <TextInput
                            id="cronExpression"
                            disabled={isValidatingCron}
                            invalid={(errors.cronExpression || errorMessage) && touched.cronExpression}
                            invalidText={errorMessage}
                            labelText="CRON Expression"
                            onChange={(e: any) => {
                              handleChange(e);
                              this.setState({ hasValidated: false });
                            }}
                            onBlur={handleBlur}
                            placeholder="Enter a CRON Expression"
                            value={values.cronExpression}
                          />
                          {isValidatingCron ? (
                            <InlineLoading description="Checking..." />
                          ) : (
                            <Button
                              onClick={() => this.validateCron(values.cronExpression)}
                              disabled={Boolean(errors.cronExpression) || hasValidated}
                              kind="ghost"
                              size="small"
                              className={styles.validityStatusComponent}
                            >
                              Validate expression
                            </Button>
                          )}
                        </div>
                        {values.cronExpression && message && <div className={styles.cronMessage}>{message}</div>}
                      </div>
                      <div className={styles.timezone}>
                        <ComboBox
                          id="timeZone"
                          initialSelectedItem={values.timeZone}
                          //@ts-ignore
                          items={this.timezoneOptions}
                          onChange={({ selectedItem }: { selectedItem: { label: string; value: string } }) =>
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
                            //@ts-ignore
                            items={this.timezoneOptions}
                            onChange={({ selectedItem }: { selectedItem: { label: string; value: string } }) =>
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
                          options={daysOfWeekCronList}
                          onChange={(...args: any) => this.handleCheckboxListChange(setFieldValue, ...args)}
                        />
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
                  disabled={
                    !isValid ||
                    (errorMessage && values.advancedCron) ||
                    (!hasValidated && values.advancedCron) ||
                    !isDirty
                  } //disable if the form is invalid or if there is an error message
                  type="submit"
                  onClick={(e: React.MouseEvent) => {
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
