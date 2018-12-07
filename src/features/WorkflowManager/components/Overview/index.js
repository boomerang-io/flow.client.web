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
import CronJobModal from "./CronJobModal";
import assets from "./assets";
import copyIcon from "./assets/copy.svg";
import eyeIcon from "./assets/eye.svg";
import refreshIcon from "./assets/refresh.svg";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import "./styles.scss";

const components = [{ step: 0, component: CronJobModal }];

class Overview extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired
  };

  state = {
    tokenTextType: "text"
  };

  generateToken = () => {
    const { workflowActions } = this.props;
    return axios
      .post(`${BASE_SERVICE_URL}/workflow/${this.props.workflow.data.id}/token`)
      .then(response => {
        //workflowActions.updateWorkflowWebhook({ token: response.data.token });
        workflowActions.updateTriggersWebhook({ key: "token", value: response.data.token });
        //this.handleOnWebhookChange(response.data.token, {}, "token");
        notify(<Notification type="success" title="Create Workflow" message="Succssfully Generated Webhook Token" />);
      })
      .catch(err => {
        notify(<Notification type="error" title="Something's wrong" message="Failed to create webhook token" />);
      });
  };

  handleOnChange = (value, errors, name) => {
    this.props.workflowActions.updateProperty({ key: name, value });
  };

  handleOnWebhookChange = (value, errors, name) => {
    this.props.workflowActions.updateTriggersWebhook({ key: name, value });
  };

  handleOnSchedulerChange = (value, errors, name) => {
    this.props.workflowActions.updateTriggersScheduler({ key: name, value });
  };

  //Custom functions for updating the triggers state object

  // const webhook = {...this.workflow.data.triggers};
  // const triggers = { ...this.workflow.data.triggers, webhook: {...webhook, newvalue: ""}}

  handleShowToken = () => {
    if (this.state.tokenTextType === "text") {
      this.setState({ tokenTextType: "password" });
    } else {
      this.setState({ tokenTextType: "text" });
    }
  };

  render() {
    const { workflow } = this.props;
    return (
      <div className="c-worklfow-overview">
        <div className="c-general-info">
          <h1 className="s-general-info-title">General</h1>
          <TextInput
            value={workflow.data.name || ""}
            title="Name"
            placeholder="Name"
            name="name"
            theme="bmrg-white"
            onChange={this.handleOnChange}
            noValueText="Enter a name"
          />
          <TextInput
            value={workflow.data.shortDescription || ""}
            title="Summary"
            placeholder="Summary"
            name="shortDescription"
            theme="bmrg-white"
            onChange={this.handleOnChange}
          />
          <TextArea
            detail={workflow.data.description || ""}
            title="Description"
            placeholder="Description"
            name="description"
            theme="bmrg-white"
            handleChange={this.handleOnChange}
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
                //value={workflow.data.triggers ? workflow.data.triggers.webhook.enable : false}
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
          {workflow.data.triggers &&
            workflow.data.triggers.webhook.token && (
              <fieldset className="b-webhook__token">
                <TextInput
                  value={workflow.data.triggers ? workflow.data.triggers.webhook.token : ""}
                  placeholder="Token"
                  theme="bmrg-white"
                  type={this.state.tokenTextType}
                  disabled={true}
                />
                <img src={eyeIcon} onClick={this.handleShowToken} className="b-webhook__token-eyeIcon" />
                <CopyToClipboard text={workflow.data.triggers ? workflow.data.triggers.webhook.token : ""}>
                  <img src={copyIcon} className="b-webhook__token-copyIcon" />
                </CopyToClipboard>
                <div className="b-webhook__token-Modal">
                  <AlertModal
                    style={{ display: "inline" }}
                    ModalTrigger={() => <img src={refreshIcon} className="b-webhook__token-refreshIcon" />}
                    modalContent={(closeModal, rest) => (
                      <ConfirmModal
                        closeModal={closeModal}
                        affirmativeAction={this.generateToken}
                        title="Generate a new Webhook Token?"
                        subTitleTop="This previous token will be deleted"
                        cancelText="NO"
                        affirmativeText="YES"
                        {...rest}
                      />
                    )}
                  />
                </div>
              </fieldset>
            )}
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
            {workflow.data.triggers &&
              workflow.data.triggers.scheduler.enable && (
                <ModalWrapper
                  initialState={this.props.workflow.data}
                  ModalTrigger={() => (
                    <Button theme="bmrg-black" style={{ marginLeft: "2.2rem" }}>
                      Set Schedule
                    </Button>
                  )}
                  shouldCloseOnOverlayClick={false}
                  theme="bmrg-white"
                  handleOnChange={this.handleOnSchedulerChange}
                  cronExpression={workflow.data.triggers ? workflow.data.triggers.scheduler.schedule : ""}
                  modalContent={(closeModal, rest) => (
                    <ModalFlow
                      headerTitle="Setup Scheduling"
                      components={components}
                      closeModal={closeModal}
                      {...rest}
                    />
                  )}
                />
              )}
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
