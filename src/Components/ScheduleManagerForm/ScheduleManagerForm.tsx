import React from "react";
import { useAppContext } from "Hooks";
import {
  Button,
  Creatable,
  CheckboxList,
  ComboBox,
  DynamicFormik,
  InlineNotification,
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
import { cronToDateTime, daysOfWeekCronList } from "Utils/cronHelper";
import { DATETIME_LOCAL_INPUT_FORMAT, defaultTimeZone, timezoneOptions, transformTimeZone } from "Utils/dateHelper";
import {
  ComposedModalChildProps,
  DataDrivenInput,
  DayOfWeekKey,
  FlowTeam,
  ScheduleManagerFormInputs,
  ScheduleUnion,
  WorkflowSummary,
} from "Types";
import { serviceUrl } from "Config/servicesConfig";
import styles from "./ScheduleManagerForm.module.scss";

interface CreateEditFormProps {
  handleSubmit: (args: ScheduleManagerFormInputs) => void;
  includeWorkflowDropdown?: boolean;
  isError: boolean;
  isLoading: boolean;
  modalProps: ComposedModalChildProps;
  schedule?: ScheduleUnion;
  type: "create" | "edit";
  workflow?: WorkflowSummary;
  workflowOptions?: Array<WorkflowSummary>;
}

export default function CreateEditForm(props: CreateEditFormProps) {
  const { teams } = useAppContext();

  const [workflowProperties, setWorkflowProperties] = React.useState<Array<DataDrivenInput> | undefined>(
    props.workflow?.properties
  );
  let initFormValues: Partial<ScheduleManagerFormInputs> = {
    id: props.schedule?.id,
    name: props.schedule?.name ?? "",
    dateTime: "",
    description: props.schedule?.description ?? "",
    type: props.schedule?.type || "runOnce",
    timezone: transformTimeZone(defaultTimeZone),
    workflow: props.workflow,
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
    initFormValues["workflow"] = props.workflow;

    if (props.schedule.type === "runOnce") {
      initFormValues["dateTime"] = moment(props.schedule.dateSchedule).format(DATETIME_LOCAL_INPUT_FORMAT);
    }

    if (props.schedule.type === "advancedCron") {
      initFormValues["cronSchedule"] = props.schedule.cronSchedule;
    }

    if (props.schedule.type === "cron") {
      const cronSchedule = props.schedule.cronSchedule;
      const cronToData = cronToDateTime(Boolean(cronSchedule), cronSchedule);
      const {
        cronTime,
        selectedDays,
      }: { cronTime: string; selectedDays: { [day in DayOfWeekKey]: boolean } } = cronToData;

      let activeDays: DayOfWeekKey[] = [];
      for (let entry in selectedDays) {
        const day = entry as DayOfWeekKey;
        const value = selectedDays[day];
        if (value) {
          activeDays.push(day);
        }
      }
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
      enableReinitialize
      validateOnMount
      initialValues={initFormValues}
      inputs={workflowProperties ?? []}
      onSubmit={async (args: ScheduleManagerFormInputs) => {
        try {
          await props.handleSubmit(args);
          props.modalProps.closeModal();
        } catch (e) {
          //no-op
        }
      }}
      validationSchemaExtension={Yup.object().shape({
        name: Yup.string().required("Name is required").max(200, "Enter less than 200 characters"),
        description: Yup.string().max(500, "Enter less than 500 characters"),
        type: Yup.string().required("Enter a type"),
        dateTime: Yup.string().when("type", {
          is: "runOnce",
          then: Yup.string()
            .required("Date and Time are required")
            .test("isAfterNow", "Enter a date and time after now", (value: string | undefined) => {
              return moment(value).isAfter(new Date());
            }),
        }),
        labels: Yup.array().max(20, "Enter less than 20 labels"),
        cronSchedule: Yup.string().when("type", {
          is: "advancedCron",
          then: Yup.string()
            .required("Cron Expression is required")
            .test({
              name: "isValidCron",
              test: async (value: string | undefined, { createError, path }) => {
                const response = await axios.get(serviceUrl.getScheduleCronValidation({ expression: value }));
                if (response.data.valid) {
                  return true;
                } else {
                  return createError({
                    path,
                    message:
                      response.data.message ??
                      "Cron Expression is invalid and couldn't be converted. Please, try again.",
                  });
                }
              },
            }),
        }),
        days: Yup.array().when("type", {
          is: "cron",
          then: Yup.array().min(1, "At least one day is required"),
        }),
        time: Yup.string().when("type", { is: "cron", then: Yup.string().required("Time is required") }),
        timezone: Yup.object().shape({ label: Yup.string(), value: Yup.string() }),
      })}
    >
      {({ inputs, formikProps }: any) => (
        <ModalForm noValidate onSubmit={formikProps.handleSubmit}>
          <ModalBody>
            <p>
              <b>About</b>
            </p>
            {props.includeWorkflowDropdown && (
              <ComboBox
                helperText="Workflow for this Schedule to execute"
                id="workflow"
                initialSelectedItem={formikProps.values.workflow}
                items={props.workflowOptions}
                itemToString={(workflow: WorkflowSummary) => {
                  const team = workflow ? teams.find((team: FlowTeam) => team.id === workflow.flowTeamId) : undefined;
                  return workflow ? (team ? `${workflow.name} [${team.name}]` : workflow.name) : "";
                }}
                onChange={({ selectedItem }: { selectedItem: WorkflowSummary }) => {
                  formikProps.setFieldValue("workflow", selectedItem);
                  if (selectedItem?.id) {
                    setWorkflowProperties(selectedItem.properties);
                  }
                }}
                placeholder="e.g. Number 1 Workflow"
                titleText="Workflow"
              />
            )}
            <TextInput
              id="name"
              invalidText={formikProps.errors.name}
              invalid={formikProps.errors.name && formikProps.touched.name}
              labelText="Name"
              onBlur={formikProps.handleBlur}
              onChange={formikProps.handleChange}
              placeholder="e.g. Daily task"
              value={formikProps.values.name}
            />
            <TextArea
              id="description"
              invalid={formikProps.errors.description && formikProps.touched.description}
              invalidText={formikProps.errors.description}
              labelText="Description (optional)"
              onBlur={formikProps.handleBlur}
              onChange={formikProps.handleChange}
              placeholder="e.g. Runs very important daily task."
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
                  id={"advanced-cron"}
                  key={"advanced-cron"}
                  labelText={typeLabelMap["advancedCron"]}
                  value={"advancedCron"}
                />
              </RadioButtonGroup>
            </section>
            {formikProps.values["type"] === "runOnce" ? (
              <>
                <div style={{ width: "23.5rem" }}>
                  <TextInput
                    helperText="When you want it to execute"
                    id="dateTime"
                    invalid={formikProps.errors.dateTime && formikProps.touched.dateTime}
                    invalidText={formikProps.errors.dateTime}
                    labelText="Date and Time"
                    min={moment().format(DATETIME_LOCAL_INPUT_FORMAT)}
                    name="dateTime"
                    onBlur={formikProps.handleBlur}
                    onChange={formikProps.handleChange}
                    type="datetime-local"
                    value={formikProps.values.dateTime ?? ""}
                  />
                </div>
                <div style={{ width: "23.5rem" }}>
                  <ComboBox
                    helperText="What time zone do you want to use"
                    id="timezone"
                    initialSelectedItem={formikProps.values.timezone}
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

            <>
              <p>
                <b>Workflow Parameters</b>
              </p>
              {formikProps.values.workflow && inputs.length ? (
                inputs
              ) : (
                <div>No parameters to configure for this Workflow</div>
              )}
            </>
            {props.isError && (
              <InlineNotification
                lowContrast
                kind="error"
                title="Something's Wrong"
                subtitle={`Request to ${props.type} Schedule failed`}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button kind="secondary" onClick={props.modalProps.closeModal}>
              Cancel
            </Button>
            <Button disabled={!formikProps.isValid || props.isLoading} type="submit">
              {props.isError ? "Try again" : props.type === "create" ? "Create" : "Update"}
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

  validateCron = async (value: string) => {
    try {
      const message = cronstrue.toString(value); //just need to run it
      this.setState({ message });
    } catch (e) {
      this.setState({ message: undefined });
    }
  };

  handleCheckboxListChange = (setFieldValue: (id: string, value: any) => void, ...args: any) => {
    const currDays = args[args.length - 1];
    setFieldValue("days", currDays);
  };

  render() {
    const { values, touched, errors, handleBlur, handleChange, setFieldValue } = this.props.formikProps;

    return (
      <>
        {values.type === "advancedCron" ? (
          <>
            <div className={styles.cronContainer}>
              <div className={styles.inputContainer}>
                <TextInput
                  helperText={this.state.message}
                  id="cronSchedule"
                  invalid={(errors.cronSchedule || this.state.errorMessage) && touched.cronSchedule}
                  invalidText={this.state.errorMessage || errors.cronSchedule}
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
              </div>
            </div>
            <div className={styles.timezone}>
              <ComboBox
                helperText="What time zone do you want to use"
                id="timezone"
                initialSelectedItem={values.timezone}
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
