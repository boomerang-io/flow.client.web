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
import AlertModal from "@boomerang/boomerang-components/lib/AlertModal";
import Button from "@boomerang/boomerang-components/lib/Button";
import ConfirmModal from "@boomerang/boomerang-components/lib/ConfirmModal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import ModalWrapper from "@boomerang/boomerang-components/lib/Modal";
import { Notification, notify } from "@boomerang/boomerang-components/lib/Notifications";
import SelectDropdown from "@boomerang/boomerang-components/lib/SelectDropdown";
import TextArea from "@boomerang/boomerang-components/lib/TextArea";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
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
    setIsValidOverview: PropTypes.func.isRequired,
    teams: PropTypes.array.isRequired,
    workflow: PropTypes.object.isRequired,
    workflowActions: PropTypes.object.isRequired,
    activeTeamId: PropTypes.string
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
        notify(<Notification type="success" title="Generate Token" message="Successfully generated webhook token" />);
      })
      .catch(err => {
        notify(<Notification type="error" title="Something's wrong" message="Failed to create webhook token" />);
      });
  };

  handleOnChange = (value, errors, name) => {
    this.props.workflowActions.updateProperty({ value, key: name });
    this.setState({ errors: { ...this.state.errors, [name]: errors } }, () => this.determineIsValidForm());
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

  handleOnWebhookChange = (value, errors, name) => {
    this.props.workflowActions.updateTriggersWebhook({ value, key: "enable" });
    this.setState({ errors: { ...this.state.errors, [`webook-${name}`]: errors } }, () => this.determineIsValidForm());
  };

  handleOnEventChange = (value, errors, name) => {
    this.props.workflowActions.updateTriggersEvent({
      value,
      key: name
    });
    this.setState({ errors: { ...this.state.errors, [`scheduler-${name}`]: errors } }, () =>
      this.determineIsValidForm()
    );
  };

  handleOnSchedulerChange = (value, errors, name) => {
    this.props.workflowActions.updateTriggersScheduler({
      value,
      key: name
    });
    this.setState({ errors: { ...this.state.errors, [`scheduler-${name}`]: errors } }, () =>
      this.determineIsValidForm()
    );
  };

  handleShowToken = () => {
    if (this.state.tokenTextType === "text") {
      this.setState({ tokenTextType: "password", showTokenText: "Show Token" });
    } else {
      this.setState({ tokenTextType: "text", showTokenText: "Hide Token" });
    }
  };

  determineIsValidForm() {
    const errorKeys = Object.keys(this.state.errors);

    //harcoding the check for the team name being present
    if (!this.props.workflow.data.name) {
      return this.props.setIsValidOverview(false);
    }
    //if there are no keys on the error object than no need to check anything
    if (!errorKeys.length) {
      return this.props.setIsValidOverview(true);
    }
    //look for at least error key that is set to an object with keys aka has errors
    let isValidOveriew = true;
    errorKeys.forEach(errorKey => {
      if (Object.keys(this.state.errors[errorKey]).length) {
        isValidOveriew = false;
      }
    });
    return this.props.setIsValidOverview(isValidOveriew);
  }

  render() {
    const { workflow, teams } = this.props;
    const { selectedTeam } = this.state;

    return (
      <div className="c-worklfow-overview">
        <div className="c-overview-card">
          <h1 className="s-general-info-title">General</h1>
          <SelectDropdown
            styles={{ marginBottom: "2rem" }}
            onChange={this.handleTeamChange}
            options={teams.map(team => ({ label: team.name, value: team.id }))}
            value={selectedTeam}
            theme="bmrg-flow"
            title="Team"
            placeholder="Select a team"
            noResultsText="No options entered"
          />
          <TextInput
            alwaysShowTitle
            externallyControlled
            required
            value={get(workflow, "data.name", "")}
            title="Name"
            placeholder="Name"
            name="name"
            theme="bmrg-flow"
            onChange={this.handleOnChange}
            noValueText="Enter a name"
            maxChar={64}
            maxCharText={"Name must not be greater than 64 characters"}
            // comparisonData={this.props.teams
            //   .find(team => team.id === this.state.selectedTeam.value)
            //   .workflows.map(workflow => workflow.name)}
            // existValueText="Enter a unique name"
          />
          <TextInput
            alwaysShowTitle
            externallyControlled
            value={get(workflow, "data.shortDescription", "")}
            title="Summary"
            placeholder="Summary"
            name="shortDescription"
            theme="bmrg-flow"
            onChange={this.handleOnChange}
            maxChar={128}
            maxCharText={"Summary must not be greater than 128 characters"}
          />
          <TextArea
            alwaysShowTitle
            externallyControlled
            value={get(workflow, "data.description", "")}
            title="Description"
            placeholder="Description"
            name="description"
            theme="bmrg-flow"
            handleChange={this.handleOnChange}
            maxChar={256}
            maxCharText={"Description must not be greater than 256 characters"}
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
                  onClick={() => this.handleOnChange(image.name, {}, "icon")}
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
            <form className="b-webhook">
              <p id="toggle-webhook" className="b-webhook__title">
                Enable Webhook
              </p>
              <Toggle
                aria-labelledby="toggle-webhook"
                className="b-webhook__toggle"
                name="webhook"
                checked={get(workflow, "data.triggers.webhook.enable", false)}
                onChange={(checked, event, id) => this.handleOnWebhookChange(checked, {}, "enable")}
                theme="bmrg-flow"
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
                  <Button theme="bmrg-flow" onClick={this.generateToken} style={{ marginLeft: "2.2rem" }}>
                    Generate Token
                  </Button>
                )}
            </form>
            {!get(workflow, "data.id", false) && get(workflow, "data.triggers.webhook.enable", false) && (
              <div className="s-webhook-token-message">An API token will be generated on creation of the workflow.</div>
            )}
            {get(workflow, "data.triggers.webhook.token", false) &&
              get(workflow, "data.triggers.webhook.enable", false) && (
                <form className="b-webhook-token" onSubmit={e => e.preventDefault()}>
                  <TextInput
                    disabled
                    externallyControlled
                    value={get(workflow, "data.triggers.webhook.token", "")}
                    placeholder="Token"
                    theme="bmrg-flow"
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
                </form>
              )}
            <div className="c-scheduler">
              <div className="b-schedule">
                <p id="toggle-scheduler" className="b-schedule__title">
                  Enable Scheduler
                </p>
                <Toggle
                  aria-labelledby="toggle-scheduler"
                  className="b-schedule__toggle"
                  checked={get(workflow, "data.triggers.scheduler.enable", false)}
                  name="schedule"
                  onChange={(checked, event, id) => this.handleOnSchedulerChange(checked, {}, "enable")}
                  theme="bmrg-flow"
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
                    initialState={this.props.workflow.data}
                    modalProps={{ shouldCloseOnOverlayClick: false }}
                    theme="bmrg-flow"
                    ModalTrigger={() => (
                      <Button theme="bmrg-flow" style={{ marginLeft: "2.2rem" }}>
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
                          handleOnChange={this.handleOnSchedulerChange}
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
                  Enable Action Subscription
                </p>
                <Toggle
                  aria-labelledby="toggle-event"
                  className="b-event__toggle"
                  checked={get(workflow, "data.triggers.event.enable", false)}
                  name="event"
                  onChange={(checked, event, id) => this.handleOnEventChange(checked, {}, "enable")}
                  theme="bmrg-flow"
                />
                <img
                  className="b-options__infoIcon"
                  src={infoIcon}
                  data-tip
                  data-for="triggers-event-info"
                  alt="Toggle event"
                />
                <Tooltip id="triggers-event-info" place="top">
                  Enable workflow to be triggered by platform actions
                </Tooltip>
              </div>
              {get(workflow, "data.triggers.event.enable", false) && (
                <div className="b-event-topic">
                  <TextInput
                    value={get(workflow, "data.triggers.event.topic", false)}
                    placeholder="Topic"
                    theme="bmrg-flow"
                    onChange={(value, event, id) => this.handleOnEventChange(value, {}, "topic")}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="c-overview-card">
          <h1 className="s-trigger-title">Options</h1>
          <div className="b-options">
            <form className="b-persistence">
              <p id="toggle-persistence-storage" className="b-persistence__title">
                Enable Persistent Storage
              </p>
              <Toggle
                aria-labelledby="toggle-persistence-storage"
                className="b-persistence__toggle"
                checked={get(workflow, "data.enablePersistentStorage", false)}
                name="persistence"
                onChange={(checked, event, id) => this.handleOnChange(checked, {}, "enablePersistentStorage")}
                theme="bmrg-flow"
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
            </form>
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
