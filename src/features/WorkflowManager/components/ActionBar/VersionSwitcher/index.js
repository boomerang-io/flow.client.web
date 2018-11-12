import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import chevron from "Assets/svg/chevron_gray.svg";
import doubleChevron from "Assets/svg/double_chevron.svg";
import "./styles.scss";

class VersionSwitcher extends Component {
  static propTypes = {
    currentRevision: PropTypes.number,
    revisionCount: PropTypes.number.isRequired,
    onChangeVersion: PropTypes.func.isRequired
  };

  state = {
    currentRevision: this.props.currentRevision
  };

  backVersion = () => {
    this.props.onChangeVersion(this.props.currentRevision - 1);
  };

  fastBackVersion = () => {
    this.props.onChangeVersion(1);
  };

  forwardVersion = () => {
    this.props.onChangeVersion(this.props.currentRevision + 1);
  };

  fastForwardVersion = () => {
    this.props.onChangeVersion(this.props.revisionCount);
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
    const { currentRevision, revisionCount } = this.props;

    return (
      <div className="c-version-switcher">
        <div className="s-version-switcher-text">
          Version {currentRevision} of {revisionCount}
        </div>
        <div className="c-version-switcher-buttons">
          {this.renderBackButtons(currentRevision > 1)}
          {this.renderForwardButtons(currentRevision < revisionCount)}
        </div>
      </div>
    );
  }
}

export default VersionSwitcher;
