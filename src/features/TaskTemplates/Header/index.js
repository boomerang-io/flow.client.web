import React from "react";
import { Button, ConfirmModal, TooltipDefinition, ComposedModal, ModalFlowForm, ModalFooter, ModalBody, Tag  } from "@boomerang/carbon-addons-boomerang-react";
import capitalize from "lodash/capitalize";
import FeatureHeader from "Components/FeatureHeader";
import VersionSwitcher from "./VersionSwitcher";
import { serviceUrl } from "Config/servicesConfig";
import { Bee20, Save16, Undo16, Reset16, ViewOff16 } from "@carbon/icons-react";
import taskTemplateIcons from "Assets/taskTemplateIcons";
import styles from "./header.module.scss";

function SaveModal ({isValid, isDirty, handleSubmit}) {
  const SaveMessage = () => {
    return(
      <div>
        <p>Choose to overwrite the current version, or save as a new version.</p>
        <p>Overwritting the current version means that this task will automatically be updated in any workflow. Do this with extreme caution, and only when you haven’t made any breaking changes.</p>
        <p>Saving as a new version will not automatically update this task in workflows. Users who have this task in a workflow will get a notification about the new version and can choose to update or not.</p>
      </div>
    );
  }
  return(
    <ComposedModal
      modalHeaderProps={{
        title: "Save changes"
      }}
      modalTrigger={({ openModal }) => (
        <TooltipDefinition direction="bottom" tooltipText={"Save a new version or update the current one"}>
          <Button className={styles.button} style={{width:"7.75rem"}} disabled={!isValid || !isDirty} size="field" renderIcon={Save16} onClick={openModal}>Save...</Button>
        </TooltipDefinition>
      )}
    >
    {({closeModal}) => {
      return(
        <ModalFlowForm>
          <ModalBody>
            <SaveMessage />
          </ModalBody>
          <ModalFooter>
            <Button kind="secondary" type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              kind="secondary"
              onClick={e => {
                e.preventDefault();
                handleSubmit();
                closeModal();
              }}
            >
              Overwrite this version
            </Button>
            <Button
              onClick={e => {
                e.preventDefault();
                handleSubmit();
                closeModal();
              }}
            >
              Save new version
            </Button>
          </ModalFooter>
        </ModalFlowForm>
      );
    }
    }

    </ComposedModal>
  );
}
function Header({ selectedTaskTemplate, currentRevision, handleResetTemplate, isValid, isDirty, handleSaveTaskTemplate, handleRestoreTaskTemplate, handleSubmit, oldVersion, isActive }) {
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
            {!isActive && <Tag className={styles.archivedTag} type="gray">
              <ViewOff16 style={{marginRight: "0.5rem"}}/>
              Archived
            </Tag>}
          </div>
        </div>
        <div className={styles.buttons}>
          <VersionSwitcher 
            revisions={selectedTaskTemplate.revisions} 
            currentRevision={currentRevision} 
            revisionCount={selectedTaskTemplate.revisions.length}
          />
          {
            !oldVersion &&
            <ConfirmModal
              affirmativeAction={handleResetTemplate}
              affirmativeText="Reset changes"
              children="You are about to reset to the last save of this version, all unsaved changes will be erased. This action cannot be undone, are you sure you want to reset to the latest save?"
              title="Reset changes"
              modalTrigger={({ openModal }) => (
                <TooltipDefinition direction="bottom" tooltipText={"Restore the last save of this version"}>
                  <Button className={styles.button} disabled={!isDirty} size="field" kind="ghost" renderIcon={Undo16} onClick={openModal}> Reset changes</Button>
                </TooltipDefinition>
              )}
            />
          }
          {/* <Button className={styles.button} size="field" kind="secondary" renderIcon={Save16}>Update this version</Button> */}
          {
            oldVersion ?
            <ConfirmModal
              affirmativeAction={handleSubmit}
              children={(
                <div>
                  <p>Sometimes revisiting the past is a good thing.</p>
                  <p>This action will create a new version that’s an exact copy of Version 2, but it shall be named Version 5. Any unsaved changes to Version 4 will be lost. Make sure this is what you want to do.</p>
                </div>
              )}
              affirmativeText="Copy to new version"
              title="Copy to new version"
              modalTrigger={({ openModal }) => (
                <TooltipDefinition direction="bottom" tooltipText={"Copy this version to a new version to enable editing"}>
                  <Button className={styles.button} size="field" kind="ghost" renderIcon={Undo16} onClick={openModal}>Copy to new version</Button>
                </TooltipDefinition>
              )}
            />
            :
            isActive ?
            <SaveModal
              handleSubmit={handleSubmit}
              isValid={isValid}
              isDirty={isDirty}
            />
            :
            <ConfirmModal
              affirmativeAction={handleRestoreTaskTemplate}
              children={(
                <div>
                  <p>Restoring a task will remove it from the Archive and make it visible in the Workflow Editor, as the most recent version.</p>
                  <p>Are you sure you’d like to restore this task?</p>
                </div>
              )}
              affirmativeText="Restore this task"
              title="Restore"
              modalTrigger={({ openModal }) => (
                <Button className={styles.button} style={{width:"7.75rem"}} size="field" renderIcon={Reset16} onClick={openModal}>Restore</Button>
              )}
            />
          }
        </div>
      </div>
    </FeatureHeader>
  );
}

export default Header;
