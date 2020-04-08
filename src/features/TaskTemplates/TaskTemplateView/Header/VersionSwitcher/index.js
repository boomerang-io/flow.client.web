import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { ChevronLeft16, ChevronRight16, PageFirst16, PageLast16 } from "@carbon/icons-react";
import styles from "./VersionSwitcher.module.scss";

class VersionSwitcher extends Component {
  static propTypes = {
    currentRevision: PropTypes.number,
    setCurrentRevision: PropTypes.func,
    revisionCount: PropTypes.number.isRequired,
    onChangeVersion: PropTypes.func.isRequired,
    revisions: PropTypes.array
  };

  backVersion = () => {
    this.props.setCurrentRevision(this.props.revisions[this.props.currentRevision.version - 2]);
  };

  fastBackVersion = () => {
    this.props.setCurrentRevision(this.props.revisions[0]);
  };

  forwardVersion = () => {
    this.props.setCurrentRevision(this.props.revisions[this.props.currentRevision.version]);
  };

  fastForwardVersion = () => {
    this.props.setCurrentRevision(this.props.revisions[this.props.revisions.length - 1]);
  };

  renderBackButtons = enabled => {
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

  renderForwardButtons = enabled => {
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
          {this.renderBackButtons(currentRevision.version > 1)}
          <p className={styles.versionText}>{`Version ${currentRevision?.version || 1}`}</p>
          {this.renderForwardButtons(currentRevision.version < revisionCount)}
        </div>
      </div>
    );
  }
}

export default VersionSwitcher;
