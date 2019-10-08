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
      <div className="b-version-switcher-buttons">
        <button disabled={!enabled} onClick={this.fastBackVersion}>
          <PageFirst16
            className={cx("b-version-switcher-buttons__button", { "--disabled": !enabled })}
            alt="first version"
          />
        </button>
        <button disabled={!enabled} onClick={this.backVersion}>
          <ChevronLeft16
            className={cx("b-version-switcher-buttons__button", { "--disabled": !enabled })}
            alt="back one version"
          />
        </button>
      </div>
    );
  };

  renderForwardButtons = enabled => {
    return (
      <div className="b-version-switcher-buttons">
        <button disabled={!enabled} onClick={this.forwardVersion}>
          <ChevronRight16
            className={cx("b-version-switcher-buttons__button", { "--disabled": !enabled })}
            alt="forward one version"
          />
        </button>
        <button disabled={!enabled} onClick={this.fastForwardVersion}>
          <PageLast16
            className={cx("b-version-switcher-buttons__button", { "--disabled": !enabled })}
            alt="last version"
          />
        </button>
      </div>
    );
  };

  render() {
    const { currentRevision, revisionCount } = this.props;

    return (
      <div className="c-version-switcher">
        <div className="c-version-switcher-buttons">
          {this.renderBackButtons(currentRevision > 1)}
          <p className="b-version-switcher-buttons__text">{`Version ${currentRevision || 1}`}</p>
          {this.renderForwardButtons(currentRevision < revisionCount)}
        </div>
      </div>
    );
  }
}

export default VersionSwitcher;
