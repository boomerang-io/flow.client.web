import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  ConfirmModal,
  TooltipHover,
  ComposedModal,
  ModalFlowForm,
  ModalFooter,
  ModalBody,
  Tag,
  TextArea,
  InlineNotification,
  Loading,
} from "@boomerang/carbon-addons-boomerang-react";
import capitalize from "lodash/capitalize";
import FeatureHeader from "Components/FeatureHeader";
import VersionSwitcher from "./VersionSwitcher";
import { Bee20, Save16, Undo16, Reset16, ViewOff16 } from "@carbon/icons-react";
import { taskIcons } from "Utilities/taskIcons";
import { TemplateRequestType } from "../constants";
import styles from "./header.module.scss";

function SaveModal({ isValid, isDirty, handleSubmit, values, resetForm, isLoading, cancelRequestRef, setFieldValue }) {
  const [requestError, setRequestError] = React.useState(null);
  const SaveMessage = () => {
    return (
      <>
        <p className={styles.saveConfirmModalText}>
          Choose to overwrite the current version, or save as a new version.
        </p>
        <p className={styles.saveConfirmModalText}>
          <span className={styles.textBold}>Overwritting the current version</span> means that this task will
          automatically be updated in any workflow. Do this with extreme caution, and only when you haven’t made any
          breaking changes.
        </p>
        <p className={styles.saveConfirmModalText}>
          <span className={styles.textBold}>Saving as a new version</span> will not automatically update this task in
          workflows. Users who have this task in a workflow will get a notification about the new version and can choose
          to update or not.
        </p>
      </>
    );
  };
  return (
    <ComposedModal
      modalHeaderProps={{
        title: "Save changes",
      }}
      composedModalProps={{ containerClassName: styles.saveContainer }}
      onCloseModal={() => {
        if (cancelRequestRef.current) cancelRequestRef.current();
      }}
      modalTrigger={({ openModal }) => (
        <TooltipHover direction="bottom" tooltipText={"Save a new version or update the current one"}>
          <Button
            className={styles.button}
            style={{ width: "7.75rem" }}
            disabled={!isValid || !isDirty}
            size="field"
            renderIcon={Save16}
            iconDescription="Save a new version or update the current one"
            onClick={openModal}
          >
            Save...
          </Button>
        </TooltipHover>
      )}
    >
      {({ closeModal }) => {
        return (
          <ModalFlowForm>
            <ModalBody>
              {isLoading && <Loading />}
              <SaveMessage />
              <TextArea
                data-testid="save-comments"
                id="comments"
                name="comments"
                key="newTemplateComments"
                labelText="Comments (required for new versions)"
                onChange={(e) => setFieldValue("comments", e.target.value)}
                placeholder="Release notes for the new version"
                style={{ resize: "none" }}
                value={values.comments}
              />
              {Boolean(requestError) && (
                <InlineNotification
                  lowContrast
                  style={{ marginBottom: "0.5rem" }}
                  kind="error"
                  title={requestError.title}
                  subtitle={requestError.subtitle}
                  onCloseButtonClick={() => setRequestError(null)}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button kind="secondary" type="button" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                kind="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit({
                    values,
                    resetForm,
                    requestType: TemplateRequestType.Overwrite,
                    setRequestError,
                    closeModal,
                  });
                }}
              >
                Overwrite this version
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit({
                    values,
                    resetForm,
                    requestType: TemplateRequestType.New,
                    setRequestError,
                    closeModal,
                  });
                }}
                disabled={!Boolean(values.comments)}
              >
                Save new version
              </Button>
            </ModalFooter>
          </ModalFlowForm>
        );
      }}
    </ComposedModal>
  );
}

Header.propTypes = {
  selectedTaskTemplate: PropTypes.object.isRequired,
  currentRevision: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  resetForm: PropTypes.func.isRequired,
  isValid: PropTypes.bool,
  isDirty: PropTypes.bool,
  handleSaveTaskTemplate: PropTypes.func.isRequired,
  handleRestoreTaskTemplate: PropTypes.func.isRequired,
  oldVersion: PropTypes.bool.isRequired,
  isActive: PropTypes.bool,
  isLoading: PropTypes.bool,
  cancelRequestRef: PropTypes.object.isRequired,
};

function Header({
  selectedTaskTemplate,
  currentRevision,
  values,
  resetForm,
  isValid,
  isDirty,
  handleSaveTaskTemplate,
  handleRestoreTaskTemplate,
  setFieldValue,
  oldVersion,
  isActive,
  isLoading,
  cancelRequestRef,
}) {
  const TaskIcon = taskIcons.find((icon) => icon.name === selectedTaskTemplate.icon);
  const revisionCount = selectedTaskTemplate.revisions.length;

  return (
    <FeatureHeader includeBorder className={styles.featureHeader}>
      <div className={styles.container}>
        <div>
          <h1 className={styles.category}>{capitalize(selectedTaskTemplate.category)}</h1>
          <div className={styles.infoContainer}>
            {TaskIcon ? (
              <TaskIcon.Icon style={{ width: "1.5rem", height: "1.5rem", marginRight: "0.75rem" }} />
            ) : (
              <Bee20 alt={`${selectedTaskTemplate.name} icon`} className={styles.icon} />
            )}
            <p className={styles.taskName}>{selectedTaskTemplate.name}</p>
            {!isActive && (
              <Tag className={styles.archivedTag} type="gray">
                <ViewOff16 style={{ marginRight: "0.5rem" }} />
                Archived
              </Tag>
            )}
          </div>
        </div>
        <div className={styles.buttons}>
          <VersionSwitcher
            revisions={selectedTaskTemplate.revisions}
            currentRevision={currentRevision}
            revisionCount={revisionCount}
          />
          {!oldVersion && isActive && (
            <ConfirmModal
              affirmativeAction={resetForm}
              affirmativeText="Reset changes"
              children="You are about to reset to the last save of this version, all unsaved changes will be erased. This action cannot be undone, are you sure you want to reset to the latest save?"
              title="Reset changes"
              modalTrigger={({ openModal }) => (
                <TooltipHover direction="bottom" tooltipText={"Restore the last save of this version"}>
                  <Button
                    className={styles.button}
                    disabled={!isDirty}
                    size="field"
                    kind="ghost"
                    renderIcon={Undo16}
                    onClick={openModal}
                  >
                    {" "}
                    Reset changes
                  </Button>
                </TooltipHover>
              )}
            />
          )}
          {oldVersion ? (
            <ConfirmModal
              affirmativeAction={() =>
                handleSaveTaskTemplate({ values, resetForm, requestType: TemplateRequestType.Copy })
              }
              children={
                <>
                  <p className={styles.confirmModalText}>Sometimes revisiting the past is a good thing.</p>
                  <p
                    className={styles.confirmModalText}
                  >{`This action will create a new version that’s an exact copy of Version ${
                    currentRevision.version
                  }, but it shall be named Version ${revisionCount + 1}. Make sure this is what you want to do.`}</p>
                </>
              }
              affirmativeText="Copy to new version"
              title="Copy to new version"
              modalTrigger={({ openModal }) => (
                <TooltipHover direction="bottom" tooltipText={"Copy this version to a new version to enable editing"}>
                  <Button className={styles.button} size="field" kind="ghost" renderIcon={Undo16} onClick={openModal}>
                    Copy to new version
                  </Button>
                </TooltipHover>
              )}
            />
          ) : isActive ? (
            <SaveModal
              handleSubmit={handleSaveTaskTemplate}
              values={values}
              resetForm={resetForm}
              isValid={isValid}
              isDirty={isDirty}
              isLoading={isLoading}
              cancelRequestRef={cancelRequestRef}
              setFieldValue={setFieldValue}
            />
          ) : (
            <ConfirmModal
              affirmativeAction={handleRestoreTaskTemplate}
              children={
                <>
                  <p className={styles.confirmModalText}>
                    Restoring a task will remove it from the Archive and make it visible in the Workflow Editor, as the
                    most recent version.
                  </p>
                  <p className={styles.confirmModalText}>Are you sure you’d like to restore this task?</p>
                </>
              }
              affirmativeText="Restore this task"
              title="Restore"
              modalTrigger={({ openModal }) => (
                <Button
                  className={styles.button}
                  style={{ width: "7.75rem" }}
                  size="field"
                  renderIcon={Reset16}
                  onClick={openModal}
                >
                  Restore
                </Button>
              )}
            />
          )}
        </div>
      </div>
    </FeatureHeader>
  );
}

export default Header;
