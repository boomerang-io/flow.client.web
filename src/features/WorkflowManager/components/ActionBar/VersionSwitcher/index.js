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
      <ul className="b-version-switcher-buttons">
        <li>
          <button disabled={!enabled} onClick={this.fastBackVersion}>
            <img
              src={doubleChevron}
              className={classnames("b-version-switcher-buttons__backward", { "--disabled": !enabled })}
              alt="fastbackward"
            />
          </button>
        </li>
        <li>
          <button disabled={!enabled} onClick={this.backVersion}>
            <img
              src={chevron}
              className={classnames("b-version-switcher-buttons__backward", { "--disabled": !enabled })}
              alt="backward"
            />
          </button>
        </li>
      </ul>
    );
  };

  renderForwardButtons = enabled => {
    return (
      <ul className="b-version-switcher-buttons">
        <li>
          <button disabled={!enabled} onClick={this.forwardVersion}>
            <img
              src={chevron}
              className={classnames("b-version-switcher-buttons__forward", { "--disabled": !enabled })}
              alt="forward"
            />
          </button>
        </li>
        <li>
          <button disabled={!enabled} onClick={this.forwardVersion}>
            <img
              src={doubleChevron}
              className={classnames("b-version-switcher-buttons__forward", { "--disabled": !enabled })}
              alt="fastforward"
            />
          </button>
        </li>
      </ul>
    );
  };

  render() {
    const { currentRevision, revisionCount } = this.props;

    return (
      <div className="c-version-switcher">
        <div className="s-version-switcher-text">
          Version {currentRevision} of {revisionCount !== 0 ? revisionCount : 1}
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
