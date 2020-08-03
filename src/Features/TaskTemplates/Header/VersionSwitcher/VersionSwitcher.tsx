//@ts-nocheck
import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { useHistory, useRouteMatch } from "react-router-dom";
import { ChevronLeft16, ChevronRight16, PageFirst16, PageLast16 } from "@carbon/icons-react";
import { appLink } from "Config/appConfig";
import styles from "./VersionSwitcher.module.scss";

VersionSwitcher.propTypes = {
  currentRevision: PropTypes.object,
  revisionCount: PropTypes.number.isRequired,
  revisions: PropTypes.array,
};

function VersionSwitcher({ revisions, currentRevision, revisionCount }) {
  const history = useHistory();
  const match = useRouteMatch();
  const backVersion = () => {
    history.push(appLink.taskTemplateEdit({ id: match.params.taskTemplateId, version: currentRevision.version - 1 }));
  };

  const fastBackVersion = () => {
    history.push(appLink.taskTemplateEdit({ id: match.params.taskTemplateId, version: 1 }));
  };

  const forwardVersion = () => {
    history.push(appLink.taskTemplateEdit({ id: match.params.taskTemplateId, version: currentRevision.version + 1 }));
  };

  const fastForwardVersion = () => {
    history.push(appLink.taskTemplateEdit({ id: match.params.taskTemplateId, version: revisions.length }));
  };

  const renderBackButtons = (enabled) => {
    return (
      <div className={styles.buttonList}>
        <button className={styles.button} disabled={!enabled} onClick={fastBackVersion}>
          <PageFirst16 className={cx(styles.icon, { [styles.disabled]: !enabled })} alt="first version" />
        </button>
        <button className={styles.button} disabled={!enabled} onClick={backVersion}>
          <ChevronLeft16 className={cx(styles.icon, { [styles.disabled]: !enabled })} alt="back one version" />
        </button>
      </div>
    );
  };

  const renderForwardButtons = (enabled) => {
    return (
      <div className={styles.buttonList}>
        <button className={styles.button} disabled={!enabled} onClick={forwardVersion}>
          <ChevronRight16 className={cx(styles.icon, { [styles.disabled]: !enabled })} alt="forward one version" />
        </button>
        <button className={styles.button} disabled={!enabled} onClick={fastForwardVersion}>
          <PageLast16 className={cx(styles.icon, { [styles.disabled]: !enabled })} alt="last version" />
        </button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonListContainer}>
        {renderBackButtons(currentRevision.version > 1)}
        <p className={styles.versionText}>{`Version ${currentRevision?.version || 1}`}</p>
        {renderForwardButtons(currentRevision.version < revisionCount)}
      </div>
    </div>
  );
}

export default VersionSwitcher;
