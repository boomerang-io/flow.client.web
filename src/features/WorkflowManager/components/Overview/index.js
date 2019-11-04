import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import axios from "axios";
import get from "lodash.get";
import isEqual from "lodash/isEqual";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowActions } from "State/workflow";
import { actions as appActions } from "State/app";
import CopyToClipboard from "react-copy-to-clipboard";
import { Button, Tooltip as CarbonTooltip, TooltipDefinition } from "carbon-components-react";
import {
  ComboBox,
  ConfirmModal,
  ModalFlow,
  TextArea,
  TextInput,
  Toggle,
  notify,
  ToastNotification
} from "@boomerang/carbon-addons-boomerang-react";
import CronJobModal from "./CronJobModal";
import workflowIcons from "Assets/workflowIcons";
import cronstrue from "cronstrue";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import { Add16, CopyFile16, Save24, SettingsAdjust20, ViewFilled16 } from "@carbon/icons-react";
import styles from "./overview.module.scss";

export class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenTextType: "password",
      showTokenText: "Show Token",
      copyTokenText: "Copy Token",
      errors: {}
    };
  }
  static propTypes = {
    activeTeamId: PropTypes.string,
    formikProps: PropTypes.object.isRequired,
    teams: PropTypes.array.isRequired,
    workflow: PropTypes.object.isRequired,
    workflowActions: PropTypes.object.isRequired
  };

  componentDidMount() {
    window.addEventListener("beforeunload", this.handleBeforeUnloadEvent);
  }

  componentWillUnmount() {
    this.props.updateWorkflow();
    window.removeEventListener("beforeunload", this.handleBeforeUnloadEvent);
  }

  handleBeforeUnloadEvent = event => {
    const {
      formikProps: { initialValues, values }
    } = this.props;
    if (!isEqual(initialValues, values)) {
      event.preventDefault();
      event.returnValue = "You have unsaved changes.";
    }
  };

  generateToken = e => {
    if (e) {
      e.preventDefault();
    }
    const { workflowActions } = this.props;
    return axios
      .post(`${BASE_SERVICE_URL}/workflow/${this.props.workflow.data.id}/webhook-token`)
      .then(response => {
        workflowActions.updateTriggersWebhook({
          key: "token",
          value: response.data.token
        });
        this.props.formikProps.handleChange({ target: { value: response.data.token, id: "token" } });
        notify(
          <ToastNotification kind="success" title="Generate Token" subtitle="Successfully generated webhook token" />
        );
      })
      .catch(err => {
        notify(<ToastNotification kind="error" title="Something's wrong" subtitle="Failed to create webhook token" />);
      });
  };

  handleOnChange = e => {
    const { value, id } = e.target;
    this.props.workflowActions.updateProperty({ value, key: id });
    this.props.formikProps.handleChange(e);
  };

  handleOnIconChange = (value, id) => {
    this.props.workflowActions.updateProperty({ value, key: id });
  };

  handleOnWebhookChange = value => {
    this.props.workflowActions.updateTriggersWebhook({ value, key: "enable" });
    this.props.formikProps.setFieldValue("webhook", value);
  };

  handleShowToken = () => {
    if (this.state.tokenTextType === "text") {
      this.setState({ tokenTextType: "password", showTokenText: "Show Token" });
    } else {
      this.setState({ tokenTextType: "text", showTokenText: "Hide Token" });
    }
  };

  handleOnSchedulerChange = value => {
    this.props.workflowActions.updateTriggersScheduler({ value, key: "enable" });
    this.props.formikProps.setFieldValue("schedule", value);
  };

  handleOnCronChange = (value, id) => {
    this.props.workflowActions.updateTriggersScheduler({ value, key: id });
  };

  handleOnEventChange = value => {
    this.props.workflowActions.updateTriggersEvent({ value, key: "enable" });
    this.props.formikProps.setFieldValue("event", value);
  };

  handleOnIamChange = value => {
    //this.props.workflowActions.updateTriggersEvent({ value, key: "enableACCIntegration" });
    this.props.workflowActions.updateProperty({ value, key: "enableACCIntegration" });
    this.props.formikProps.setFieldValue("enableACCIntegration", value);
  };

  handleOnTopicChange = e => {
    const { value, id } = e.target;
    this.props.workflowActions.updateTriggersEvent({ value, key: id });
    this.props.formikProps.handleChange(e);
  };

  handleOnPersistenceChange = (value, id) => {
    this.props.workflowActions.updateProperty({ value, key: "enablePersistentStorage" });
    this.props.formikProps.setFieldValue(id, value);
  };

  handleTeamChange = ({ selectedItem }) => {
    this.props.appActions.setActiveTeam({ teamId: selectedItem && selectedItem.id });
    this.props.workflowActions.updateProperty({
      key: "flowTeamId",
      value: selectedItem && selectedItem.id
    });
    this.props.formikProps.setFieldValue("selectedTeam", selectedItem);
  };

  render() {
    const {
      workflow,
      teams,
      formikProps: { values, touched, errors, handleBlur }
    } = this.props;

    return (
      <main className={styles.wrapper}>
        <section className={styles.largeCol}>
          <h1 className={styles.header}>General info</h1>
          <h2 className={styles.subTitle}>The bare necessities - you gotta fill out all these fields</h2>
          <ComboBox
            onChange={this.handleTeamChange}
            items={teams}
            initialSelectedItem={values.selectedTeam}
            itemToString={item => (item ? item.name : "")}
            invalid={errors.selectedTeam && touched.selectedTeam}
            invalidText={errors.selectedTeam}
            value={values.selectedTeam}
            titleText={
              <div style={{ display: "flex" }}>
                <p style={{ marginRight: "0.5rem" }}>Team</p>
                <CarbonTooltip direction="right">The Flow team for this workflow</CarbonTooltip>
              </div>
            }
            placeholder="Select a team"
            shouldFilterItem={({ item, inputValue }) =>
              item && item.name.toLowerCase().includes(inputValue.toLowerCase())
            }
          />
          <TextInput
            id="name"
            labelText="Name"
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
            labelText="Summary"
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
              labelText="Description"
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
            {workflowIcons.map((image, index) => (
              <label
                className={cx(styles.iconLabel, {
                  [styles.active]: workflow?.data?.icon === image.name
                })}
                key={`icon-number-${index}`}
              >
                <input
                  readOnly
                  checked={workflow?.data?.icon === image.name}
                  onClick={() => this.handleOnIconChange(image.name, "icon")}
                  value={image.name}
                  type="radio"
                />
                <image.src key={`${image.name}-${index}`} alt={`${image.name} icon`} className={styles.icon} />
              </label>
            ))}
          </div>
        </section>
        <section className={styles.smallCol}>
          <h1 className={styles.header}>Triggers</h1>
          <h2 className={styles.subTitle}>Off - until you turn them on. (Feel the power).</h2>
          <div className={styles.triggerContainer}>
            <div className={styles.triggerSection}>
              <div className={styles.toggleContainer}>
                <Toggle
                  id="webhook"
                  labelText="Webhook"
                  toggled={values.webhook}
                  onToggle={checked => this.handleOnWebhookChange(checked)}
                  Up
                  tooltipContent="Enable workflow to be executed by a webhook"
                  tooltipProps={{ direction: "top" }}
                  reversed
                />
              </div>
              {workflow?.data?.id &&
                workflow?.data?.triggers?.webhook?.enable &&
                !workflow?.data?.triggers?.webhook?.token && (
                  <Button
                    onClick={this.generateToken}
                    renderIcon={Add16}
                    style={{ marginBottom: "1rem", marginLeft: "4.6rem" }}
                    size="field"
                    type="button"
                  >
                    Generate Token
                  </Button>
                )}

              {workflow?.data?.triggers?.webhook?.enable && workflow?.data?.triggers?.webhook?.token && (
                <div className={styles.webhookContainer}>
                  <p className={styles.webhookTokenLabel}>API Token</p>
                  <div className={styles.webhookWrapper}>
                    <p className={styles.webhookToken}>
                      {this.state.tokenTextType === "password"
                        ? values.token.toString().replace(/./g, "*")
                        : values.token}{" "}
                    </p>
                    <TooltipDefinition direction="top" tooltipText={this.state.showTokenText}>
                      <button onClick={this.handleShowToken} type="button" className={styles.showTextButton}>
                        <ViewFilled16 fill={"#0072C3"} className={styles.webhookImg} alt="Show/Hide token" />
                      </button>
                    </TooltipDefinition>
                    <CopyToClipboard text={get(workflow, "data.triggers.webhook.token", "")}>
                      <TooltipDefinition direction="top" tooltipText={this.state.copyTokenText}>
                        <button
                          onClick={() => this.setState({ copyTokenText: "Copied Token" })}
                          onMouseLeave={() => this.setState({ copyTokenText: "Copy Token" })}
                          type="button"
                        >
                          <CopyFile16 fill={"#0072C3"} className={styles.webhookImg} alt="Copy token" />
                        </button>
                      </TooltipDefinition>
                    </CopyToClipboard>
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
                  id="schedule"
                  labelText="Scheduler"
                  onToggle={checked => this.handleOnSchedulerChange(checked)}
                  toggled={values.schedule}
                  tooltipContent="Enable workflow to be executed by a schedule"
                  tooltipProps={{ direction: "top" }}
                />
              </div>
              <div className={styles.schedulerContainer}>
                {get(workflow, "data.triggers.scheduler.schedule", false) &&
                  get(workflow, "data.triggers.scheduler.enable", false) &&
                  get(workflow, "data.triggers.scheduler.timezone", false) && (
                    <div className={styles.informationWrapper}>
                      <div className={styles.informationCronMessage}>
                        {cronstrue.toString(get(workflow, "data.triggers.scheduler.schedule", ""))}
                      </div>
                      <div className={styles.informationTimeZone}>
                        {`${get(workflow, "data.triggers.scheduler.timezone", "")} Timezone`}
                      </div>
                    </div>
                  )}
                {get(workflow, "data.triggers.scheduler.enable", false) && (
                  <ModalFlow
                    confirmModalProps={{
                      title: "Are you sure?",
                      children: "Your changes will not be saved"
                    }}
                    modalHeaderProps={{
                      title: "Set Schedule",
                      subtitle: "Configure a CRON schedule for your workflow"
                    }}
                    modalTrigger={({ openModal }) =>
                      get(workflow, "data.triggers.scheduler.schedule", false) ? (
                        <button className={styles.regenerateText} type="button" onClick={openModal}>
                          <p>Change Schedule</p>
                        </button>
                      ) : (
                        <Button
                          style={{ marginBottom: "1rem" }}
                          iconDescription="Add"
                          renderIcon={SettingsAdjust20}
                          size="field"
                          type="button"
                          onClick={openModal}
                        >
                          Set Schedule
                        </Button>
                      )
                    }
                  >
                    <CronJobModal
                      cronExpression={get(workflow, "data.triggers.scheduler.schedule", "")}
                      handleOnChange={this.handleOnCronChange}
                      timeZone={get(workflow, "data.triggers.scheduler.timezone", "")}
                    />
                  </ModalFlow>
                )}
              </div>
            </div>
            <div className={styles.triggerSection}>
              <div className={styles.toggleContainer}>
                <Toggle
                  id="event"
                  labelText="Enable Action Subscription"
                  toggled={values.event}
                  onToggle={checked => this.handleOnEventChange(checked)}
                  tooltipContent="Enable workflow to be triggered by platform actions"
                  tooltipProps={{ direction: "top" }}
                  reversed
                />
              </div>
              {get(workflow, "data.triggers.event.enable", false) && (
                <div className={styles.subscriptionContainer}>
                  <TextInput
                    id="topic"
                    labelText="Topic"
                    placeholder="Name"
                    value={values.topic}
                    onBlur={handleBlur}
                    onChange={this.handleOnTopicChange}
                  />
                  <div className={styles.toggleContainer}>
                    <Toggle
                      id="enableACCIntegration"
                      labelText="Enable IBM Services ACC Integration"
                      toggled={values.enableACCIntegration}
                      onToggle={checked => this.handleOnIamChange(checked)}
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
                id="persistence"
                labelText="Enable Persistent Storage"
                toggled={values.persistence}
                onToggle={checked => this.handleOnPersistenceChange(checked, "persistence")}
                tooltipContent="Persist workflow data between executions"
                tooltipProps={{ direction: "top" }}
                reversed
              />
            </div>
          </div>
          <hr className={styles.delimiter} />
        </section>
        <section className={styles.largeCol}>
          <div className={styles.saveChangesCoontainer}>
            <Save24 fill="#697077" />
            <p className={styles.saveText}>
              Changes to Settings are saved when you leave this page. Versioning functionality only applies to the
              Workflow.
            </p>
          </div>
        </section>
      </main>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(appActions, dispatch),
  workflowActions: bindActionCreators(workflowActions, dispatch)
});

export default connect(
  null,
  mapDispatchToProps
)(Overview);
