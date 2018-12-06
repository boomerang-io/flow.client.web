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

  static defaultProps = {
    workflow: {}
  };

  constructor(props) {
    super(props);
    const { overviewData } = props;
    this.state = {
      ...props.workflow.data,
      name: overviewData ? overviewData.name : "",
      shortDescription: overviewData ? overviewData.name : "",
      description: overviewData ? overviewData.name : "",
      icon: overviewData ? overviewData.name : assets[0].name,
      schedulerEnable: overviewData && overviewData.triggers ? overviewData.triggers.scheduler.enable : false,
      webhookEnable: overviewData && overviewData.triggers ? overviewData.triggers.webhook.enable : false,
      schedule: overviewData && overviewData.triggers ? overviewData.triggers.scheduler.schedule : false,
      token: overviewData && overviewData.triggers ? overviewData.triggers.webhook.token : false,
      tokenTextType: "text"
    };
  }

  generateToken = () => {
    const { workflowActions } = this.props;
    return axios
      .post(`${BASE_SERVICE_URL}/workflow/${this.props.workflow.data.id}/token`)
      .then(response => {
        workflowActions.updateWorkflowWebhook({ token: response.data.token });
        this.handleOnChange(response.data.token, {}, "token");
        notify(<Notification type="success" title="Create Workflow" message="Succssfully Generated Webhook Token" />);
        return Promise.resolve();
      })
      .catch(err => {
        notify(<Notification type="error" title="Something's wrong" message="Failed to create webhook token" />);
        return Promise.reject();
      });
  };

  handleOnChange = (value, errors, name) => {
    this.setState(
      () => ({
        [name]: value
      }),
      () => this.props.handleOnChange(this.state)
    );
  };

  handleShowToken = () => {
    if (this.state.tokenTextType === "text") {
      this.setState({ tokenTextType: "password" });
    } else {
      this.setState({ tokenTextType: "text" });
    }
  };

  render() {
    return (
      <div className="c-worklfow-overview">
        <div className="c-general-info">
          <h1 className="s-general-info-title">General</h1>
          <TextInput
            value={this.state.name || ""}
            title="Name"
            placeholder="Name"
            name="name"
            theme="bmrg-white"
            onChange={this.handleOnChange}
            noValueText="Enter a name"
          />
          <TextInput
            value={this.state.shortDescription || ""}
            title="Summary"
            placeholder="Summary"
            name="shortDescription"
            theme="bmrg-white"
            onChange={this.handleOnChange}
          />
          <TextArea
            detail={this.state.description || ""}
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
                  "--active": this.state.icon === image.name
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
          {this.props.workflow.data.id && (
            <div className="b-webhook">
              <label className="b-webhook__title">Enable Webhook</label>

              <Toggle
                className="b-webhook__toggle"
                value={this.state.webhook || false}
                id="toggle-webhook"
                name="webhook"
                title="webhook"
                onChange={event => this.handleOnChange(event.target.checked, {}, "webhookEnable")}
                defaultChecked={false}
                theme="bmrg-white"
              />

              {this.state.webhookEnable &&
                !this.props.workflow.data.token && (
                  <Button theme="bmrg-black" onClick={this.generateToken} style={{ marginLeft: "2.2rem" }}>
                    Generate Token
                  </Button>
                )}
            </div>
          )}
          {this.props.workflow.data.token && (
            <fieldset className="b-webhook__token">
              <TextInput
                value={this.props.workflow.data.token || ""}
                placeholder="Token"
                theme="bmrg-white"
                type={this.state.tokenTextType}
                disabled={true}
              />
              <img src={eyeIcon} onClick={this.handleShowToken} className="b-webhook__token-eyeIcon" />
              <CopyToClipboard text={this.props.workflow.data.token}>
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
              value={this.state.schedule || false}
              id="toggle-schedule"
              name="schedule"
              title="schedule"
              onChange={event => this.handleOnChange(event.target.checked, {}, "schedulerEnable")}
              defaultChecked={false}
              theme="bmrg-black"
            />
            {this.state.schedulerEnable && (
              <ModalWrapper
                initialState={this.state}
                ModalTrigger={() => (
                  <Button theme="bmrg-black" style={{ marginLeft: "2.2rem" }}>
                    Set Schedule
                  </Button>
                )}
                shouldCloseOnOverlayClick={false}
                theme="bmrg-white"
                handleOnChange={this.handleOnChange}
                cronExpression={this.state.schedule}
                modalContent={(closeModal, rest) => (
                  <ModalFlow headerTitle="Setup Scheduling" components={components} closeModal={closeModal} {...rest} />
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
  handleOnChange: PropTypes.func.isRequired
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
