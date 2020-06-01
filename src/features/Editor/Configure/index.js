import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Formik } from "formik";
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
} from "@boomerang/carbon-addons-boomerang-react";
import CronJobModal from "./CronJobModal";
import cx from "classnames";
import CopyToClipboard from "react-copy-to-clipboard";
import cronstrue from "cronstrue";
import * as Yup from "yup";
import { appLink } from "Config/appConfig";
import { serviceUrl } from "Config/servicesConfig";
import { QueryStatus } from "Constants";
import { CopyFile16, EventSchedule16, Save24, ViewFilled16 } from "@carbon/icons-react";
import workflowIcons from "Assets/workflowIcons";
import styles from "./configure.module.scss";

ConfigureContainer.propTypes = {
  history: PropTypes.object,
  isOnRoute: PropTypes.bool.isRequired,
  params: PropTypes.object,
  summaryData: PropTypes.object.isRequired,
  summaryMutation: PropTypes.object.isRequired,
  teams: PropTypes.array.isRequired,
  updateSummary: PropTypes.func.isRequired,
};

export default function ConfigureContainer({
  history,
  isOnRoute,
  params,
  summaryData,
  summaryMutation,
  teams,
  updateSummary,
}) {
  const handleOnSubmit = (values) => {
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
        description: summaryData?.description ?? "",
        enableACCIntegration: summaryData?.enableACCIntegration ?? false,
        enablePersistentStorage: summaryData?.enablePersistentStorage ?? false,
        icon: summaryData?.icon ?? "",
        name: summaryData?.name ?? "",
        selectedTeam: teams.find((team) => team.id === params.teamId),
        shortDescription: summaryData?.shortDescription ?? "",
        triggers: {
          event: {
            enable: summaryData?.triggers?.event?.enable ?? false,
            topic: summaryData?.triggers?.event?.topic ?? "",
          },
          scheduler: {
            enable: summaryData?.triggers?.scheduler?.enable ?? false,
            schedule: summaryData?.triggers?.scheduler?.schedule ?? "0 18 * * *",
            timezone: summaryData?.triggers?.scheduler?.timezone ?? false,
            advancedCron: summaryData?.triggers?.scheduler?.advancedCron ?? false,
          },
          webhook: {
            enable: summaryData?.triggers?.webhook?.enable ?? false,
            token: summaryData?.triggers?.webhook?.token ?? false,
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
            token: Yup.mixed(),
          }),
        }),
      })}
    >
      {(formikProps) =>
        isOnRoute ? (
          <Configure
            formikProps={formikProps}
            summaryData={summaryData}
            summaryMutation={summaryMutation}
            teams={teams}
            updateSummary={updateSummary}
          />
        ) : null
      }
    </Formik>
  );
}

class Configure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenTextType: "password",
      showTokenText: "Show Token",
      copyTokenText: "Copy Token",
      errors: {},
    };
  }
  static propTypes = {
    formikProps: PropTypes.object.isRequired,
    summaryData: PropTypes.object.isRequired,
    summaryMutation: PropTypes.object.isRequired,
    teams: PropTypes.array.isRequired,
    updateSummary: PropTypes.func.isRequired,
  };

  // componentDidMount() {
  //   window.addEventListener("beforeunload", this.handleBeforeUnloadEvent);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener("beforeunload", this.handleBeforeUnloadEvent);
  // }

  // handleBeforeUnloadEvent = (event) => {
  //   const {
  //     formikProps: { dirty },
  //   } = this.props;
  //   if (dirty) {
  //     event.preventDefault();
  //     event.returnValue = "You have unsaved changes.";
  //   }
  // };

  generateToken = (e) => {
    if (e) {
      e.preventDefault();
    }
    return axios
      .post(serviceUrl.postCreateWorkflowToken({ workflowId: this.props.summaryData.id }))
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

  handleOnChange = (e) => {
    this.props.formikProps.handleChange(e);
  };

  handleOnToggleChange = (value, id) => {
    this.props.formikProps.setFieldValue(id, value);
  };

  handleShowToken = () => {
    if (this.state.tokenTextType === "text") {
      this.setState({ tokenTextType: "password", showTokenText: "Show Token" });
    } else {
      this.setState({ tokenTextType: "text", showTokenText: "Hide Token" });
    }
  };

  handleTeamChange = ({ selectedItem }) => {
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
      <section aria-label="Configure" className={styles.wrapper}>
        <section className={styles.largeCol}>
          <h1 className={styles.header}>General info</h1>
          <h2 className={styles.subTitle}>The bare necessities - you gotta fill out all these fields</h2>
          <div className={styles.teamSelect}>
            <ComboBox
              id="selectedTeam"
              initialSelectedItem={values?.selectedTeam}
              invalid={Boolean(errors.selectedTeam?.name)}
              invalidText={errors.selectedTeam?.name}
              items={teams}
              itemToString={(item) => item?.name ?? ""}
              onChange={this.handleTeamChange}
              value={values.selectedTeam}
              label="Team"
              placeholder="Select a team"
              shouldFilterItem={({ item, inputValue }) => item?.name?.toLowerCase()?.includes(inputValue.toLowerCase())}
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
                  onToggle={(checked) => this.handleOnToggleChange(checked, "triggers.webhook.enable")}
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
                      modalTrigger={({ openModal }) => (
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
                  onToggle={(checked) => this.handleOnToggleChange(checked, "triggers.scheduler.enable")}
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
                    modalTrigger={({ openModal }) => (
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
                    {({ closeModal }) => (
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
                  onToggle={(checked) => this.handleOnToggleChange(checked, "triggers.event.enable")}
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
                      onToggle={(checked) => this.handleOnToggleChange(checked, "enableACCIntegration")}
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
                onToggle={(checked) => this.handleOnToggleChange(checked, "enablePersistentStorage")}
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
      </section>
    );
  }
}
