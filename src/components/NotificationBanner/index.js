import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Link from "@boomerang/boomerang-components/lib/Link";
import close from "Assets/svg/close.svg";
import "./styles.scss";

const SLACK_TEAM_ID = "T27TLPNS1";

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
          Welcome to Boomerang Flow! We are excited to have an Beta release and hope you enjoy using it. You may notice
          a bug or two. Please don't hesitate to reach out to us on Slack at{" "}
          {<Link href={`slack://user?team=${SLACK_TEAM_ID}&id=W3FECR56F`}>@twlawrie</Link>},{" "}
          {<Link href={`slack://user?team=${SLACK_TEAM_ID}&id=W3FECR45R`}>@trbula</Link>}, or{" "}
          {<Link href={`slack://user?team=${SLACK_TEAM_ID}&id=W3FJMSSQ4`}>@mdroy</Link>}. Thanks!
        </div>
        <img onClick={this.closeBanner} src={close} className="b-notification-banner__close-icon" alt="close" />
      </div>
    );
  }
}

export default NotificationBanner;
