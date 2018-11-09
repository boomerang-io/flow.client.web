import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import chevron from "Assets/svg/chevron_gray.svg";
import doubleChevron from "Assets/svg/double_chevron.svg";
import "./styles.scss";

class VersionSwitcher extends Component {
  static propTypes = {
    initialVersion: PropTypes.number,
    versionsTotal: PropTypes.number.isRequired,
    onChangeVersion: PropTypes.func.isRequired
  };

  state = {
    currentVersion: this.props.initialVersion || 1
  };

  backVersion = () => {
    this.setState(
      prevState => ({ currentVersion: prevState.currentVersion - 1 }),
      () => {
        this.onChangeVersion();
      }
    );
  };

  fastBackVersion = () => {
    this.setState({ currentVersion: 1 }, () => {
      this.onChangeVersion();
    });
  };

  forwardVersion = () => {
    this.setState(
      prevState => ({ currentVersion: prevState.currentVersion + 1 }),
      () => {
        this.onChangeVersion();
      }
    );
  };

  fastForwardVersion = () => {
    this.setState({ currentVersion: this.props.versionsTotal }, () => {
      this.onChangeVersion();
    });
  };

  onChangeVersion = () => {
    this.props.onChangeVersion(this.state.currentVersion);
  };

  renderBackButtons = enabled => {
    return (
      <div className="b-version-switcher-buttons">
        <img
          src={doubleChevron}
          onClick={enabled ? this.fastBackVersion : () => {}}
          className={classnames("b-version-switcher-buttons__backward", { "--disabled": !enabled })}
          alt="fastbackward"
        />
        <img
          src={chevron}
          onClick={enabled ? this.backVersion : () => {}}
          className={classnames("b-version-switcher-buttons__backward", { "--disabled": !enabled })}
          alt="backward"
        />
      </div>
    );
  };

  renderForwardButtons = enabled => {
    return (
      <div className="b-version-switcher-buttons">
        <img
          src={chevron}
          onClick={enabled ? this.forwardVersion : () => {}}
          className={classnames("b-version-switcher-buttons__forward", { "--disabled": !enabled })}
          alt="forward"
        />
        <img
          src={doubleChevron}
          onClick={enabled ? this.fastForwardVersion : () => {}}
          className={classnames("b-version-switcher-buttons__forward", { "--disabled": !enabled })}
          alt="fastforward"
        />
      </div>
    );
  };

  render() {
    const { versionsTotal } = this.props;
    const { currentVersion } = this.state;

    return (
      <div className="c-version-switcher">
        <div className="s-version-switcher-text">
          Version {currentVersion} of {versionsTotal}
        </div>
        <div className="c-version-switcher-buttons">
          {this.renderBackButtons(currentVersion > 1)}
          {this.renderForwardButtons(currentVersion < versionsTotal)}
        </div>
      </div>
    );
  }
}

export default VersionSwitcher;
