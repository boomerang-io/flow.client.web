import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import classnames from "classnames";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowActions } from "State/workflow";
import { actions as teamsActions } from "State/teams";
import { notify, Notification } from "@boomerang/boomerang-components/lib/Notifications";
import CopyToClipboard from "react-copy-to-clipboard";
import AlertModal from "@boomerang/boomerang-components/lib/AlertModal";
import Button from "@boomerang/boomerang-components/lib/Button";
import ConfirmModal from "@boomerang/boomerang-components/lib/ConfirmModal";
import ModalWrapper from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import SelectDropdown from "@boomerang/boomerang-components/lib/SelectDropdown";
import TextArea from "@boomerang/boomerang-components/lib/TextArea";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import Toggle from "@boomerang/boomerang-components/lib/Toggle";
import ToolTip from "@boomerang/boomerang-components/lib/Tooltip";
import CronJobModal from "./CronJobModal";
import assets from "./assets";
import cronstrue from "cronstrue";
import copyIcon from "./assets/copy.svg";
import eyeIcon from "./assets/eye.svg";
import infoIcon from "./assets/info.svg";
import refreshIcon from "./assets/refresh.svg";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import "./styles.scss";

const components = [{ step: 0, component: CronJobModal }];

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
    setIsValidOveriew: PropTypes.func.isRequired,
    teams: PropTypes.array.isRequired,
    teamsActions: PropTypes.object.isRequired,
    workflow: PropTypes.object.isRequired,
    workflowActions: PropTypes.object.isRequired
  };

  generateToken = () => {
    const { workflowActions } = this.props;
    return axios
      .post(`${BASE_SERVICE_URL}/workflow/${this.props.workflow.data.id}/webhook-token`)
      .then(response => {
        workflowActions.updateTriggersWebhook({
          key: "token",
          value: response.data.token
        });
        notify(<Notification type="success" title="Create Workflow" message="Successfully Generated Webhook Token" />);
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
      this.props.teamsActions.setActiveTeam({ teamId: selectedTeam.value });
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
      return this.props.setIsValidOveriew(false);
    }
    //if there are no keys on the error object than no need to check anything
    if (!errorKeys.length) {
      return this.props.setIsValidOveriew(true);
    }
    //look for at least error key that is set to an object with keys aka has errors
    let isValidOveriew = true;
    errorKeys.forEach(errorKey => {
      if (Object.keys(this.state.errors[errorKey]).length) {
        isValidOveriew = false;
      }
    });
    return this.props.setIsValidOveriew(isValidOveriew);
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
            theme="bmrg-white"
            title="Team"
            placeholder="Select a team"
            noResultsText="No options entered"
          />
          <TextInput
            alwaysShowTitle
            externallyControlled
            required
            value={workflow.data.name || ""}
            title="Name"
            placeholder="Name"
            name="name"
            theme="bmrg-white"
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
            value={workflow.data.shortDescription || ""}
            title="Summary"
            placeholder="Summary"
            name="shortDescription"
            theme="bmrg-white"
            onChange={this.handleOnChange}
            maxChar={128}
            maxCharText={"Summary must not be greater than 128 characters"}
          />
          <TextArea
            alwaysShowTitle
            externallyControlled
            value={workflow.data.description || ""}
            title="Description"
            placeholder="Description"
            name="description"
            theme="bmrg-white"
            handleChange={this.handleOnChange}
            maxChar={256}
            maxCharText={"Description must not be greater than 256 characters"}
          />
          <h2 className="s-workflow-icons-title">Icon</h2>
          <div className="b-workflow-icons">
            {assets.map((image, index) => (
              <img
                key={`${image.name}-${index}`}
                className={classnames("b-workflow-icons__icon", {
                  "--active": workflow.data.icon === image.name
                })}
                src={image.src}
                onClick={() => this.handleOnChange(image.name, {}, "icon")}
                alt={`${image.name} icon`}
              />
            ))}
          </div>
        </div>
        <div className="c-overview-card">
          <h1 className="s-trigger-title">Triggers</h1>
          <div className="c-webhook">
            <div className="b-webhook">
              <label id="toggle-webhook" className="b-webhook__title">
                Enable Webhook
              </label>
              <Toggle
                aria-labelledby="toggle-webhook"
                className="b-webhook__toggle"
                name="webhook"
                checked={workflow.data.triggers.webhook.enable}
                onChange={event => this.handleOnWebhookChange(event.target.checked, {}, "enable")}
                theme="bmrg-white"
                red
              />
              <img
                className="b-options__infoIcon"
                src={infoIcon}
                data-tip
                data-for="triggers-webhook-info"
                alt="Toggle webhook"
              />
              <ToolTip className="b-options__icon-tooltip" id="triggers-webhook-info" theme="bmrg-white" place="top">
                Enable workflow to be executed via webhook
              </ToolTip>
              {workflow.data.id &&
                workflow.data.triggers &&
                workflow.data.triggers.webhook.enable &&
                !workflow.data.triggers.webhook.token && (
                  <Button theme="bmrg-black" onClick={this.generateToken} style={{ marginLeft: "2.2rem" }}>
                    Generate Token
                  </Button>
                )}
            </div>
            {!workflow.data.id && workflow.data.triggers && workflow.data.triggers.webhook.enable && (
              <div className="s-webhook-token-message">An API token will be generated on creation of the workflow.</div>
            )}
            {workflow.data.triggers && workflow.data.triggers.webhook.token && workflow.data.triggers.webhook.enable && (
              <form className="b-webhook-token">
                <TextInput
                  disabled
                  externallyControlled
                  value={workflow.data.triggers.webhook.token}
                  placeholder="Token"
                  theme="bmrg-white"
                  type={this.state.tokenTextType}
                />
                <img
                  className="b-webhook-token__icon"
                  src={eyeIcon}
                  data-tip
                  data-for="webhook-token-eyeIcon"
                  alt="Show/Hide token"
                  onClick={this.handleShowToken}
                />
                <ToolTip className="b-options__icon-tooltip" id="webhook-token-eyeIcon" theme="bmrg-white" place="top">
                  {this.state.showTokenText}
                </ToolTip>
                <CopyToClipboard text={workflow.data.triggers ? workflow.data.triggers.webhook.token : ""}>
                  <img
                    className="b-webhook-token__icon"
                    src={copyIcon}
                    data-tip
                    data-for="webhook-token-copyIcon"
                    alt="Copy token"
                    onClick={() => this.setState({ copyTokenText: "Copied Token" })}
                    onMouseLeave={() => this.setState({ copyTokenText: "Copy Token" })}
                  />
                </CopyToClipboard>
                <ToolTip className="b-options__icon-tooltip" id="webhook-token-copyIcon" theme="bmrg-white" place="top">
                  {this.state.copyTokenText}
                </ToolTip>
                <div>
                  <ToolTip
                    className="b-options__icon-tooltip"
                    place="top"
                    id="webhook-token-refreshIcon"
                    theme="bmrg-white"
                  >
                    Regenerate Token
                  </ToolTip>
                  <AlertModal
                    theme="bmrg-white"
                    ModalTrigger={() => (
                      <img
                        src={refreshIcon}
                        className="b-webhook-token__icon"
                        data-tip
                        data-for="webhook-token-refreshIcon"
                        alt="Regenerate token"
                      />
                    )}
                    modalContent={(closeModal, rest) => (
                      <ConfirmModal
                        closeModal={closeModal}
                        affirmativeAction={this.generateToken}
                        title="Generate a New Webhook Token?"
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
                <label id="toggle-scheduler" className="b-schedule__title">
                  Enable Scheduler
                </label>
                <Toggle
                  aria-labelledby="toggle-scheduler"
                  className="b-schedule__toggle"
                  checked={workflow.data.triggers.scheduler.enable}
                  name="schedule"
                  onChange={event => this.handleOnSchedulerChange(event.target.checked, {}, "enable")}
                  theme="bmrg-black"
                  red
                />
                <img
                  className="b-options__infoIcon"
                  src={infoIcon}
                  data-tip
                  data-for="triggers-scheduler-info"
                  alt="Toggle scheduler"
                />
                <ToolTip
                  className="b-options__icon-tooltip"
                  id="triggers-scheduler-info"
                  theme="bmrg-white"
                  place="top"
                >
                  Enable workflow to be executed by a schedule
                </ToolTip>
                {workflow.data.triggers && workflow.data.triggers.scheduler.enable && (
                  <ModalWrapper
                    initialState={this.props.workflow.data}
                    shouldCloseOnOverlayClick={false}
                    theme="bmrg-white"
                    ModalTrigger={() => (
                      <Button theme="bmrg-black" style={{ marginLeft: "2.2rem" }}>
                        Set Schedule
                      </Button>
                    )}
                    modalContent={(closeModal, rest) => (
                      <ModalFlow
                        headerTitle="Setup Scheduling"
                        components={components}
                        closeModal={closeModal}
                        handleOnChange={this.handleOnSchedulerChange}
                        timeZone={workflow.data.triggers ? workflow.data.triggers.scheduler.timezone : ""}
                        cronExpression={workflow.data.triggers ? workflow.data.triggers.scheduler.schedule : ""}
                        confirmModalProps={{ affirmativeAction: () => closeModal(), theme: "bmrg-white" }}
                        {...rest}
                      />
                    )}
                  />
                )}
              </div>
              <div className="b-schedule__cronMessage">
                {workflow.data.triggers &&
                workflow.data.triggers.scheduler.schedule &&
                workflow.data.triggers.scheduler.enable
                  ? cronstrue.toString(workflow.data.triggers.scheduler.schedule)
                  : undefined}
              </div>
              <div className="b-schedule__timezone">
                {workflow.data.triggers &&
                workflow.data.triggers.scheduler.timezone &&
                workflow.data.triggers.scheduler.enable
                  ? `${workflow.data.triggers.scheduler.timezone} Timezone`
                  : undefined}
              </div>
            </div>
          </div>
        </div>
        <div className="c-overview-card">
          <h1 className="s-trigger-title">Options</h1>
          <div className="b-options">
            <div className="b-persistence">
              <label id="toggle-persistence-storage" className="b-persistence__title">
                Enable Persistent Storage
              </label>
              <Toggle
                aria-labelledby="toggle-persistence-storage"
                className="b-persistence__toggle"
                checked={workflow.data.enablePersistentStorage}
                name="persistence"
                onChange={event => this.handleOnChange(event.target.checked, {}, "enablePersistentStorage")}
                theme="bmrg-white"
                red
              />
              <img
                className="b-options__infoIcon"
                src={infoIcon}
                data-tip
                data-for="options-persistence-info"
                alt="Toggle persistence"
              />
              <ToolTip className="b-options__icon-tooltip" id="options-persistence-info" theme="bmrg-white" place="top">
                Persist workflow data between executions
              </ToolTip>
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
    activeTeamId: state.teams.activeTeamId
  };
};
const mapDispatchToProps = dispatch => ({
  teamsActions: bindActionCreators(teamsActions, dispatch),
  workflowActions: bindActionCreators(workflowActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
