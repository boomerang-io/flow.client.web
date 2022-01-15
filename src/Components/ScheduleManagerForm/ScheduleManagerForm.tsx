import React from "react";
import {
  Button,
  Creatable,
  CheckboxList,
  ComboBox,
  DynamicFormik,
  InlineLoading,
  ModalBody,
  ModalForm,
  ModalFooter,
  RadioButtonGroup,
  RadioButton,
  TextArea,
  TextInput,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { typeLabelMap } from "Features/Schedule";
import axios from "axios";
import cronstrue from "cronstrue";
import moment from "moment-timezone";
import * as Yup from "yup";
import { cronToDateTime } from "Utils/cronHelper";
import { DATETIME_LOCAL_INPUT_FORMAT, defaultTimeZone, timezoneOptions, transformTimeZone } from "Utils/dateHelper";
import { daysOfWeekCronList } from "Constants";
import { ComposedModalChildProps, ScheduleManagerFormInputs, ScheduleUnion } from "Types";
import { serviceUrl } from "Config/servicesConfig";
import styles from "./ScheduleManagerForm.module.scss";

interface CreateEditFormProps {
  handleSubmit: (args: ScheduleManagerFormInputs) => void;
  isLoading: boolean;
  modalProps: ComposedModalChildProps;
  parameters?: { [k: string]: any };
  type: "create" | "edit";
  schedule?: ScheduleUnion;
}

export default function CreateEditForm(props: CreateEditFormProps) {
  let initFormValues: Partial<ScheduleManagerFormInputs> = {
    id: props.schedule?.name,
    name: props.schedule?.name ?? "",
    description: props.schedule?.description ?? "",
    type: props.schedule?.type || "runOnce",
    timezone: transformTimeZone(defaultTimeZone),
    days: [],
    labels: [],
    ...props.schedule?.parameters,
  };

  /**
   * Handle creating it from calendar click
   */
  if (props.type === "create" && props.schedule && props.schedule.type === "runOnce") {
    initFormValues["dateTime"] = moment(props.schedule.dateSchedule).format(DATETIME_LOCAL_INPUT_FORMAT);
  }

  /**
   * Lots of manipulating of data for the inputs based on type
   */
  if (props.type === "edit" && props.schedule) {
    initFormValues["timezone"] = transformTimeZone(props.schedule.timezone);

    if (props.schedule.type === "runOnce") {
      initFormValues["dateTime"] = moment(props.schedule.dateSchedule).format(DATETIME_LOCAL_INPUT_FORMAT);
    }

    if (props.schedule.type === "advancedCron") {
      initFormValues["cronSchedule"] = props.schedule.cronSchedule;
    }

    if (props.schedule.type === "cron") {
      const cronSchedule = props.schedule.cronSchedule;
      const cronToData = cronToDateTime(Boolean(cronSchedule), cronSchedule);
      const { cronTime, selectedDays } = cronToData;

      let activeDays: string[] = [];
      Object.entries(selectedDays).forEach(([key, value]) => {
        if (value) {
          activeDays.push(key);
        }
      });

      initFormValues["time"] = cronTime;
      initFormValues["days"] = activeDays;
    }

    let scheduleLabels: Array<string> = [];
    if (props.schedule.labels?.length) {
      for (let labelObj of props.schedule.labels) {
        const scheduleLabel = `${labelObj.key}:${labelObj.value}`;
        scheduleLabels.push(scheduleLabel);
      }
      initFormValues["labels"] = scheduleLabels;
    }
  }

  return (
    <DynamicFormik
      validateOnMount
      initialValues={initFormValues}
      inputs={props.parameters}
      onSubmit={async (args: ScheduleManagerFormInputs) => {
        await props.handleSubmit(args);
        props.modalProps.closeModal();
      }}
      validationSchemaExtension={Yup.object().shape({
        name: Yup.string().required("Name is required"),
        description: Yup.string(),
        type: Yup.string().required("Enter a type"),
        dateTime: Yup.string()
          .when("type", {
            is: "runOnce",
            then: Yup.string().required("Date and Time is required"),
          })
          .test("isAfterNow", "Enter a date and time after now", (value: string | undefined) => {
            return moment(value).isAfter(new Date());
          }),
        labels: Yup.array(),
        cronSchedule: Yup.string().when("type", {
          is: "advancedCron",
          then: Yup.string().required("Expression required"),
        }),
        days: Yup.array().when("type", {
          is: "cron",
          then: Yup.array().min(1, "Enter at least one day"),
        }),
        time: Yup.string().when("type", { is: "cron", then: (time: any) => time.required("Enter a time") }),
        timezone: Yup.object().shape({ label: Yup.string(), value: Yup.string() }),
      })}
    >
      {({ inputs, formikProps }: any) => (
        <ModalForm noValidate onSubmit={formikProps.handleSubmit}>
          <ModalBody>
            <p>
              <b>About</b>
            </p>
            <TextInput
              labelText="Name"
              id="name"
              onBlur={formikProps.handleBlur}
              onChange={formikProps.handleChange}
              invalid={formikProps.errors.name && formikProps.touched.name}
              invalidText={formikProps.errors.name}
              placeholder="e.g. Daily task"
              value={formikProps.values.name}
            />
            <TextArea
              labelText="Description (optional)"
              id="description"
              placeholder="e.g. Runs very important daily task."
              onBlur={formikProps.handleBlur}
              onChange={formikProps.handleChange}
              invalid={formikProps.errors.description && formikProps.touched.description}
              invalidText={formikProps.errors.description}
              value={formikProps.values.description}
            />
            <Creatable
              createKeyValuePair
              keyLabelText="Label key"
              keyPlaceholder="level"
              valueLabelText="Label value"
              valuePlaceholder="important"
              value={formikProps.values.labels}
              onChange={(labels: string) => formikProps.setFieldValue("labels", labels)}
            />
            <p>
              <b>Schedule</b>
            </p>
            <section>
              <p>What type of Schedule do you want to create?</p>
              <RadioButtonGroup
                id="type"
                labelPosition="right"
                name="type"
                onChange={(type: string) => formikProps.setFieldValue("type", type)}
                orientation="horizontal"
                valueSelected={formikProps.values["type"]}
              >
                <RadioButton key={"runOnce"} id={"runOnce"} labelText={typeLabelMap["runOnce"]} value={"runOnce"} />
                <RadioButton key={"cron"} id={"cron"} labelText={typeLabelMap["cron"]} value={"cron"} />
                <RadioButton
                  key={"advanced-cron"}
                  id={"advanced-cron"}
                  labelText={typeLabelMap["advancedCron"]}
                  value={"advancedCron"}
                />
              </RadioButtonGroup>
            </section>
            {formikProps.values["type"] === "runOnce" ? (
              <>
                <div style={{ width: "23.5rem" }}>
                  <TextInput
                    type="datetime-local"
                    labelText="Date and Time"
                    id="dateTime"
                    name="dateTime"
                    onBlur={formikProps.handleBlur}
                    onChange={formikProps.handleChange}
                    invalid={formikProps.errors.dateTime && formikProps.touched.dateTime}
                    invalidText={formikProps.errors.dateTime}
                    value={formikProps.values.dateTime}
                    min={moment().format(DATETIME_LOCAL_INPUT_FORMAT)}
                  />
                </div>
                <div style={{ width: "23.5rem" }}>
                  <ComboBox
                    id="timezone"
                    initialSelectedItem={formikProps.values.timezone}
                    //@ts-ignore
                    items={timezoneOptions}
                    onChange={({ selectedItem }: { selectedItem: { label: string; value: string } }) => {
                      const item = selectedItem ?? { label: "", value: "" };
                      formikProps.setFieldValue("timezone", item);
                    }}
                    placeholder="e.g. US/Central (UTC -06:00)"
                    titleText="Time Zone"
                  />
                </div>
              </>
            ) : (
              <CronJobConfig formikProps={formikProps} timezoneOptions={timezoneOptions} />
            )}
            {inputs.length ? (
              <>
                <p>
                  <b>Workflow Parameters</b>
                </p>
                {inputs}
              </>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button kind="secondary" onClick={props.modalProps.closeModal}>
              Cancel
            </Button>
            <Button disabled={!formikProps.isValid || props.isLoading} type="submit">
              {props.type === "create" ? "Create" : "Update"}
            </Button>
          </ModalFooter>
        </ModalForm>
      )}
    </DynamicFormik>
  );
}

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

class CronJobConfig extends React.Component<Props, State> {
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
