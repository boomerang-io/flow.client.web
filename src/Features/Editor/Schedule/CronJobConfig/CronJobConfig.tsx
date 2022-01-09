import React, { Component } from "react";
import axios from "axios";
import cronstrue from "cronstrue";
import {
  Button,
  CheckboxList,
  ComboBox,
  TextInput,
  Toggle,
  InlineLoading,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { daysOfWeekCronList } from "Constants";
import { serviceUrl } from "Config/servicesConfig";
import { cronToDateTime } from "Utils/cronHelper";
import styles from "./CronJobConfig.module.scss";

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
  timezoneOptions?: Array<{ label: string; value: string }>;
  formikProps: any;
};

type State = {
  errorMessage?: string;
  message: string | undefined;
  isValidatingCron: boolean;
  hasValidated: boolean;
};

export default class CronJobModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      errorMessage: undefined,
      message: props.formikProps.values.cronSchedule
        ? cronstrue.toString(props.formikProps.values.cronSchedule)
        : cronstrue.toString("0 18 * * *"),
      isValidatingCron: false,
      hasValidated: true,
    };
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

  handleSchedule = (values: { days: Array<string>; time: string }) => {
    let daysCron: Array<string> | [] = [];
    Object.values(values.days).forEach((day) => {
      //@ts-ignore
      daysCron.push(cronDayNumberMap[day]);
    });
    const timeCron = !values.time ? ["0", "0"] : values.time.split(":");
    const cronSchedule = `0 ${timeCron[1]} ${timeCron[0]} ? * ${daysCron.length !== 0 ? daysCron.toString() : "*"}`;
    return cronSchedule;
  };

  handleCheckboxListChange = (setFieldValue: (id: string, value: any) => void, ...args: any) => {
    const currDays = args[args.length - 1];
    setFieldValue("days", currDays);
  };

  render() {
    const { errorMessage, message, isValidatingCron, hasValidated } = this.state;
    const { values, touched, errors, handleBlur, handleChange, setFieldValue } = this.props.formikProps;
    const { cronSchedule } = values;
    const cronToData = cronToDateTime(!!cronSchedule, cronSchedule ? cronSchedule : undefined);
    const { selectedDays } = cronToData;

    let activeDays: string[] = [];
    Object.entries(selectedDays).forEach(([key, value]) => {
      if (value) {
        activeDays.push(key);
      }
    });

    return (
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
          <div className={styles.container}>
            <div className={styles.cronContainer}>
              <div className={styles.inputContainer}>
                <TextInput
                  id="cronSchedule"
                  disabled={isValidatingCron}
                  invalid={(errors.cronSchedule || errorMessage) && touched.cronSchedule}
                  invalidText={errorMessage}
                  labelText="CRON Expression"
                  onChange={(e: any) => {
                    handleChange(e);
                    this.setState({ hasValidated: false });
                  }}
                  onBlur={handleBlur}
                  placeholder="Enter a CRON Expression"
                  value={values.cronSchedule}
                />
                {isValidatingCron ? (
                  <InlineLoading description="Checking..." />
                ) : (
                  <Button
                    onClick={() => this.validateCron(values.cronSchedule)}
                    disabled={Boolean(errors.cronSchedule) || hasValidated}
                    kind="ghost"
                    size="small"
                    className={styles.validityStatusComponent}
                  >
                    Validate expression
                  </Button>
                )}
              </div>
              {values.cronSchedule && message && <div className={styles.cronMessage}>{message}</div>}
            </div>
            <div className={styles.timezone}>
              <ComboBox
                id="timezone"
                initialSelectedItem={values.timezone}
                //@ts-ignore
                items={this.timezoneOptions}
                onChange={({ selectedItem }: { selectedItem: { label: string; value: string } }) =>
                  this.handleTimeChange(
                    selectedItem !== null ? selectedItem : { label: "", value: "" },
                    "timezone",
                    setFieldValue
                  )
                }
                placeholder="Timezone"
                titleText="Timezone"
              />
            </div>
          </div>
        ) : (
          <div className={styles.container}>
            <div className={styles.timeContainer}>
              <TextInput
                id="time"
                data-testid="time"
                invalid={errors.time && touched.time}
                invalidText={errors.time}
                labelText={"Time"}
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
                  id="timezone"
                  initialSelectedItem={values.timezone}
                  //@ts-ignore
                  items={this.timezoneOptions}
                  onChange={({ selectedItem }: { selectedItem: { label: string; value: string } }) =>
                    this.handleTimeChange(
                      selectedItem !== null ? selectedItem : { label: "", value: "" },
                      "timezone",
                      setFieldValue
                    )
                  }
                  placeholder="Time Zone"
                  titleText={"Time Zone"}
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
          </div>
        )}
      </>
    );
  }
}
