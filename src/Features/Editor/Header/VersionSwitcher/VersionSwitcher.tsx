// @ts-nocheck
import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { ChevronLeft16, ChevronRight16, PageFirst16, PageLast16 } from "@carbon/icons-react";
import styles from "./VersionSwitcher.module.scss";

class VersionSwitcher extends Component {
  static propTypes = {
    currentRevision: PropTypes.number,
    revisionCount: PropTypes.number.isRequired,
    onChangeVersion: PropTypes.func.isRequired,
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

  renderBackButtons = (enabled) => {
    return (
      <div className={styles.buttonList}>
        <button className={styles.button} disabled={!enabled} onClick={this.fastBackVersion}>
          <PageFirst16 className={cx(styles.icon, { [styles.disabled]: !enabled })} alt="first version" />
        </button>
        <button className={styles.button} disabled={!enabled} onClick={this.backVersion}>
          <ChevronLeft16 className={cx(styles.icon, { [styles.disabled]: !enabled })} alt="back one version" />
        </button>
      </div>
    );
  };

  renderForwardButtons = (enabled) => {
    return (
      <div className={styles.buttonList}>
        <button className={styles.button} disabled={!enabled} onClick={this.forwardVersion}>
          <ChevronRight16 className={cx(styles.icon, { [styles.disabled]: !enabled })} alt="forward one version" />
        </button>
        <button className={styles.button} disabled={!enabled} onClick={this.fastForwardVersion}>
          <PageLast16 className={cx(styles.icon, { [styles.disabled]: !enabled })} alt="last version" />
        </button>
      </div>
    );
  };

  render() {
    const { currentRevision, disabled, revisionCount } = this.props;

    return (
      <div className={cx(styles.container, { [styles.disabled]: disabled })}>
        <div className={styles.buttonListContainer}>
          {this.renderBackButtons(currentRevision > 1)}
          <p className={styles.versionText}>{`Version ${currentRevision || 1}`}</p>
          {this.renderForwardButtons(currentRevision < revisionCount)}
        </div>
      </div>
    );
  }
}

export default VersionSwitcher;
