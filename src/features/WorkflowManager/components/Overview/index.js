import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowActions } from "State/workflow";
import { notify, Notification } from "@boomerang/boomerang-components/lib/Notifications";
import classnames from "classnames";
import CopyToClipboard from "react-copy-to-clipboard";
import AlertModal from "@boomerang/boomerang-components/lib/AlertModal";
import Button from "@boomerang/boomerang-components/lib/Button";
import ConfirmModal from "@boomerang/boomerang-components/lib/ConfirmModal";
import ModalWrapper from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
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
  static propTypes = {
    setIsValidOveriew: PropTypes.func.isRequired,
    workflow: PropTypes.object.isRequired
  };

  state = {
    tokenTextType: "password",
    showTokenText: "Show Token",
    copyTokenText: "Copy Token"
  };

  generateToken = () => {
    const { workflowActions } = this.props;
    return axios
      .post(`${BASE_SERVICE_URL}/workflow/${this.props.workflow.data.id}/webhook-token`)
      .then(response => {
        workflowActions.updateTriggersWebhook({ key: "token", value: response.data.token });
        notify(<Notification type="success" title="Create Workflow" message="Succssfully Generated Webhook Token" />);
      })
      .catch(err => {
        notify(<Notification type="error" title="Something's wrong" message="Failed to create webhook token" />);
      });
  };

  handleOnChange = (value, errors, name) => {
    this.props.workflowActions.updateProperty({ key: name, value });
    this.determineIsValidForm(errors);
  };

  handleOnWebhookChange = (value, errors, name) => {
    this.props.workflowActions.updateTriggersWebhook({ key: name, value });
    this.determineIsValidForm(errors);
  };

  handleOnSchedulerChange = (value, errors, name) => {
    this.props.workflowActions.updateTriggersScheduler({ key: name, value });
    this.determineIsValidForm(errors);
  };

  handleShowToken = () => {
    if (this.state.tokenTextType === "text") {
      this.setState({ tokenTextType: "password", showTokenText: "Show Token" });
    } else {
      this.setState({ tokenTextType: "text", showTokenText: "Hide Token" });
    }
  };

  determineIsValidForm(errors) {
    if (Object.keys(errors).length) {
      this.props.setIsValidOveriew(false);
    } else {
      this.props.setIsValidOveriew(true);
    }
  }

  render() {
    const { workflow } = this.props;
    return (
      <div className="c-worklfow-overview">
        <div className="c-general-info">
          <h1 className="s-general-info-title">General</h1>
          <TextInput
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
          />
          <TextInput
            value={workflow.data.shortDescription || ""}
            title="Summary"
            placeholder="Summary"
            name="shortDescription"
            theme="bmrg-white"
            onChange={this.handleOnChange}
            maxChar={128}
            maxCharText={"Summary must not be greater than 128 characters"}
            required={false}
          />
          <TextArea
            detail={workflow.data.description || ""}
            title="Description"
            placeholder="Description"
            name="description"
            theme="bmrg-white"
            handleChange={this.handleOnChange}
            maxChar={256}
            maxCharText={"Description must not be greater than 256 characters"}
            required={false}
          />
          <h2 className="s-workflow-icons-title">Icon</h2>
          <div className="b-workflow-icons">
            {assets.map(image => (
              <img
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
        <div className="c-trigger">
          <h1 className="s-trigger-title">Triggers</h1>
          {workflow.data.id && (
            <div className="b-webhook">
              <label className="b-webhook__title">Enable Webhook</label>

              <Toggle
                className="b-webhook__toggle"
                value={workflow.data.triggers.webhook.enable}
                id="toggle-webhook"
                name="webhook"
                title="webhook"
                onChange={event => this.handleOnWebhookChange(event.target.checked, {}, "enable")}
                defaultChecked={workflow.data.triggers.webhook.enable}
                theme="bmrg-white"
              />

              {workflow.data.triggers &&
                workflow.data.triggers.webhook.enable &&
                !workflow.data.triggers.webhook.token && (
                  <Button theme="bmrg-black" onClick={this.generateToken} style={{ marginLeft: "2.2rem" }}>
                    Generate Token
                  </Button>
                )}
            </div>
          )}
          {workflow.data.triggers && workflow.data.triggers.webhook.token && (
            <form className="b-webhook-token">
              <TextInput
                value={workflow.data.triggers.webhook.token}
                placeholder="Token"
                theme="bmrg-white"
                type={this.state.tokenTextType}
                disabled={true}
                externallyControlled={true}
              />
              <img
                className="b-webhook-token__icon"
                src={eyeIcon}
                data-tip
                data-for={"webhook-token-eyeIcon"}
                alt="Show/Hide Token"
                onClick={this.handleShowToken}
              />
              <ToolTip
                className="b-webhook-token__icon-tooltip"
                id="webhook-token-eyeIcon"
                theme="bmrg-white"
                place="top"
              >
                {this.state.showTokenText}
              </ToolTip>
              <CopyToClipboard text={workflow.data.triggers ? workflow.data.triggers.webhook.token : ""}>
                <img
                  className="b-webhook-token__icon"
                  src={copyIcon}
                  data-tip
                  data-for="webhook-token-copyIcon"
                  alt="Copy Token"
                  onClick={() => this.setState({ copyTokenText: "Copied Token" })}
                  onMouseLeave={() => this.setState({ copyTokenText: "Copy Token" })}
                />
              </CopyToClipboard>
              <ToolTip
                className="b-webhook-token__icon-tooltip"
                id="webhook-token-copyIcon"
                theme="bmrg-white"
                place="top"
              >
                {this.state.copyTokenText}
              </ToolTip>

              <div>
                <ToolTip place="top" id="webhook-token-refreshIcon" theme="bmrg-white">
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
                      alt="Regenerate Token"
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
              <label className="b-schedule__title">Enable Scheduler</label>
              <Toggle
                className="b-schedule__toggle"
                value={workflow.data.triggers.scheduler.enable}
                id="toggle-schedule"
                name="schedule"
                title="schedule"
                onChange={event => this.handleOnSchedulerChange(event.target.checked, {}, "enable")}
                defaultChecked={workflow.data.triggers.scheduler.enable}
                theme="bmrg-black"
              />
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
            <div className="c-trigger__cronMessage">
              {workflow.data.triggers &&
              workflow.data.triggers.scheduler.schedule &&
              workflow.data.triggers.scheduler.enable
                ? cronstrue.toString(workflow.data.triggers.scheduler.schedule)
                : undefined}
            </div>
            <div className="c-trigger__timezone">
              {workflow.data.triggers &&
              workflow.data.triggers.scheduler.timezone &&
              workflow.data.triggers.scheduler.enable
                ? `Timezone: ${workflow.data.triggers.scheduler.timezone}`
                : undefined}
            </div>
          </div>
          <div className="b-options">
            <h1 className="b-options-title">Options</h1>
            <div className="b-persistence">
              <label className="b-persistence__title">Enable Persistent Storage</label>
              <Toggle
                className="b-persistence__toggle"
                value={workflow.data.enablePersistentStorage}
                id="toggle-persistence"
                name="persistence"
                title="persistence"
                onChange={event => this.handleOnChange(event.target.checked, {}, "enablePersistentStorage")}
                defaultChecked={workflow.data.enablePersistentStorage}
                theme="bmrg-white"
              />
              <img
                className="b-options__infoIcon"
                src={infoIcon}
                data-tip
                data-for="b-options__infoIcon"
                alt="Show/Hide Token"
              />
              <ToolTip className="b-options__icon-tooltip" id="b-options__infoIcon" theme="bmrg-white" place="bottom">
                Persist workflow data between executions
              </ToolTip>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Overview.propTypes = {
  //handleOnChange: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};
const mapDispatchToProps = dispatch => ({
  workflowActions: bindActionCreators(workflowActions, dispatch)
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
