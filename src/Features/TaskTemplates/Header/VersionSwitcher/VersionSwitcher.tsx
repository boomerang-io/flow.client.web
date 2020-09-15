import React from "react";
import cx from "classnames";
import { useHistory, useParams } from "react-router-dom";
import { ChevronLeft16, ChevronRight16, PageFirst16, PageLast16 } from "@carbon/icons-react";
import { appLink } from "Config/appConfig";
import styles from "./VersionSwitcher.module.scss";

interface VersionSwitcherProps {
  currentRevision: {
    version: number;
  };
  revisionCount: number;
  revisions: any;
  canEdit: boolean;
}

const VersionSwitcher: React.FC<VersionSwitcherProps> = ({ revisions, currentRevision, revisionCount, canEdit }) => {
  const history = useHistory();
  const params: { id: string } = useParams();
  const backVersion = () => {
    history.push(appLink.taskTemplateEdit({ id: params.id, version: currentRevision.version - 1 }));
  };

  const fastBackVersion = () => {
    history.push(appLink.taskTemplateEdit({ id: params.id, version: 1 }));
  };

  const forwardVersion = () => {
    history.push(appLink.taskTemplateEdit({ id: params.id, version: currentRevision.version + 1 }));
  };

  const fastForwardVersion = () => {
    history.push(appLink.taskTemplateEdit({ id: params.id, version: revisions.length }));
  };

  const renderBackButtons = (enabled: boolean) => {
    const shouldNotDisplay = !enabled || !canEdit;
    return (
      <div className={styles.buttonList}>
        <button className={styles.button} disabled={shouldNotDisplay} onClick={fastBackVersion}>
          <PageFirst16 className={cx(styles.icon, { [styles.disabled]: shouldNotDisplay })} alt="first version" />
        </button>
        <button className={styles.button} disabled={shouldNotDisplay} onClick={backVersion}>
          <ChevronLeft16 className={cx(styles.icon, { [styles.disabled]: shouldNotDisplay })} alt="back one version" />
        </button>
      </div>
    );
  };

  const renderForwardButtons = (enabled: boolean) => {
    const shouldNotDisplay = !enabled || !canEdit;
    return (
      <div className={styles.buttonList}>
        <button className={styles.button} disabled={shouldNotDisplay} onClick={forwardVersion}>
          <ChevronRight16
            className={cx(styles.icon, { [styles.disabled]: shouldNotDisplay })}
            alt="forward one version"
          />
        </button>
        <button className={styles.button} disabled={shouldNotDisplay} onClick={fastForwardVersion}>
          <PageLast16 className={cx(styles.icon, { [styles.disabled]: shouldNotDisplay })} alt="last version" />
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
};

export default VersionSwitcher;
