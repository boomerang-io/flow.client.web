import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowActions } from "State/workflow";
import { notify, Notification } from "@boomerang/boomerang-components/lib/Notifications";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import classnames from "classnames";
import Button from "@boomerang/boomerang-components/lib/Button";
import ModalWrapper from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import TextArea from "@boomerang/boomerang-components/lib/TextArea";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import Toggle from "@boomerang/boomerang-components/lib/Toggle";
import CronJobModal from "./CronJobModal";
import assets from "./assets";
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
    this.state = { ...props.workflow.data, icon: assets[0].name, showScheduleModal: false, showWebhookButton: false };
  }

  /*handleExpression = generatedExpression => {
    this.handleOnChange(generatedExpression || "", {}, "generatedExpression");
  };*/

  generateToken = () => {
    const { workflowActions } = this.props;
    return axios
      .post(`${BASE_SERVICE_URL}/workflow/${this.props.workflow.data.id}/token`)
      .then(response => {
        //const webToken = response.data.token;
        workflowActions.updateWorkflowWebhook({ token: response.data.token });
        notify(
          <Notification type="success" title="Create Workflow" message="Succssfully created workflow and version" />
        );
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
            <div className="c-webhook">
              <p className="s-webhook-title">Enable Webhook</p>
              {!this.props.workflow.data.token && (
                <Toggle
                  className="s-webhook-title__toggle"
                  value={this.state.webhook || false}
                  id="toggle-webhook"
                  name="webhook"
                  title="webhook"
                  onChange={event => this.setState({ showWebhookButton: event.target.checked })}
                  defaultChecked={false}
                  theme="bmrg-white"
                />
              )}
              {this.state.showWebhookButton && (
                <Button theme="bmrg-black" onClick={this.generateToken} style={{ "margin-left": "2.2rem" }}>
                  Generate Token
                </Button>
              )}
            </div>
          )}
          {this.props.workflow.data.token && (
            <div className="c-webhook__token">
              <p className="s-webhook__token-title">Webhook Token:</p>
              <p className="s-webhook__token-value">{this.props.workflow.data.token}</p>
            </div>
          )}
          <div className="c-schedule">
            <p className="s-schedule-title">Enable Scheduler</p>
            <Toggle
              className="s-schedule-title__toggle"
              value={this.state.schedule || false}
              id="toggle-schedule"
              name="schedule"
              title="schedule"
              onChange={event => this.setState({ showScheduleModal: event.target.checked })}
              defaultChecked={false}
              theme="bmrg-black"
            />
            {this.state.showScheduleModal && (
              <ModalWrapper
                initialState={this.state}
                ModalTrigger={() => (
                  <Button theme="bmrg-black" style={{ "margin-left": "2.2rem" }}>
                    Set Schedule
                  </Button>
                )}
                shouldCloseOnOverlayClick={false}
                theme="bmrg-white"
                //newStageNames={newStageNames}
                handleOnChange={this.handleOnChange}
                modalContent={(closeModal, rest) => (
                  <ModalFlow
                    headerTitle="Setup Scheduling"
                    components={components}
                    closeModal={closeModal}
                    confirmModalProps={{ affirmativeAction: closeModal }}
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
