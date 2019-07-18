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
import { TextArea, TextInput } from "carbon-components-react";
import AlertModal from "@boomerang/boomerang-components/lib/AlertModal";
import Button from "@boomerang/boomerang-components/lib/Button";
import ConfirmModal from "@boomerang/boomerang-components/lib/ConfirmModal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import ModalWrapper from "@boomerang/boomerang-components/lib/Modal";
import { Notification, notify } from "@boomerang/boomerang-components/lib/Notifications";
import SelectDropdown from "@boomerang/boomerang-components/lib/SelectDropdown";
import Toggle from "@boomerang/boomerang-components/lib/Toggle";
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import CronJobModal from "./CronJobModal";
import assets from "./assets";
import cronstrue from "cronstrue";
import copyIcon from "./assets/copy.svg";
import eyeIcon from "./assets/eye.svg";
import infoIcon from "./assets/info.svg";
import refreshIcon from "./assets/refresh.svg";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import "./styles.scss";

export class Overview extends Component {
  constructor(props) {
    super(props);
    const selectedTeam = this.props.activeTeamId
      ? this.props.teams.find(team => team.id === this.props.activeTeamId)
      : this.props.teams[0];
    this.state = {
      tokenTextType: "password",
      showTokenText: "Show Token",
      copyTokenText: "Copy Token",
      selectedTeam: { label: selectedTeam.name, value: selectedTeam.id },
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

  handleTeamChange = selectedTeam => {
    this.setState({ selectedTeam }, () => {
      this.props.appActions.setActiveTeam({ teamId: selectedTeam.value });
      this.props.workflowActions.updateProperty({
        key: "flowTeamId",
        value: selectedTeam.value
      });
    });
  };

  render() {
    const {
      workflow,
      teams,
      formikProps: { values, touched, errors, handleBlur }
    } = this.props;
    const { selectedTeam } = this.state;

    return (
      <div className="c-workflow-overview">
        <div className="c-overview-card">
          <h1 className="s-general-info-title">General</h1>
          <SelectDropdown
            styles={{ marginBottom: "2rem" }}
            onChange={this.handleTeamChange}
            options={teams.map(team => ({ label: team.name, value: team.id }))}
            value={selectedTeam}
            theme="bmrg-white"
            title="Team"
            placeholder="Select a team"
            noResultsText="No options entered"
          />
          <TextInput
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
            id="shortDescription"
            labelText="Summary"
            placeholder="Summary"
            value={values.shortDescription}
            onBlur={handleBlur}
            onChange={this.handleOnChange}
          />
          <TextArea
            id="description"
            labelText="Description"
            placeholder="Description"
            value={values.description}
            onBlur={handleBlur}
            onChange={this.handleOnChange}
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
              <p id="toggle-webhook" className="b-webhook__title">
                Enable Webhook
              </p>
              <Toggle
                id="webhook"
                name="webhook"
                aria-labelledby="toggle-webhook"
                className="b-webhook__toggle"
                checked={values.webhook}
                onChange={checked => this.handleOnWebhookChange(checked)}
                theme="bmrg-white"
              />
              <img
                className="b-options__infoIcon"
                src={infoIcon}
                data-tip
                data-for="triggers-webhook-info"
                alt="Toggle webhook"
              />
              <Tooltip id="triggers-webhook-info" place="top">
                Enable workflow to be executed by a webhook
              </Tooltip>
              {get(workflow, "data.id", false) &&
                get(workflow, "data.triggers.webhook.enable", false) &&
                !get(workflow, "data.triggers.webhook.token", false) && (
                  <Button
                    theme="bmrg-black"
                    type="button"
                    onClick={this.generateToken}
                    style={{ marginLeft: "2.2rem" }}
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
                      theme="bmrg-white"
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
                <p id="toggle-scheduler" className="b-schedule__title">
                  Enable Scheduler
                </p>
                <Toggle
                  id="schedule"
                  name="schedule"
                  aria-labelledby="toggle-scheduler"
                  className="b-schedule__toggle"
                  checked={values.schedule}
                  onChange={checked => this.handleOnSchedulerChange(checked)}
                  theme="bmrg-white"
                />
                <img
                  className="b-options__infoIcon"
                  src={infoIcon}
                  data-tip
                  data-for="triggers-scheduler-info"
                  alt="Toggle scheduler"
                />
                <Tooltip id="triggers-scheduler-info" place="top">
                  Enable workflow to be executed by a schedule
                </Tooltip>
                {get(workflow, "data.triggers.scheduler.enable", false) && (
                  <ModalWrapper
                    initialState={workflow.data}
                    modalProps={{ shouldCloseOnOverlayClick: false }}
                    theme="bmrg-white"
                    ModalTrigger={() => (
                      <Button theme="bmrg-black" style={{ marginLeft: "2.2rem" }} type="button">
                        Set Schedule
                      </Button>
                    )}
                    modalContent={(closeModal, rest) => (
                      <ModalFlow
                        closeModal={closeModal}
                        headerTitle="Set Schedule"
                        confirmModalProps={{
                          affirmativeAction: closeModal,
                          theme: "bmrg-white",
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
                <p id="toggle-event" className="b-event__title">
                  Enable Event Subscription
                </p>
                <Toggle
                  id="event"
                  name="event"
                  aria-labelledby="toggle-event"
                  className="b-event__toggle"
                  checked={values.event}
                  onChange={checked => this.handleOnEventChange(checked)}
                  theme="bmrg-white"
                />
                <img
                  className="b-options__infoIcon"
                  src={infoIcon}
                  data-tip
                  data-for="triggers-event-info"
                  alt="Toggle event"
                />
                <Tooltip id="triggers-event-info" place="top">
                  Enable workflow to be triggered by platform events
                </Tooltip>
              </div>
              {get(workflow, "data.triggers.event.enable", false) && (
                <div className="b-event-topic">
                  <TextInput
                    id="topic"
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
              <p id="toggle-persistence-storage" className="b-persistence__title">
                Enable Persistent Storage
              </p>
              <Toggle
                id="persistence"
                name="persistence"
                aria-labelledby="toggle-persistence-storage"
                className="b-persistence__toggle"
                checked={values.persistence}
                onChange={(checked, event, id) => this.handleOnPersistenceChange(checked, id)}
                theme="bmrg-white"
              />
              <img
                className="b-options__infoIcon"
                src={infoIcon}
                data-tip
                data-for="options-persistence-info"
                alt="Toggle persistence"
              />
              <Tooltip id="options-persistence-info" place="top">
                Persist workflow data between executions
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    teams: state.teams.data,
    activeTeamId: state.app.activeTeamId
  };
};
const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(appActions, dispatch),
  workflowActions: bindActionCreators(workflowActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
