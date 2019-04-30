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
      <div className="b-version-switcher-buttons">
        <button className="b-img-button" onClick={enabled ? this.fastBackVersion : () => {}}>
          <img
            src={doubleChevron}
            className={classnames("b-version-switcher-buttons__backward", { "--disabled": !enabled })}
            alt="fastbackward"
          />
        </button>
        <button className="b-img-button" onClick={enabled ? this.backVersion : () => {}}>
          <img
            src={chevron}
            className={classnames("b-version-switcher-buttons__backward", { "--disabled": !enabled })}
            alt="backward"
          />
        </button>
      </div>
    );
  };

  renderForwardButtons = enabled => {
    return (
      <div className="b-version-switcher-buttons">
        <button className="b-img-button" onClick={enabled ? this.forwardVersion : () => {}}>
          <img
            src={chevron}
            className={classnames("b-version-switcher-buttons__forward", { "--disabled": !enabled })}
            alt="forward"
          />
        </button>
        <button className="b-img-button" onClick={enabled ? this.fastForwardVersion : () => {}}>
          <img
            src={doubleChevron}
            className={classnames("b-version-switcher-buttons__forward", { "--disabled": !enabled })}
            alt="fastforward"
          />
        </button>
      </div>
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
