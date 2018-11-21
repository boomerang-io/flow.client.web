import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as webhookActions } from "State/webhook/generate";
import { notify, Notification } from "@boomerang/boomerang-components/lib/Notifications";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import classnames from "classnames";
import Button from "@boomerang/boomerang-components/lib/Button";
import TextArea from "@boomerang/boomerang-components/lib/TextArea";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import Toggle from "@boomerang/boomerang-components/lib/Toggle";
import assets from "./assets";
import CronBuilder from "react-cron-builder";
import "react-cron-builder/dist/bundle.css";
import "./styles.scss";

class Overview extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired
  };

  static defaultProps = {
    workflow: {}
  };

  constructor(props) {
    super(props);
    this.state = { ...props.workflow.data, icon: assets[0].name, webhookToken: null };
    //this.webhookToken = "testToken";
  }

  handleExpression = generatedExpression => {
    this.handleOnChange(generatedExpression || "", {}, "generatedExpression");
  };

  generateToken = () => {
    const { user, webhookActions } = this.props;

    return webhookActions
      .create(`${BASE_SERVICE_URL}/user`, { userId: user.id })
      .then(response => {
        this.webhookToken = response.data.token;
        this.handleOnChange(this.webhookToken, {}, "webhookToken");
        notify(
          <Notification type="success" title="Create Workflow" message="Succssfully created workflow and version" />
        );
        return Promise.resolve();
      })
      .catch(err => {
        notify(<Notification type="error" title="Something's wrong" message="Failed to create workflow and version" />);
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
          <div className="c-webhook">
            <p className="s-webhook-title">Enable Webhook</p>
            <Toggle
              value={this.state.webhook || false}
              id="toggle-webhook"
              name="webhook"
              title="webhook"
              onChange={this.handleOnChange}
              defaultChecked={false}
              theme="bmrg-white"
            />
            <Button theme="bmrg-black" onClick={this.generateToken}>
              Generate Token
            </Button>
          </div>
          {this.state.webhookToken && (
            <div className="c-webhook__token">
              <p className="s-webhook__token-title">Webhook Token:</p>
              <p className="s-webhook__token-value">{this.state.webhookToken}</p>
            </div>
          )}
          <div className="c-schedule">
            <p className="s-schedule-title">Enable Scheduler</p>
            <Toggle
              value={this.state.schedule || false}
              id="toggle-schedule"
              name="schedule"
              title="schedule"
              onChange={this.handleOnChange}
              defaultChecked={false}
              theme="bmrg-white"
            />
            <Button theme="bmrg-black" onClick={this.dummyChange}>
              Set Schedule
            </Button>
          </div>
          <CronBuilder cronExpression="*/4 2,12,22 * * 1-5" onChange={this.handleExpression} showResult={false} />
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
  webhookActions: bindActionCreators(webhookActions, dispatch)
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
