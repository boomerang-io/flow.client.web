import React from "react";
import cx from "classnames";
import { useHistory, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, PageFirst, PageLast } from "@carbon/react/icons";
import { appLink } from "Config/appConfig";
import { TaskTemplate } from "Types";
import styles from "./VersionSwitcher.module.scss";

interface VersionSwitcherProps {
  selectedTaskTemplate: TaskTemplate;
  selectedTaskTemplates: Array<TaskTemplate>;
  versionCount: number;
  canEdit: boolean;
}

const VersionSwitcher: React.FC<VersionSwitcherProps> = ({
  selectedTaskTemplates,
  selectedTaskTemplate,
  versionCount,
  canEdit,
}) => {
  const history = useHistory();
  const params: { name: string; teamId: string } = useParams();
  const backVersion = () => {
    history.push(
      appLink.manageTaskTemplateEdit({
        teamId: params.teamId,
        name: params.name,
        version: "" + (selectedTaskTemplate.version - 1),
      })
    );
  };

  const fastBackVersion = () => {
    history.push(appLink.manageTaskTemplateEdit({ teamId: params.teamId, name: params.name, version: "1" }));
  };

  const forwardVersion = () => {
    history.push(
      appLink.manageTaskTemplateEdit({
        teamId: params.teamId,
        name: params.name,
        version: "" + (selectedTaskTemplate.version + 1),
      })
    );
  };

  const fastForwardVersion = () => {
    history.push(appLink.manageTaskTemplateEdit({ teamId: params.teamId, name: params.name, version: versionCount }));
  };

  const renderBackButtons = (enabled: boolean) => {
    return (
      <div className={styles.buttonList}>
        <button className={styles.button} disabled={!enabled} onClick={fastBackVersion}>
          <PageFirst className={cx(styles.icon, { [styles.disabled]: !enabled })} alt="first version" />
        </button>
        <button className={styles.button} disabled={!enabled} onClick={backVersion}>
          <ChevronLeft className={cx(styles.icon, { [styles.disabled]: !enabled })} alt="back one version" />
        </button>
      </div>
    );
  };

  const renderForwardButtons = (enabled: boolean) => {
    return (
      <div className={styles.buttonList}>
        <button className={styles.button} disabled={!enabled} onClick={forwardVersion}>
          <ChevronRight className={cx(styles.icon, { [styles.disabled]: !enabled })} alt="forward one version" />
        </button>
        <button className={styles.button} disabled={!enabled} onClick={fastForwardVersion}>
          <PageLast className={cx(styles.icon, { [styles.disabled]: !enabled })} alt="last version" />
        </button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonListContainer}>
        {renderBackButtons(selectedTaskTemplate.version > 1)}
        <p className={styles.versionText}>{`Version ${selectedTaskTemplate.version || 1}`}</p>
        {renderForwardButtons(selectedTaskTemplate.version < versionCount)}
      </div>
    </div>
  );
};

export default VersionSwitcher;
