import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Link from "@boomerang/boomerang-components/lib/Link";
import close from "Assets/svg/close.svg";
import "./styles.scss";

const SLACK_TEAM_ID = "T27TLPNS1";
const SLACK_FLOW_USERS_CHANNEL_ID = "CFKN6FJD6";

class NotificationBanner extends Component {
  static propTypes = {
    closeBanner: PropTypes.func
  };

  state = {
    isOpen: true
  };

  closeBanner = () => {
    this.setState({ isOpen: false });
    this.props.closeBanner();
  };

  render() {
    return (
      <div className={classnames("b-notification-banner", { "--hidden": !this.state.isOpen })}>
        <div className="b-notification-banner__text">
          Welcome to Boomerang Flow! We're excited to have a beta release and hope you enjoy using it. You may notice a
          bug or two. Please don't hesitate to reach out to us on Slack in{" "}
          {
            <Link href={`slack://channel?team=${SLACK_TEAM_ID}&id=${SLACK_FLOW_USERS_CHANNEL_ID}`}>
              @bmrg-flow-users
            </Link>
          }
          . Thanks!
        </div>
        <img onClick={this.closeBanner} src={close} className="b-notification-banner__close-icon" alt="Close" />
      </div>
    );
  }
}

export default NotificationBanner;
