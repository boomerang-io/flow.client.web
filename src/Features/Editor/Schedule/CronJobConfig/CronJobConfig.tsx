import React, { Component } from "react";
import axios from "axios";
import cronstrue from "cronstrue";
import { CheckboxList, ComboBox, InlineLoading, TextInput } from "@boomerang-io/carbon-addons-boomerang-react";
import { daysOfWeekCronList } from "Constants";
import { serviceUrl } from "Config/servicesConfig";
import styles from "./CronJobConfig.module.scss";

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
      message: props.formikProps.values.cronSchedule && cronstrue.toString(props.formikProps.values.cronSchedule),
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

  handleCheckboxListChange = (setFieldValue: (id: string, value: any) => void, ...args: any) => {
    const currDays = args[args.length - 1];
    setFieldValue("days", currDays);
  };

  render() {
    const { errorMessage, message, isValidatingCron } = this.state;
    const { values, touched, errors, handleBlur, handleChange, setFieldValue } = this.props.formikProps;

    return (
      <>
        {values.type === "advancedCron" ? (
          <>
            <div className={styles.cronContainer}>
              <div className={styles.inputContainer}>
                <TextInput
                  id="cronSchedule"
                  invalid={(errors.cronSchedule || errorMessage) && touched.cronSchedule}
                  invalidText={errorMessage}
                  labelText="Cron Expression"
                  onChange={(e: any) => {
                    handleChange(e);
                    this.validateCron(e.target.value);
                  }}
                  onBlur={handleBlur}
                  placeholder="e.g. 0 18 * * *"
                  value={values.cronSchedule}
                  style={{ width: "23.5rem" }}
                />
                {isValidatingCron && <InlineLoading description="Checking..." />}
              </div>
              {values.cronSchedule && message && <div className={styles.cronMessage}>{message}</div>}
            </div>
            <div className={styles.timezone}>
              <ComboBox
                id="timezone"
                initialSelectedItem={values.timezone}
                //@ts-ignore
                items={this.props.timezoneOptions}
                onChange={({ selectedItem }: { selectedItem: { label: string; value: string } }) => {
                  const item = selectedItem ?? { label: "", value: "" };
                  this.props.formikProps.setFieldValue("timezone", item);
                }}
                placeholder="e.g. US/Central (UTC -06:00)"
                titleText="Time Zone"
              />
            </div>
          </>
        ) : (
          <div className={styles.container}>
            <TextInput
              id="time"
              invalid={errors.time && touched.time}
              invalidText={errors.time}
              labelText={"Time"}
              name="time"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="Time"
              style={{ width: "23.5rem" }}
              type="time"
              value={values.time}
            />
            <div className={styles.timezone}>
              <ComboBox
                id="timezone"
                initialSelectedItem={values.timezone}
                //@ts-ignore
                items={this.props.timezoneOptions}
                onChange={({ selectedItem }: { selectedItem: { label: string; value: string } }) => {
                  const item = selectedItem ?? { label: "", value: "" };
                  this.props.formikProps.setFieldValue("timezone", item);
                }}
                placeholder="e.g. US/Central (UTC -06:00)"
                titleText="Time Zone"
              />
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
