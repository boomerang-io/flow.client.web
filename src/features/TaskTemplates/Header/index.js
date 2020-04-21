import React from "react";
import { Button, ConfirmModal, TooltipDefinition } from "@boomerang/carbon-addons-boomerang-react";
import capitalize from "lodash/capitalize";
import FeatureHeader from "Components/FeatureHeader";
import VersionSwitcher from "./VersionSwitcher";
import { serviceUrl } from "Config/servicesConfig";
import { Bee20, Save16, Undo16 } from "@carbon/icons-react";
import taskTemplateIcons from "Assets/taskTemplateIcons";
import styles from "./header.module.scss";

function Header({ selectedTaskTemplate, currentRevision, handleResetTemplate, isValid, isDirty, handleSaveTaskTemplate, handleSubmit }) {
  const taskIcon = taskTemplateIcons.find(icon => icon.name === selectedTaskTemplate.revisions[selectedTaskTemplate.revisions.length - 1].image);

  return (
    <FeatureHeader includeBorder className={styles.featureHeader}>
      <div className={styles.container}>
        <div>
          <h1 className={styles.category}>{capitalize(selectedTaskTemplate.category)}</h1>
          <div className={styles.infoContainer}>
            {taskIcon ? (
              <taskIcon.src style={{width:"1.5rem", height:"1.5rem", marginRight:"0.75rem"}}/>
            ) : (
              <Bee20 alt={`${selectedTaskTemplate.name} icon`} className={styles.icon} />
            )}
            <p className={styles.taskName}>{selectedTaskTemplate.name}</p>
            {/* <AddService task={task} /> */}
          </div>
        </div>
        <div className={styles.buttons}>
          <VersionSwitcher 
            revisions={selectedTaskTemplate.revisions} 
            currentRevision={currentRevision} 
            revisionCount={selectedTaskTemplate.revisions.length}
          />
          <ConfirmModal
            affirmativeAction={handleResetTemplate}
            children="Your changes will not be saved."
            title="Reset configuration?"
            modalTrigger={({ openModal }) => (
              <TooltipDefinition direction="bottom" tooltipText={"Restore the last save of this version"}>
                <Button className={styles.button} disabled={!isDirty} size="field" kind="ghost" renderIcon={Undo16} onClick={openModal}> Reset changes</Button>
              </TooltipDefinition>
            )}
          />
          {/* <Button className={styles.button} size="field" kind="secondary" renderIcon={Save16}>Update this version</Button> */}
          <ConfirmModal
            affirmativeAction={handleSubmit}
            children="A new version will saved and all workflows that use this task template will be notified to update."
            affirmativeText="Save"
            title="Save new version?"
            modalTrigger={({ openModal }) => (
              <TooltipDefinition direction="bottom" tooltipText={"Save a new version or update the current one"}>
                <Button className={styles.button} style={{width:"7.75rem"}} disabled={!isValid || !isDirty} size="field" renderIcon={Save16} onClick={openModal}>Save...</Button>
              </TooltipDefinition>
            )}
          />
        </div>
      </div>
    </FeatureHeader>
  );
}

export default Header;
