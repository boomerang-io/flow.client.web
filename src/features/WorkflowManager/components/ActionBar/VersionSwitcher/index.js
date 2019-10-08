import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { ChevronLeft16, ChevronRight16, PageFirst16, PageLast16 } from "@carbon/icons-react";
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
            <PageFirst16
              className={cx("b-version-switcher-buttons__button", { "--disabled": !enabled })}
              alt="first version"
            />
          </button>
        </li>
        <li>
          <button disabled={!enabled} onClick={this.backVersion}>
            <ChevronLeft16
              className={cx("b-version-switcher-buttons__button", { "--disabled": !enabled })}
              alt="back one version"
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
            <ChevronRight16
              className={cx("b-version-switcher-buttons__button", { "--disabled": !enabled })}
              alt="forward one version"
            />
          </button>
        </li>
        <li>
          <button disabled={!enabled} onClick={this.fastForwardVersion}>
            <PageLast16
              className={cx("b-version-switcher-buttons__button", { "--disabled": !enabled })}
              alt="last version"
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
