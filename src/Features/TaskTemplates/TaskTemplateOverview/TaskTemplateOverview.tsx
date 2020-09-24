//@ts-nocheck
import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import axios from "axios";
import { useParams, useHistory, Prompt, matchPath } from "react-router-dom";
import { useMutation, queryCache } from "react-query";
import {
  Tile,
  Button,
  notify,
  ToastNotification,
  Loading,
  TooltipHover,
  ConfirmModal,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { formatErrorMessage } from "@boomerang-io/utils";
import EditTaskTemplateModal from "./EditTaskTemplateModal";
import PreviewConfig from "./PreviewConfig";
import TemplateConfigModal from "./TemplateConfigModal";
import Header from "../Header";
import { TaskTemplateStatus } from "Constants";
import { TemplateRequestType, FieldTypes } from "../constants";
import { Draggable16, TrashCan16, Archive16, Bee16, Recommend16, Identification16 } from "@carbon/icons-react";
import { taskIcons } from "Utils/taskIcons";
import { resolver, serviceUrl } from "Config/servicesConfig";
import { appLink, AppPath } from "Config/appConfig";
import EmptyState from "Components/EmptyState";
import { DataDrivenInput } from "Types";
import styles from "./taskTemplateOverview.module.scss";

const ArchiveText: React.FC = () => (
  <>
    <p className={styles.confirmModalText}>
      Archive a task when it is no longer supported and shouldn’t be used in new Workflows.
    </p>
    <p className={styles.confirmModalText}>
      Once archived, it will no longer appear in the Workflow Editor, but you can still view it in the Task Manager
      here. The task will remain functional in any existing Workflows to avoid breakage.
    </p>
    <p className={styles.confirmModalText}>You can restore an archived task later, if needed.</p>
    <p className={styles.confirmModalText}>
      If you need to permanently delete a task, contact a Boomerang Admin to help (bmrgjoe@bmrg.com).
    </p>
  </>
);

interface DetailDataElementsProps {
  label: string;
  value: string;
}

const DetailDataElements: React.FC<DetailDataElementsProps> = ({ label, value }) => {
  const TaskIcon = taskIcons.find((icon) => icon.name === value);

  return (
    <section className={styles.infoSection}>
      <dt className={styles.label}>{label}</dt>
      {label === "Icon" ? (
        TaskIcon ? (
          <div className={styles.basicIcon}>
            <TaskIcon.Icon style={{ width: "1.5rem", height: "1.5rem", marginRight: "0.75rem" }} />
            <p className={styles.value}>{TaskIcon.name}</p>
          </div>
        ) : (
          <div className={styles.basicIcon}>
            <Bee16 style={{ width: "1rem", height: "1rem", marginRight: "0.75rem" }} />
            <p className={styles.value}>Default</p>
          </div>
        )
      ) : (
        <dd className={value ? styles.value : styles.noValue} data-testid={label}>
          {value ? value : "Not defined yet"}
        </dd>
      )}
    </section>
  );
};

interface FieldProps {
  field: any;
  innerRef: any;
  draggableProps: any;
  dragHandleProps: any;
  setFieldValue: any;
  fields: any;
  deleteConfiguration: any;
  isOldVersion: any;
  isActive: any;
}

const Field: React.FC<FieldProps> = ({
  field,
  innerRef,
  draggableProps,
  dragHandleProps,
  setFieldValue,
  fields,
  deleteConfiguration,
  isOldVersion,
  isActive,
}) => {
  return (
    <section className={styles.fieldSection} ref={innerRef} {...draggableProps}>
      <div
        className={styles.iconContainer}
        {...dragHandleProps}
        style={{ display: `${isOldVersion || !isActive ? "none" : "flex"}` }}
      >
        <Draggable16 className={styles.dragabble} />
      </div>
      <dd
        className={styles.value}
        data-testid={field.label}
        style={{ marginLeft: `${isOldVersion || !isActive ? "1.5rem" : "0"}` }}
      >
        {`${FieldTypes[field.type]} - ${field.label}`}
      </dd>
      <div className={styles.actions}>
        <TemplateConfigModal
          isActive={isActive}
          isEdit
          field={field}
          isOldVersion={isOldVersion}
          setFieldValue={setFieldValue}
          templateFields={fields}
        />
        <TooltipHover direction="bottom" tooltipText={"Delete field"}>
          <Button
            className={styles.delete}
            disabled={isOldVersion || !isActive}
            iconDescription="delete-field"
            kind="ghost"
            onClick={() => deleteConfiguration(field)}
            renderIcon={TrashCan16}
            size="field"
          />
        </TooltipHover>
      </div>
    </section>
  );
};

TaskTemplateOverview.propTypes = {
  taskTemplates: PropTypes.array.isRequired,
  updateTemplateInState: PropTypes.func.isRequired,
};

export function TaskTemplateOverview({ taskTemplates, updateTemplateInState }) {
  const cancelRequestRef = React.useRef();

  const params = useParams();
  const history = useHistory();
  const [uploadTaskTemplateMutation, { isLoading }] = useMutation(
    (args) => {
      const { promise, cancel } = resolver.putCreateTaskTemplate(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryCache.invalidateQueries([serviceUrl.getTaskTemplates()]),
    }
  );
  const [archiveTaskTemplateMutation, { isLoading: archiveIsLoading }] = useMutation(
    resolver.deleteArchiveTaskTemplate,
    {
      onSuccess: () => queryCache.invalidateQueries([serviceUrl.getTaskTemplates()]),
    }
  );
  const [restoreTaskTemplateMutation, { isLoading: restoreIsLoading }] = useMutation(resolver.putRestoreTaskTemplate, {
    onSuccess: () => queryCache.invalidateQueries([serviceUrl.getTaskTemplates()]),
  });

  let selectedTaskTemplate = taskTemplates.find((taskTemplate) => taskTemplate.id === params.id) ?? {};

  const isActive = selectedTaskTemplate.status === TaskTemplateStatus.Active;
  const invalidVersion = params.version === "0" || params.version > selectedTaskTemplate.currentVersion;

  // Checks if the version in url are a valid one. If not, go to the latest version
  // Need to improve this
  const currentRevision = selectedTaskTemplate?.revisions
    ? invalidVersion
      ? selectedTaskTemplate.revisions[selectedTaskTemplate.currentVersion - 1]
      : selectedTaskTemplate.revisions.find((revision) => revision?.version?.toString() === params.version)
    : {};

  const isOldVersion = !invalidVersion && params.version !== selectedTaskTemplate?.currentVersion?.toString();
  const templateNotFound = !selectedTaskTemplate.id;

  const fieldKeys = currentRevision.config?.map((input: DataDrivenInput) => input.key) ?? [];
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleSaveTaskTemplate = async (values, resetForm, requestType, setRequestError, closeModal) => {
    const newRevisions = [].concat(selectedTaskTemplate.revisions);
    const newVersion = selectedTaskTemplate.revisions.length + 1;

    let body = {};
    let newRevisionConfig = {};

    if (requestType === TemplateRequestType.Copy) {
      newRevisionConfig = {
        ...currentRevision,
        version: newVersion,
        changelog: {
          reason: `Copy new version from ${values.currentConfig.version}`,
        },
      };
      newRevisions.push(newRevisionConfig);
      body = {
        ...selectedTaskTemplate,
        currentVersion: newVersion,
        revisions: newRevisions,
      };
    } else if (requestType === TemplateRequestType.Overwrite) {
      newRevisionConfig = {
        version: selectedTaskTemplate.currentVersion,
        image: values.image,
        command: values.command,
        arguments: values.arguments.trim().split(/\s{1,}/),
        config: values.currentConfig,
        changelog: {
          reason: values.comments,
        },
      };
      newRevisions.splice(selectedTaskTemplate.currentVersion - 1, 1, newRevisionConfig);
      body = {
        ...selectedTaskTemplate,
        name: values.name,
        icon: values.icon,
        description: values.description,
        category: values.category,
        revisions: newRevisions,
      };
    } else {
      newRevisionConfig = {
        version: newVersion,
        image: values.image,
        command: values.command,
        arguments: values.arguments.trim().split(/\s{1,}/),
        config: values.currentConfig,
        changelog: {
          reason: values.comments,
        },
      };
      newRevisions.push(newRevisionConfig);
      body = {
        ...selectedTaskTemplate,
        name: values.name,
        icon: values.icon,
        description: values.description,
        category: values.category,
        currentVersion: newVersion,
        revisions: newRevisions,
      };
    }

    try {
      if (requestType !== TemplateRequestType.Copy) {
        typeof setRequestError === "function" && setRequestError(null);
      }
      let response = await uploadTaskTemplateMutation({ body });
      notify(
        <ToastNotification
          kind="success"
          title={"Task Template Updated"}
          subtitle={`Request to update ${body.name} succeeded`}
          data-testid="create-update-task-template-notification"
        />
      );
      resetForm();
      history.push(
        //@ts-ignore
        appLink.taskTemplateEdit({ id: params.id, version: response.data.currentVersion })
      );
      updateTemplateInState(response.data);
      if (requestType !== TemplateRequestType.Copy) {
        typeof closeModal === "function" && closeModal();
      }
    } catch (err) {
      if (!axios.isCancel(err)) {
        if (requestType !== TemplateRequestType.Copy) {
          const { title, message: subtitle } = formatErrorMessage({
            error: err,
            defaultMessage: "Request to save task template failed.",
          });
          setRequestError({ title, subtitle });
        } else {
          notify(
            <ToastNotification
              kind="error"
              title={"Update Task Template Failed"}
              subtitle={"Something's Wrong"}
              data-testid="update-task-template-notification"
            />
          );
        }
      }
    }
  };

  const handleArchiveTaskTemplate = async () => {
    try {
      let response = await archiveTaskTemplateMutation({ id: selectedTaskTemplate.id });
      notify(
        <ToastNotification
          kind="success"
          title={"Task Template Archive"}
          subtitle={`Request to archive ${selectedTaskTemplate.name} succeeded`}
          data-testid="archive-task-template-notification"
        />
      );
      updateTemplateInState(response);
    } catch (err) {
      notify(
        <ToastNotification
          kind="error"
          title={"Archive Task Template Failed"}
          subtitle={"Something's Wrong"}
          data-testid="archive-task-template-notification"
        />
      );
    }
  };

  const handleputRestoreTaskTemplate = async () => {
    try {
      let response = await restoreTaskTemplateMutation({ id: selectedTaskTemplate.id });
      notify(
        <ToastNotification
          kind="success"
          title={"Task Template Restore"}
          subtitle={`Request to restore ${selectedTaskTemplate.name} succeeded`}
          data-testid="restore-task-template-notification"
        />
      );
      updateTemplateInState(response);
    } catch (err) {
      notify(
        <ToastNotification
          kind="error"
          title={"Restore Task Template Failed"}
          subtitle={"Something's Wrong"}
          data-testid="restore-task-template-notification"
        />
      );
    }
  };

  if (templateNotFound)
    return (
      <EmptyState
        header="Task Template not found"
        title="Crikey. We can't find the template you are looking for."
        message=""
      />
    );

  return (
    <Formik
      initialValues={{
        name: selectedTaskTemplate.name,
        description: selectedTaskTemplate.description,
        icon: selectedTaskTemplate.icon,
        image: currentRevision.image,
        category: selectedTaskTemplate.category,
        currentConfig: currentRevision.config ?? [],
        arguments: currentRevision.arguments?.join(" ") ?? "",
        command: currentRevision.command ?? "",
        comments: "",
      }}
      enableReinitialize={true}
    >
      {(formikProps) => {
        const { setFieldValue, values, dirty: isDirty, isSubmitting } = formikProps;

        function deleteConfiguration(selectedField) {
          const configIndex = values.currentConfig.findIndex((field) => field.key === selectedField.key);
          let newProperties = [].concat(values.currentConfig);
          newProperties.splice(configIndex, 1);
          setFieldValue("currentConfig", newProperties);
        }
        const onDragEnd = async (result) => {
          if (result.source && result.destination) {
            const newFields = reorder(values.currentConfig, result.source.index, result.destination.index);
            setFieldValue("currentConfig", newFields);
          }
        };
        return (
          <div className={styles.container}>
            <Prompt
              message={(location) => {
                let prompt = true;
                const templateMatch = matchPath(location.pathname, {
                  path: AppPath.TaskTemplateEdit,
                });
                if (isDirty && !location.pathname.includes(templateMatch?.params?.id) && !isSubmitting) {
                  prompt = "Are you sure you want to leave? You have unsaved changes.";
                }
                if (
                  isDirty &&
                  templateMatch?.params?.version !== selectedTaskTemplate.currentVersion &&
                  !isSubmitting
                ) {
                  prompt = "Are you sure you want to change the version? Your changes will be lost.";
                }
                return prompt;
              }}
            />
            {(isLoading || archiveIsLoading || restoreIsLoading) && <Loading />}
            <Header
              selectedTaskTemplate={selectedTaskTemplate}
              currentRevision={currentRevision}
              formikProps={formikProps}
              handleputRestoreTaskTemplate={handleputRestoreTaskTemplate}
              handleSaveTaskTemplate={handleSaveTaskTemplate}
              isActive={isActive}
              isLoading={isLoading}
              isOldVersion={isOldVersion}
              cancelRequestRef={cancelRequestRef}
            />
            <div className={styles.content}>
              <section className={styles.taskActionsSection}>
                <p className={styles.description}>Build the definition requirements for this task.</p>
                <ConfirmModal
                  affirmativeAction={() => handleArchiveTaskTemplate(selectedTaskTemplate)}
                  affirmativeText="Archive this task"
                  containerClassName={styles.archiveContainer}
                  children={<ArchiveText />}
                  title="Archive"
                  modalTrigger={({ openModal }) => (
                    <Button
                      iconDescription="Archive"
                      renderIcon={Archive16}
                      kind="ghost"
                      size="field"
                      disabled={isOldVersion || !isActive}
                      className={styles.archive}
                      onClick={openModal}
                    >
                      Archive
                    </Button>
                  )}
                />
              </section>
              <div className={styles.detailCardsContainer}>
                <Tile className={styles.editDetailsCard}>
                  <section className={styles.editTitle}>
                    <h1>Basics</h1>
                    <EditTaskTemplateModal
                      taskTemplates={taskTemplates}
                      setFieldValue={setFieldValue}
                      fields={values.currentConfig}
                      values={values}
                      isOldVersion={isOldVersion}
                      isActive={isActive}
                      nodeType={selectedTaskTemplate.nodeType}
                    />
                  </section>
                  <dl className={styles.detailsDataList}>
                    <DetailDataElements value={values.name} label="Name" />
                    <DetailDataElements value={values.category} label="Category" />
                    <DetailDataElements value={values.icon} label="Icon" />
                    <DetailDataElements value={values.description} label="Description" />
                    <DetailDataElements value={values.arguments} label="Arguments" />
                    <DetailDataElements value={values.image} label="Image" />
                    <DetailDataElements value={values.command} label="Command" />
                    <section className={styles.infoSection}>
                      <dt className={styles.label}>Contribution level</dt>
                      <div className={styles.basicIcon}>
                        <p className={styles.value}>
                          {selectedTaskTemplate.verified ? "Verified task" : "Community contribution"}
                        </p>
                        {selectedTaskTemplate.verified ? (
                          <TooltipHover
                            direction="top"
                            tooltipText={
                              <div className={styles.tooltipContainer}>
                                <strong>Verified</strong>
                                <p style={{ marginTop: "0.5rem" }}>
                                  A task that is fully tested and verified right out of the box.
                                </p>
                              </div>
                            }
                          >
                            <Recommend16 fill="#0072C3" style={{ marginLeft: "0.5rem" }} />
                          </TooltipHover>
                        ) : (
                          <TooltipHover
                            direction="top"
                            tooltipText={
                              <div className={styles.tooltipContainer}>
                                <strong>Community contribution</strong>
                                <p style={{ marginTop: "0.5rem" }}>
                                  Added by a member of the Platform, not validated by the Platform team.
                                </p>
                              </div>
                            }
                          >
                            <Identification16 fill="#0072C3" style={{ marginLeft: "0.5rem" }} />
                          </TooltipHover>
                        )}
                      </div>
                    </section>
                  </dl>
                </Tile>
                <Tile className={styles.editFieldsCard}>
                  <section className={styles.editTitle}>
                    <hgroup className={styles.fieldsTitle}>
                      <h1>Definition fields</h1>
                      <h2 className={styles.fieldDesc}>Drag to reorder the fields</h2>
                    </hgroup>
                    <div className={styles.fieldActions}>
                      <PreviewConfig templateConfig={values.currentConfig} taskTemplateName={values.name} />
                      <TemplateConfigModal
                        fieldKeys={fieldKeys}
                        setFieldValue={setFieldValue}
                        templateFields={values.currentConfig}
                        isOldVersion={isOldVersion}
                        isActive={isActive}
                      />
                    </div>
                  </section>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable" direction="vertical">
                      {(provided) => (
                        <div className={styles.fieldsContainer} ref={provided.innerRef}>
                          {values.currentConfig?.length > 0 ? (
                            values.currentConfig.map((field, index) => (
                              <Draggable key={index} draggableId={index} index={index}>
                                {(provided) => (
                                  <Field
                                    field={field}
                                    dragHandleProps={provided.dragHandleProps}
                                    draggableProps={provided.draggableProps}
                                    innerRef={provided.innerRef}
                                    setFieldValue={setFieldValue}
                                    fields={values.currentConfig}
                                    deleteConfiguration={deleteConfiguration}
                                    isOldVersion={isOldVersion}
                                    isActive={isActive}
                                  />
                                )}
                              </Draggable>
                            ))
                          ) : (
                            <div className={styles.noFieldsContainer}>
                              <p className={styles.noFieldsTitle}>No fields (yet)</p>
                              <p className={styles.noFieldsText}>
                                Fields determine the function and parameters of a task, defining what the task does and
                                prompting users to fill in their values and messages.
                              </p>
                              <p className={styles.noFieldsText}>Add a field above to get started.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </Tile>
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}

export default TaskTemplateOverview;
