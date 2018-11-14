import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import close from "Assets/svg/close.svg";
import "./styles.scss";

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
    const text =
      "Welcome to Boomerang Flow. We are excited to release an Alpha release and hope you enjoy using it. Occasionally you may notice a bug or an issue, don’t be alarmed, this is still in active development. Feel free to let us know on slack @twlawrie, @trbula or @mdroy";

    return (
      <div className={classnames("b-notification-banner", { "--hidden": !this.state.isOpen })}>
        <div className="b-notification-banner__text">{text}</div>
        <img onClick={this.closeBanner} src={close} className="b-notification-banner__close-icon" alt="close" />
      </div>
    );
  }
}

export default NotificationBanner;
