import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import get from "lodash.get";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowActions } from "State/workflow";
import { actions as appActions } from "State/app";
import CopyToClipboard from "react-copy-to-clipboard";
import { Button, Tooltip as CarbonTooltip } from "carbon-components-react";
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
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import CronJobModal from "./CronJobModal";
import workflowIcons from "Assets/workflowIcons";
import cronstrue from "cronstrue";
import copyIcon from "Assets/workflowIcons/copy.svg";
import eyeIcon from "Assets/workflowIcons/eye.svg";
import refreshIcon from "Assets/workflowIcons/refresh.svg";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import { Add16, SettingsAdjust20 } from "@carbon/icons-react";
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

  componentWillUnmount() {
    this.props.updateWorkflow();
  }

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
      <div className={styles.wrapper}>
        <div className={styles.largeCol}>
          <h1 className={styles.header}>General info</h1>
          <h2 className={styles.subTitle}>The bare necessities - you gotta fill out all these fields</h2>
          <ComboBox
            onChange={this.handleTeamChange}
            items={teams}
            initialSelectedItem={values.selectedTeam}
            itemToString={item => (item ? item.name : "")}
            value={values.selectedTeam}
            titleText={
              <div style={{ display: "flex" }}>
                <p style={{ marginRight: "0.5rem" }}>Team</p>
                <CarbonTooltip tooltipText="test" />
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
            helperText="Must be unique, or special characters"
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
          <TextArea
            id="description"
            labelText="Description"
            placeholder="Description"
            onBlur={handleBlur}
            onChange={this.handleOnChange}
            invalid={errors.description && touched.description}
            invalidText={errors.description}
            resize={false}
            style={{ resize: "none" }}
            value={values.description}
          />
          <h2 className={styles.iconTitle}>Pick an icon (any icon)</h2>
          <div className={styles.iconsWrapper}>
            {workflowIcons.map((image, index) => (
              <label
                key={`icon-number-${index}`}
                className={`${styles.icon} ${get(workflow, "data.icon", "") === image.name ? styles.active : ""}`}
              >
                <input
                  type="radio"
                  value={image.name}
                  readOnly
                  onClick={() => this.handleOnIconChange(image.name, "icon")}
                  checked={get(workflow, "data.icon", "") === image.name}
                />
                <image.src key={`${image.name}-${index}`} alt={`${image.name} icon`} />
              </label>
            ))}
          </div>
        </div>
        <div className={styles.smallCol}>
          <h1 className={styles.header}>Triggers</h1>
          <h2 className={styles.subTitle}>Off - until you turn them on. (Feel the power).</h2>
          <div>
            <div className={styles.triggerSection}>
              <div className={styles.toggleContainer}>
                <Toggle
                  id="webhook"
                  labelText="Enable Webhook"
                  toggled={values.webhook}
                  onToggle={checked => this.handleOnWebhookChange(checked)}
                  Up
                  tooltipContent="Enable workflow to be executed by a webhook"
                  tooltipProps={{ direction: "top" }}
                  reversed
                />
              </div>
              {get(workflow, "data.id", false) &&
                get(workflow, "data.triggers.webhook.enable", false) &&
                !get(workflow, "data.triggers.webhook.token", false) && (
                  <Button
                    onClick={this.generateToken}
                    renderIcon={Add16}
                    style={{ marginBottom: "1rem" }}
                    size="field"
                    type="button"
                  >
                    Generate Token
                  </Button>
                )}

              {get(workflow, "data.triggers.webhook.enable", false) &&
                get(workflow, "data.triggers.webhook.token", false) && (
                  <div className={styles.webhookWrapper}>
                    <TextInput
                      readOnly
                      id="token"
                      placeholder="Token"
                      value={values.token}
                      type={this.state.tokenTextType}
                    />
                    <button onClick={this.handleShowToken} type="button">
                      <img
                        alt="Show/Hide token"
                        className={styles.webhookImg}
                        data-tip
                        data-for="webhook-token-eyeIcon"
                        src={eyeIcon}
                      />
                    </button>
                    <Tooltip id="webhook-token-eyeIcon" place="top">
                      {this.state.showTokenText}
                    </Tooltip>
                    <CopyToClipboard text={get(workflow, "data.triggers.webhook.token", "")}>
                      <button
                        onClick={() => this.setState({ copyTokenText: "Copied Token" })}
                        onMouseLeave={() => this.setState({ copyTokenText: "Copy Token" })}
                        type="button"
                      >
                        <img
                          alt="Copy token"
                          className={styles.webhookImg}
                          data-tip
                          data-for="webhook-token-copyIcon"
                          src={copyIcon}
                        />
                      </button>
                    </CopyToClipboard>
                    <Tooltip id="webhook-token-copyIcon" place="top">
                      {this.state.copyTokenText}
                    </Tooltip>
                    <div>
                      <Tooltip place="top" id="webhook-token-refreshIcon">
                        Regenerate Token
                      </Tooltip>
                      <ConfirmModal
                        affirmativeAction={this.generateToken}
                        children="The existing token will be invalidated."
                        title="Generate a new Webhook Token?"
                        modalTrigger={({ openModal }) => (
                          <button type="button" onClick={openModal}>
                            <img
                              src={refreshIcon}
                              className={styles.webhookImg}
                              data-tip
                              data-for="webhook-token-refreshIcon"
                              alt="Regenerate token"
                            />
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
                  id="schedule"
                  labelText="Enable Scheduler"
                  toggled={values.schedule}
                  onToggle={checked => this.handleOnSchedulerChange(checked)}
                  tooltipContent="Enable workflow to be executed by a schedule"
                  tooltipProps={{ direction: "top" }}
                  reversed
                />
              </div>
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
                  modalTrigger={({ openModal }) => (
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
                  )}
                >
                  <CronJobModal
                    cronExpression={get(workflow, "data.triggers.scheduler.schedule", "")}
                    handleOnChange={this.handleOnCronChange}
                    timeZone={get(workflow, "data.triggers.scheduler.timezone", "")}
                  />
                </ModalFlow>
              )}
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
                <div>
                  <TextInput
                    id="topic"
                    labelText=""
                    placeholder="Topic"
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

          <div className={styles.delimiter} />
          <div>
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

          <div className={styles.delimiter} />
        </div>
        <div className={styles.largeCol} />
      </div>
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
