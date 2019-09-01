import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import classnames from "classnames";
import get from "lodash.get";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowActions } from "State/workflow";
import { actions as appActions } from "State/app";
import CopyToClipboard from "react-copy-to-clipboard";
import { Button } from "carbon-components-react";
import { ComboBox, TextArea, TextInput, Toggle } from "@boomerang/carbon-addons-boomerang-react";
import AlertModal from "@boomerang/boomerang-components/lib/AlertModal";
import ConfirmModal from "@boomerang/boomerang-components/lib/ConfirmModal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import ModalWrapper from "@boomerang/boomerang-components/lib/Modal";
import { Notification, notify } from "@boomerang/boomerang-components/lib/Notifications";
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import CronJobModal from "./CronJobModal";
import assets from "./assets";
import cronstrue from "cronstrue";
import copyIcon from "./assets/copy.svg";
import eyeIcon from "./assets/eye.svg";
import refreshIcon from "./assets/refresh.svg";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import { Add16, SettingsAdjust20 } from "@carbon/icons-react";
import "./styles.scss";

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
        notify(<Notification type="success" title="Generate Token" message="Successfully generated webhook token" />);
      })
      .catch(err => {
        notify(<Notification type="error" title="Something's wrong" message="Failed to create webhook token" />);
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
      <div className="c-workflow-overview">
        <div className="c-overview-card">
          <h1 className="s-general-info-title">General</h1>
          <ComboBox
            styles={{ marginBottom: "2.5rem" }}
            onChange={this.handleTeamChange}
            items={teams}
            initialSelectedItem={values.selectedTeam}
            itemToString={item => (item ? item.name : "")}
            value={values.selectedTeam}
            title="Team"
            label="Team"
            placeholder="Select a team"
            shouldFilterItem={({ item, inputValue }) =>
              item && item.name.toLowerCase().includes(inputValue.toLowerCase())
            }
          />
          <TextInput
            className="b-overview__text-input"
            id="name"
            labelText="Name"
            placeholder="Name"
            value={values.name}
            onBlur={handleBlur}
            onChange={this.handleOnChange}
            invalid={errors.name && touched.name}
            invalidText={errors.name}
          />
          <TextInput
            className="b-overview__text-input"
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
            className="b-overview__text-area"
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
          <h2 className="s-workflow-icons-title">Icon</h2>
          <div className="b-workflow-icons">
            {assets.map((image, index) => (
              <label
                key={index}
                className={classnames("b-workflow-icons__icon", {
                  "--active": get(workflow, "data.icon", "") === image.name
                })}
              >
                <input
                  type="radio"
                  value={image.name}
                  readOnly
                  onClick={() => this.handleOnIconChange(image.name, "icon")}
                  checked={get(workflow, "data.icon", "") === image.name}
                />
                <img key={`${image.name}-${index}`} src={image.src} alt={`${image.name} icon`} />
              </label>
            ))}
          </div>
        </div>
        <div className="c-overview-card">
          <h1 className="s-trigger-title">Triggers</h1>
          <div className="c-webhook">
            <div className="b-webhook">
              <div className="b-webhook__toggle">
                <Toggle
                  id="webhook"
                  labelText="Enable Webhook"
                  toggled={values.webhook}
                  onToggle={checked => this.handleOnWebhookChange(checked)}
                  Up
                  tooltipContent="Enable workflow to be executed by a webhook"
                  tooltipProps={{ direction: "top" }}
                />
              </div>
              {get(workflow, "data.id", false) &&
                get(workflow, "data.triggers.webhook.enable", false) &&
                !get(workflow, "data.triggers.webhook.token", false) && (
                  <Button
                    onClick={this.generateToken}
                    renderIcon={Add16}
                    style={{ marginLeft: "2.2rem" }}
                    size="field"
                    type="button"
                  >
                    Generate Token
                  </Button>
                )}
            </div>
            {!get(workflow, "data.id", false) && get(workflow, "data.triggers.webhook.enable", false) && (
              <div className="s-webhook-token-message">An API token will be generated on creation of the workflow.</div>
            )}
            {get(workflow, "data.triggers.webhook.enable", false) &&
              get(workflow, "data.triggers.webhook.token", false) && (
                <div className="b-webhook-token">
                  <TextInput
                    id="token"
                    placeholder="Token"
                    disabled
                    value={values.token}
                    type={this.state.tokenTextType}
                  />
                  <button onClick={this.handleShowToken} type="button">
                    <img
                      className="b-webhook-token__icon"
                      src={eyeIcon}
                      data-tip
                      data-for="webhook-token-eyeIcon"
                      alt="Show/Hide token"
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
                        className="b-webhook-token__icon"
                        src={copyIcon}
                        data-tip
                        data-for="webhook-token-copyIcon"
                        alt="Copy token"
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
                    <AlertModal
                      theme="bmrg-flow"
                      ModalTrigger={() => (
                        <button className="b-webhook-token__generate" type="button">
                          <img
                            src={refreshIcon}
                            className="b-webhook-token__icon"
                            data-tip
                            data-for="webhook-token-refreshIcon"
                            alt="Regenerate token"
                          />
                        </button>
                      )}
                      modalContent={(closeModal, rest) => (
                        <ConfirmModal
                          closeModal={closeModal}
                          affirmativeAction={this.generateToken}
                          title="Generate a new Webhook Token?"
                          subTitleTop="The existing token will be invalidated"
                          cancelText="NO"
                          affirmativeText="YES"
                          {...rest}
                        />
                      )}
                    />
                  </div>
                </div>
              )}
            <div className="c-scheduler">
              <div className="b-schedule">
                <div className="b-schedule__toggle">
                  <Toggle
                    id="schedule"
                    labelText="Enable Scheduler"
                    toggled={values.schedule}
                    onToggle={checked => this.handleOnSchedulerChange(checked)}
                    tooltipContent="Enable workflow to be executed by a schedule"
                    tooltipProps={{ direction: "top" }}
                  />
                </div>
                {get(workflow, "data.triggers.scheduler.enable", false) && (
                  <ModalWrapper
                    initialState={workflow.data}
                    modalProps={{ shouldCloseOnOverlayClick: false }}
                    theme="bmrg-flow"
                    ModalTrigger={() => (
                      <Button
                        iconDescription="Add"
                        renderIcon={SettingsAdjust20}
                        style={{ marginLeft: "2.2rem", width: "11rem" }}
                        size="field"
                        type="button"
                      >
                        Set Schedule
                      </Button>
                    )}
                    modalContent={(closeModal, rest) => (
                      <ModalFlow
                        closeModal={closeModal}
                        headerTitle="Set Schedule"
                        confirmModalProps={{
                          affirmativeAction: closeModal,
                          theme: "bmrg-flow",
                          subTitleTop: "Your changes will not be saved"
                        }}
                        {...rest}
                      >
                        <CronJobModal
                          closeModal={closeModal}
                          cronExpression={get(workflow, "data.trigger.scheduler.schedule", "")}
                          handleOnChange={this.handleOnCronChange}
                          timeZone={get(workflow, "data.triggers.scheduler.timezone", "")}
                        />
                      </ModalFlow>
                    )}
                  />
                )}
              </div>
              {get(workflow, "data.triggers.scheduler.schedule", false) &&
                get(workflow, "data.triggers.scheduler.enable", false) &&
                get(workflow, "data.triggers.scheduler.timezone", false) && (
                  <div className="b-schedule__information">
                    <div className="b-schedule__information--cronMessage">
                      {cronstrue.toString(get(workflow, "data.triggers.scheduler.schedule", ""))}
                    </div>
                    <div className="b-schedule__information--timezone">
                      {`${get(workflow, "data.triggers.scheduler.timezone", "")} Timezone`}
                    </div>
                  </div>
                )}
            </div>
            <div className="c-event">
              <div className="b-event">
                <div className="b-event__toggle">
                  <Toggle
                    id="event"
                    labelText="Enable Action Subscription"
                    toggled={values.event}
                    onToggle={checked => this.handleOnEventChange(checked)}
                    tooltipContent="Enable workflow to be triggered by platform actions"
                    tooltipProps={{ direction: "top" }}
                  />
                </div>
              </div>
              {get(workflow, "data.triggers.event.enable", false) && (
                <div className="b-event-topic">
                  <TextInput
                    id="topic"
                    labelText=""
                    placeholder="Topic"
                    value={values.topic}
                    onBlur={handleBlur}
                    onChange={this.handleOnTopicChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="c-overview-card">
          <h1 className="s-trigger-title">Options</h1>
          <div className="b-options">
            <div className="b-persistence">
              <div className="b-persistence__toggle">
                <Toggle
                  id="persistence"
                  labelText="Enable Persistent Storage"
                  toggled={values.persistence}
                  onToggle={checked => this.handleOnPersistenceChange(checked, "persistence")}
                  tooltipContent="Persist workflow data between executions"
                  tooltipProps={{ direction: "top" }}
                />
              </div>
            </div>
          </div>
        </div>
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
