import React, { Component } from "react";
import axios from "axios";
import { History } from "history";
import { Formik, FormikProps } from "formik";
import {
  Button,
  ComboBox,
  ConfirmModal,
  ComposedModal,
  TextArea,
  TextInput,
  Toggle,
  notify,
  ToastNotification,
  TooltipHover,
  TooltipIcon,
} from "@boomerang-io/carbon-addons-boomerang-react";
import CronJobModal from "./CronJobModal";
import cx from "classnames";
import cronstrue from "cronstrue";
import CopyToClipboard from "react-copy-to-clipboard";
import capitalize from "lodash/capitalize";
import * as Yup from "yup";
import { appLink } from "Config/appConfig";
import { serviceUrl } from "Config/servicesConfig";
import { QueryStatus } from "Constants";
import { CopyFile16, EventSchedule16, Save24, ViewFilled16 } from "@carbon/icons-react";
import workflowIcons from "Assets/workflowIcons";
import { workflowSummary } from "../Editor";
import styles from "./configure.module.scss";

interface FormProps {
  description: string;
  enableACCIntegration: boolean;
  enablePersistentStorage: boolean;
  icon: string;
  name: string;
  shortDescription: string;
  triggers: {
    event: {
      enable: boolean;
      topic: string;
    };
    scheduler: {
      enable: boolean;
      schedule: string;
      timezone: boolean;
      advancedCron: boolean;
    };
    webhook: {
      enable: boolean;
      token: string;
    };
  };
  selectedTeam: { id: string };
}

interface ConfigureContainerProps {
  history: History;
  isOnRoute: boolean;
  params: { teamId: string; workflowId: string };
  workflowSummary: workflowSummary;
  summaryMutation: { status: string };
  teams: Array<{ id: string }>;
  updateSummary: ({ values, callback }: { values: object; callback: () => void }) => void;
}

const ConfigureContainer = React.memo<ConfigureContainerProps>(function ConfigureContainer({
  history,
  isOnRoute,
  params,
  workflowSummary,
  summaryMutation,
  teams,
  updateSummary,
}) {
  const handleOnSubmit = (values: { selectedTeam: { id: string } }) => {
    updateSummary({
      values,
      callback: () =>
        history.push(appLink.editorConfigure({ teamId: values.selectedTeam.id, workflowId: params.workflowId })),
    });
  };

  return (
    <Formik
      enableReinitialize
      onSubmit={handleOnSubmit}
      initialValues={{
        description: workflowSummary?.description ?? "",
        enableACCIntegration: workflowSummary?.enableACCIntegration ?? false,
        enablePersistentStorage: workflowSummary?.enablePersistentStorage ?? false,
        icon: workflowSummary?.icon ?? "",
        name: workflowSummary?.name ?? "",
        selectedTeam: teams.find((team) => team.id === params.teamId) ?? { id: "" },
        shortDescription: workflowSummary?.shortDescription ?? "",
        triggers: {
          event: {
            enable: workflowSummary?.triggers?.event?.enable ?? false,
            topic: workflowSummary?.triggers?.event?.topic ?? "",
          },
          scheduler: {
            enable: workflowSummary?.triggers?.scheduler?.enable ?? false,
            schedule: workflowSummary?.triggers?.scheduler?.schedule ?? "0 18 * * *",
            timezone: workflowSummary?.triggers?.scheduler?.timezone ?? false,
            advancedCron: workflowSummary?.triggers?.scheduler?.advancedCron ?? false,
          },
          webhook: {
            enable: workflowSummary?.triggers?.webhook?.enable ?? false,
            token: workflowSummary?.triggers?.webhook?.token ?? "",
          },
        },
      }}
      validationSchema={Yup.object().shape({
        description: Yup.string().max(250, "Description must not be greater than 250 characters"),
        enableACCIntegration: Yup.boolean(),
        enablePersistentStorage: Yup.boolean(),
        icon: Yup.string(),
        name: Yup.string().required("Name is required").max(64, "Name must not be greater than 64 characters"),
        selectedTeam: Yup.object().shape({ name: Yup.string().required("Team is required") }),
        shortDescription: Yup.string().max(128, "Summary must not be greater than 128 characters"),
        triggers: Yup.object().shape({
          event: Yup.object().shape({
            enable: Yup.boolean(),
            topic: Yup.string(),
          }),
          scheduler: Yup.object().shape({
            enable: Yup.boolean(),
            schedule: Yup.string(),
            timezone: Yup.mixed(),
            advancedCron: Yup.boolean(),
          }),
          webhook: Yup.object().shape({
            enable: Yup.boolean(),
            token: Yup.string(),
          }),
        }),
      })}
    >
      {(formikProps) =>
        isOnRoute ? (
          <Configure
            formikProps={formikProps}
            workflowSummary={workflowSummary}
            summaryMutation={summaryMutation}
            teams={teams}
            updateSummary={updateSummary}
          />
        ) : null
      }
    </Formik>
  );
});

export default ConfigureContainer;

interface ConfigureProps {
  formikProps: FormikProps<FormProps>;
  workflowSummary: workflowSummary;
  summaryMutation: {
    status: string;
  };
  teams: Array<{ id: string }>;
  updateSummary: ({ values, callback }: { values: object; callback: () => void }) => void;
}

interface ConfigureState {
  tokenTextType: string;
  showTokenText: string;
  copyTokenText: string;
  errors: object;
}

class Configure extends Component<ConfigureProps, ConfigureState> {
  constructor(props: ConfigureProps) {
    super(props);
    this.state = {
      tokenTextType: "password",
      showTokenText: "Show Token",
      copyTokenText: "Copy Token",
      errors: {},
    };
  }

  generateToken = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e) {
      e.preventDefault();
    }
    axios
      .post(serviceUrl.postCreateWorkflowToken({ workflowId: this.props.workflowSummary.id }))
      .then((response) => {
        this.props.formikProps.setFieldValue("triggers.webhook.token", response.data.token);
        notify(
          <ToastNotification kind="success" title="Generate Token" subtitle="Successfully generated webhook token" />
        );
      })
      .catch((err) => {
        notify(<ToastNotification kind="error" title="Something's wrong" subtitle="Failed to create webhook token" />);
      });
  };

  handleOnChange = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    this.props.formikProps.handleChange(e);
  };

  handleOnToggleChange = (value: any, id: string) => {
    this.props.formikProps.setFieldValue(id, value);
  };

  handleShowToken = () => {
    if (this.state.tokenTextType === "text") {
      this.setState({ tokenTextType: "password", showTokenText: "Show Token" });
    } else {
      this.setState({ tokenTextType: "text", showTokenText: "Hide Token" });
    }
  };

  handleTeamChange = ({ selectedItem }: { selectedItem: object }) => {
    this.props.formikProps.setFieldValue("selectedTeam", selectedItem ?? {});
  };

  render() {
    const {
      summaryMutation,
      teams,
      formikProps: { dirty, errors, handleBlur, handleSubmit, touched, values },
    } = this.props;

    const isLoading = summaryMutation.status === QueryStatus.Loading;

    return (
      <div aria-label="Configure" className={styles.wrapper} role="region">
        <section className={styles.largeCol}>
          <h1 className={styles.header}>General info</h1>
          <h2 className={styles.subTitle}>The bare necessities - you gotta fill out all these fields</h2>
          <div className={styles.teamSelect}>
            <ComboBox
              id="selectedTeam"
              initialSelectedItem={values?.selectedTeam}
              invalid={Boolean(errors.selectedTeam)}
              invalidText={errors.selectedTeam}
              items={teams}
              itemToString={(item: { name: string }) => item?.name ?? ""}
              onChange={this.handleTeamChange}
              value={values.selectedTeam}
              label="Team"
              placeholder="Select a team"
              shouldFilterItem={({ item, inputValue }: { item: { name: string }; inputValue: string }) =>
                item?.name?.toLowerCase()?.includes(inputValue.toLowerCase())
              }
            />
          </div>
          <TextInput
            id="name"
            label="Name"
            helperText="Must be unique"
            placeholder="Name"
            value={values.name}
            onBlur={handleBlur}
            onChange={this.handleOnChange}
            invalid={errors.name && touched.name}
            invalidText={errors.name}
          />
          <TextInput
            id="shortDescription"
            label="Summary"
            placeholder="Summary"
            value={values.shortDescription}
            onBlur={handleBlur}
            onChange={this.handleOnChange}
            invalid={errors.shortDescription && touched.shortDescription}
            invalidText={errors.shortDescription}
          />
          <div className={styles.descriptionContainer}>
            <p className={styles.descriptionLength}> {`${values.description.length} / 250`}</p>
            <TextArea
              id="description"
              label="Description"
              placeholder="Description"
              onBlur={handleBlur}
              onChange={this.handleOnChange}
              invalid={errors.description && touched.description}
              invalidText={errors.description}
              style={{ resize: "none" }}
              value={values.description}
            />
          </div>
          <h2 className={styles.iconTitle}>Pick an icon (any icon)</h2>
          <div className={styles.iconsWrapper}>
            {workflowIcons.map(({ name, Icon }, index) => (
              <label
                className={cx(styles.iconLabel, {
                  [styles.active]: values.icon === name,
                })}
                key={`icon-number-${index}`}
                title={capitalize(name)}
              >
                <input
                  id="icon"
                  readOnly
                  checked={values.icon === name}
                  onClick={this.handleOnChange}
                  value={name}
                  type="radio"
                />
                <Icon key={`${name}-${index}`} alt={`${name} icon`} className={styles.icon} />
              </label>
            ))}
          </div>
        </section>
        <section className={styles.largeCol}>
          <h1 className={styles.header}>Triggers</h1>
          <h2 className={styles.subTitle}>Off - until you turn them on. (Feel the power).</h2>
          <div className={styles.triggerContainer}>
            <div className={styles.triggerSection}>
              <div className={styles.toggleContainer}>
                <Toggle
                  id="triggers.webhook.enable"
                  label="Webhook"
                  toggled={values.triggers.webhook.enable}
                  onToggle={(checked: boolean) => this.handleOnToggleChange(checked, "triggers.webhook.enable")}
                  tooltipContent="Enable workflow to be executed by a webhook"
                  tooltipProps={{ direction: "top" }}
                  reversed
                />
              </div>
              {values.triggers.webhook.enable && !values.triggers.webhook.token && (
                <div className={styles.webhookContainer}>
                  <button className={styles.regenerateText} type="button" onClick={this.generateToken}>
                    <p>Generate a token</p>
                  </button>
                </div>
              )}

              {values.triggers.webhook.enable && values.triggers.webhook.token && (
                <div className={styles.webhookContainer}>
                  <p className={styles.webhookTokenLabel}>API Token</p>
                  <div className={styles.webhookWrapper}>
                    <p className={styles.webhookToken}>
                      {this.state.tokenTextType === "password"
                        ? values.triggers.webhook.token.toString().replace(/./g, "*")
                        : values.triggers.webhook.token}{" "}
                    </p>
                    <TooltipHover direction="top" content={this.state.showTokenText}>
                      <button onClick={this.handleShowToken} type="button" className={styles.showTextButton}>
                        <ViewFilled16 fill={"#0072C3"} className={styles.webhookImg} alt="Show/Hide token" />
                      </button>
                    </TooltipHover>
                    <TooltipIcon direction="top" tooltipText={this.state.copyTokenText}>
                      <CopyToClipboard text={values.triggers.webhook.token}>
                        <button
                          onClick={() => this.setState({ copyTokenText: "Copied Token" })}
                          onMouseLeave={() => this.setState({ copyTokenText: "Copy Token" })}
                          type="button"
                        >
                          <CopyFile16 fill={"#0072C3"} className={styles.webhookImg} alt="Copy token" />
                        </button>
                      </CopyToClipboard>
                    </TooltipIcon>
                  </div>
                  <div>
                    <ConfirmModal
                      affirmativeAction={this.generateToken}
                      children="The existing token will be invalidated."
                      title="Generate a new Webhook Token?"
                      modalTrigger={({ openModal }: { openModal: () => void }) => (
                        <button className={styles.regenerateText} type="button" onClick={openModal}>
                          <p>Generate a new token</p>
                        </button>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className={styles.triggerSection}>
              <div className={styles.toggleContainer}>
                <Toggle
                  reversed
                  id="triggers.scheduler.enable"
                  data-testid="triggers.scheduler.enable"
                  label="Scheduler"
                  onToggle={(checked: boolean) => this.handleOnToggleChange(checked, "triggers.scheduler.enable")}
                  toggled={values.triggers.scheduler.enable}
                  tooltipContent="Enable workflow to be executed by a schedule"
                  tooltipProps={{ direction: "top" }}
                />
              </div>
              <div className={styles.schedulerContainer}>
                {values.triggers.scheduler.schedule &&
                  values.triggers.scheduler.enable &&
                  values.triggers.scheduler.timezone && (
                    <div className={styles.informationWrapper}>
                      <p className={styles.webhookTokenLabel}>Schedule</p>
                      <div className={styles.informationCronMessage}>
                        {`${cronstrue.toString(values.triggers.scheduler.schedule)} in ${
                          values.triggers.scheduler.timezone
                        }`}
                      </div>
                      {/*<div className={styles.informationTimeZone}>
                        {`${values.triggers.scheduler.timezone} Timezone`}
                  </div>*/}
                    </div>
                  )}
                {values.triggers.scheduler.enable && (
                  <ComposedModal
                    modalHeaderProps={{
                      title: "Change schedule",
                    }}
                    modalTrigger={({ openModal }: { openModal: () => void }) => (
                      <button
                        className={styles.regenerateText}
                        type="button"
                        onClick={openModal}
                        data-testid="launchCronModal"
                      >
                        <p>Change schedule</p>
                        <EventSchedule16 className={styles.scheduleIcon} fill={"#0072C3"} />
                      </button>
                    )}
                  >
                    {({ closeModal }: { closeModal: () => void }) => (
                      <CronJobModal
                        advancedCron={values.triggers.scheduler.advancedCron}
                        closeModal={closeModal}
                        cronExpression={values.triggers.scheduler.schedule}
                        handleOnChange={this.handleOnToggleChange}
                        timeZone={values.triggers.scheduler.timezone}
                      />
                    )}
                  </ComposedModal>
                )}
              </div>
            </div>
            <div className={styles.triggerSection}>
              <div className={styles.toggleContainer}>
                <Toggle
                  id="triggers.event.enable"
                  label="Action Subscription"
                  toggled={values.triggers.event.enable}
                  onToggle={(checked: boolean) => this.handleOnToggleChange(checked, "triggers.event.enable")}
                  tooltipContent="Enable workflow to be triggered by platform actions"
                  tooltipProps={{ direction: "top" }}
                  reversed
                />
              </div>
              {values.triggers.event.enable && (
                <div className={styles.subscriptionContainer}>
                  <TextInput
                    id="triggers.event.topic"
                    label="Topic"
                    placeholder="Name"
                    value={values.triggers.event.topic}
                    onBlur={handleBlur}
                    onChange={this.handleOnChange}
                  />
                  <div className={styles.toggleContainer}>
                    <Toggle
                      id="enableACCIntegration"
                      label="IBM Services ACC Integration"
                      toggled={values.enableACCIntegration}
                      onToggle={(checked: boolean) => this.handleOnToggleChange(checked, "enableACCIntegration")}
                      tooltipContent="Enable workflow to be triggered by ACC subscription"
                      tooltipProps={{ direction: "top" }}
                      reversed
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <hr className={styles.delimiter} />
          <div className={styles.optionsContainer}>
            <h1 className={styles.header}>Other Options</h1>
            <h2 className={styles.subTitle}>They may look unassuming, but they’re stronger than you know.</h2>
            <div className={styles.toggleContainer}>
              <Toggle
                id="enablePersistentStorage"
                label="Enable Persistent Storage"
                toggled={values.enablePersistentStorage}
                onToggle={(checked: boolean) => this.handleOnToggleChange(checked, "enablePersistentStorage")}
                tooltipContent="Persist workflow data between executions"
                tooltipProps={{ direction: "top" }}
                reversed
              />
            </div>
          </div>
          <hr className={styles.delimiter} />
        </section>
        <section className={styles.smallCol}>
          <div className={styles.saveChangesContainer}>
            <Button
              size="field"
              disabled={!dirty || isLoading}
              iconDescription="Save"
              onClick={handleSubmit}
              renderIcon={Save24}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
            <p className={styles.saveText}>
              Save the configuration. Versioning functionality only applies to the Workflow.
            </p>
          </div>
        </section>
      </div>
    );
  }
}
