import React from "react";
import {
  Button,
  ComposedModal,
  ConfirmModal,
  FeatureHeader,
  InlineNotification,
  Loading,
  ModalBody,
  ModalFlowForm,
  ModalFooter,
  Tag,
  FeatureNavTab as Tab,
  FeatureNavTabs as Tabs,
  TextArea,
  TooltipHover,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { useParams } from "react-router-dom";
import VersionHistory from "Components/VersionHistory";
import VersionSwitcher from "./VersionSwitcher";
import moment from "moment";
import { appLink } from "Config/appConfig";
import { serviceUrl } from "Config/servicesConfig";
import { taskIcons } from "Utils/taskIcons";
import { TemplateRequestType, FormProps } from "../constants";
import { Bee20, Download16, Save16, Undo16, Reset16, ViewOff16 } from "@carbon/icons-react";
import { FormikProps } from "formik";
import { ComposedModalChildProps, ModalTriggerProps, TaskModel } from "Types";
import styles from "./header.module.scss";

interface SaveModalProps {
  cancelRequestRef: any;
  formikProps: FormikProps<FormProps>;
  handleSubmit: (
    values: any,
    resetForm: () => void,
    requestType: string,
    setRequestError: ({ title, subtitle }: { title: string; subtitle: string }) => void,
    closeModal: () => void
  ) => void;
  isLoading: boolean;
  canEdit: boolean;
}

const SaveModal: React.FC<SaveModalProps> = ({ cancelRequestRef, formikProps, handleSubmit, isLoading, canEdit }) => {
  const [requestError, setRequestError] = React.useState<{ title?: string; subtitle?: string } | null>(null);
  const SaveMessage = () => {
    return (
      <>
        <p className={styles.saveConfirmModalText}>
          Choose to overwrite the current version, or save as a new version.
        </p>
        <p className={styles.saveConfirmModalText}>
          <strong>Overwritting the current version</strong> means that this task will automatically be updated in any
          workflow. Do this with extreme caution, and only when you haven’t made any breaking changes.
        </p>
        <p className={styles.saveConfirmModalText}>
          <strong>Saving as a new version</strong> will not automatically update this task in workflows. Users who have
          this task in a workflow will get a notification about the new version and can choose to update or not.
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
      modalTrigger={({ openModal }: ModalTriggerProps) => (
        <TooltipHover direction="bottom" tooltipText={"Save a new version or update the current one"}>
          <Button
            className={styles.mainActionButton}
            disabled={!formikProps.isValid || !formikProps.dirty || !canEdit}
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
      {({ closeModal }: ComposedModalChildProps) => {
        return (
          <ModalFlowForm>
            {isLoading && <Loading />}
            <ModalBody>
              <SaveMessage />
              <TextArea
                data-testid="save-comments"
                id="comments"
                name="comments"
                key="newTemplateComments"
                labelText="Comments (required for new versions)"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  formikProps.setFieldValue("comments", e.target.value)
                }
                placeholder="Release notes for the new version"
                style={{ resize: "none" }}
                value={formikProps.values.comments}
              />
              {Boolean(requestError) && (
                <InlineNotification
                  lowContrast
                  style={{ marginBottom: "0.5rem" }}
                  kind="error"
                  title={requestError?.title}
                  subtitle={requestError?.subtitle}
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
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  handleSubmit(
                    formikProps.values,
                    formikProps.resetForm,
                    TemplateRequestType.Overwrite,
                    setRequestError,
                    closeModal
                  );
                }}
              >
                Overwrite this version
              </Button>
              <Button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  handleSubmit(
                    formikProps.values,
                    formikProps.resetForm,
                    TemplateRequestType.New,
                    setRequestError,
                    closeModal
                  );
                }}
                disabled={!Boolean(formikProps.values.comments)}
              >
                Save new version
              </Button>
            </ModalFooter>
          </ModalFlowForm>
        );
      }}
    </ComposedModal>
  );
};

interface HeaderProps {
  editVerifiedTasksEnabled: boolean;
  cancelRequestRef: object;
  currentRevision: { version: number };
  formikProps: FormikProps<FormProps>;
  handleSaveTaskTemplate: (
    values: any,
    resetForm: () => void,
    requestType: string,
    setRequestError?: (error: any) => void,
    closeModal?: () => void
  ) => void;
  handleputRestoreTaskTemplate: () => void;
  isActive: boolean;
  isLoading: boolean;
  isOldVersion: boolean;
  selectedTaskTemplate: TaskModel;
  canEditWorkflow: boolean;
}

const Header: React.FC<HeaderProps> = ({
  editVerifiedTasksEnabled,
  selectedTaskTemplate,
  currentRevision,
  formikProps,
  handleSaveTaskTemplate,
  handleputRestoreTaskTemplate,
  isOldVersion,
  isActive,
  isLoading,
  cancelRequestRef,
  canEditWorkflow,
}) => {
  const params: { teamId: string; taskId: string; version: string } = useParams();

  const TaskIcon = taskIcons.find((icon) => icon.name === selectedTaskTemplate.icon);
  const revisionCount = selectedTaskTemplate.revisions.length;
  const lastUpdated = selectedTaskTemplate?.revisions[revisionCount - 1]?.changelog ?? {};
  const changelogs = selectedTaskTemplate?.revisions?.map((revision) => ({
    ...revision.changelog,
    date: moment(revision?.changelog?.date)?.format("MMM DD, YYYY") ?? "---",
    version: revision.version,
  }));
  changelogs.reverse();
  const canEdit =
    (!selectedTaskTemplate?.verified || (editVerifiedTasksEnabled && selectedTaskTemplate?.verified)) &&
    canEditWorkflow;

  return (
    <FeatureHeader
      className={styles.featureHeader}
      footer={
        <Tabs>
          <Tab
            exact
            label="Overview"
            to={appLink.manageTaskTemplateEdit({
              teamId: params?.teamId,
              taskId: selectedTaskTemplate.id,
              version: currentRevision.version,
            })}
          />
          <Tab
            exact
            label="Yaml"
            to={appLink.manageTaskTemplateYaml({
              teamId: params?.teamId,
              taskId: selectedTaskTemplate.id,
              version: currentRevision.version,
            })}
          />
        </Tabs>
      }
      actions={
        <div className={styles.buttons}>
          <VersionSwitcher
            revisions={selectedTaskTemplate.revisions}
            currentRevision={currentRevision}
            revisionCount={revisionCount}
            canEdit={canEdit}
          />
          {!isOldVersion && isActive && (
            <ConfirmModal
              affirmativeAction={formikProps.resetForm}
              affirmativeText="Reset changes"
              children="You are about to reset to the last save of this version, all unsaved changes will be erased. This action cannot be undone, are you sure you want to reset to the latest save?"
              title="Reset changes"
              modalTrigger={({ openModal }: ModalTriggerProps) => (
                <TooltipHover direction="bottom" tooltipText={"Restore the last save of this version"}>
                  <Button
                    className={styles.resetButton}
                    disabled={!formikProps.dirty || !canEdit}
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
          {isOldVersion ? (
            <ConfirmModal
              affirmativeAction={() =>
                handleSaveTaskTemplate(formikProps.values, formikProps.resetForm, TemplateRequestType.Copy)
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
              modalTrigger={({ openModal }: ModalTriggerProps) => (
                <TooltipHover direction="bottom" tooltipText={"Copy this version to a new version to enable editing"}>
                  <Button
                    className={styles.copyButton}
                    size="field"
                    kind="ghost"
                    renderIcon={Undo16}
                    onClick={openModal}
                    disabled={!canEdit}
                  >
                    Copy to new version
                  </Button>
                </TooltipHover>
              )}
            />
          ) : isActive ? (
            <SaveModal
              cancelRequestRef={cancelRequestRef}
              formikProps={formikProps}
              handleSubmit={handleSaveTaskTemplate}
              isLoading={isLoading}
              canEdit={canEdit}
            />
          ) : (
            <ConfirmModal
              affirmativeAction={handleputRestoreTaskTemplate}
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
              modalTrigger={({ openModal }: ModalTriggerProps) => (
                <Button className={styles.mainActionButton} size="field" renderIcon={Reset16} onClick={openModal}>
                  Restore
                </Button>
              )}
            />
          )}
        </div>
      }
    >
      <p className={styles.category}>{selectedTaskTemplate.category}</p>
      <div className={styles.infoContainer}>
        {TaskIcon ? (
          <TaskIcon.Icon style={{ minWidth: "1.5rem", minHeight: "1.5rem", marginRight: "0.75rem" }} />
        ) : (
          <Bee20 alt={`${selectedTaskTemplate.name} icon`} className={styles.icon} />
        )}
        <h1 className={styles.taskName} title={selectedTaskTemplate.name}>
          {selectedTaskTemplate.name}
        </h1>
        {!isActive && (
          <Tag className={styles.archivedTag} type="gray">
            <ViewOff16 style={{ marginRight: "0.5rem" }} />
            Archived
          </Tag>
        )}
        <VersionHistory changelogs={changelogs} />
        <TooltipHover direction="right" content="Export latest saved revision of the YAML">
          <a
            className={styles.exportYaml}
            href={serviceUrl.getTaskTemplateYaml({ id: params.taskId, revision: params.version })}
            download={`${selectedTaskTemplate.name}.yaml`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download16 />
          </a>
        </TooltipHover>
      </div>
      <p className={styles.lastUpdate}>{`Version ${revisionCount === 1 ? "created" : "updated"} ${moment(
        lastUpdated.date
      ).format("MMM DD, YYYY")} by ${lastUpdated.userName ?? "---"}`}</p>
    </FeatureHeader>
  );
};

export default Header;
