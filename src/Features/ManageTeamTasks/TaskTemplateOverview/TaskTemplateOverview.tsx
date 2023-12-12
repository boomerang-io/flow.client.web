//@ts-nocheck
import React from "react";
import { Helmet } from "react-helmet";
import { Formik } from "formik";
import axios from "axios";
import queryString from "query-string";
import { useHistory, Prompt, matchPath, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import {
  Button,
  ConfirmModal,
  InlineNotification,
  Loading,
  notify,
  Tag,
  Tile,
  ToastNotification,
  TooltipHover,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import EmptyState from "Components/EmptyState";
import EditTaskTemplateModal from "Components/EditTaskTemplateModal";
import TemplateParametersModal from "Components/TemplateParametersModal";
import PreviewConfig from "Components/PreviewConfig";
import TemplateConfigModal from "Components/TemplateConfigModal";
import Header from "../Header";
import { formatErrorMessage } from "@boomerang-io/utils";
import { TaskTemplateStatus } from "Constants";
import { TemplateRequestType, FieldTypes } from "../constants";
import { taskIcons } from "Utils/taskIcons";
import { resolver, serviceUrl } from "Config/servicesConfig";
import { appLink, AppPath } from "Config/appConfig";
import { Draggable16, TrashCan16, Archive16, Bee16, Recommend16, Identification16 } from "@carbon/icons-react";
import { DataDrivenInput, TaskModel } from "Types";
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
  </>
);

interface DetailDataElementsProps {
  label: string;
  value: string;
}

const DetailDataElements: React.FC<DetailDataElementsProps> = ({ label, value }) => {
  const TaskIcon = taskIcons.find((icon) => icon.name === value);

  if (label === "Envs") {
    return (
      <section className={styles.infoSection}>
        <dt className={styles.label}>{label}</dt>
        <dd className={value?.length ? styles.value : styles.noValue} data-testid={label}>
          {value?.length > 0
            ? value.map((env) => {
                return <Tag>{`${env.name}:${env.value}`}</Tag>;
              })
            : "Not defined yet"}
        </dd>
      </section>
    );
  }

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
  canEdit: boolean;
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
  canEdit,
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
        {`${FieldTypes[field.type]} | ${field.label} - ${field.key}`}
      </dd>
      <div className={styles.actions}>
        <TemplateConfigModal
          isActive={isActive}
          isEdit
          field={field}
          isOldVersion={isOldVersion}
          setFieldValue={setFieldValue}
          templateFields={fields}
          canEdit={canEdit}
        />
        <TooltipHover direction="bottom" tooltipText={"Delete field"}>
          <Button
            className={styles.delete}
            disabled={isOldVersion || !isActive || !canEdit}
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

interface ResultProps {
  result: any;
  setFieldValue: any;
  results: any;
  DeleteResult: any;
  isOldVersion: any;
  isActive: any;
  canEdit: boolean;
  index: number;
  resultKeys: string[];
}

const Result: React.FC<ResultProps> = ({
  result,
  setFieldValue,
  results,
  DeleteResult,
  isOldVersion,
  isActive,
  canEdit,
  index,
  resultKeys,
}) => {
  return (
    <section className={styles.fieldSection}>
      <dd
        className={styles.value}
        data-testid={result.name}
        // style={{ marginLeft: `${isOldVersion || !isActive ? "1.5rem" : "0"}` }}
        style={{ paddingLeft: `1rem` }}
      >
        {`${result.name} | ${result.description}`}
      </dd>
      <div className={styles.actions}>
        <TemplateParametersModal
          result={result}
          isEdit
          index={index}
          resultKeys={resultKeys}
          setFieldValue={setFieldValue}
          templateFields={results}
          isOldVersion={isOldVersion}
          isActive={isActive}
          canEdit={canEdit}
        />
        <TooltipHover direction="bottom" tooltipText={"Delete result paramater"}>
          <Button
            className={styles.delete}
            disabled={isOldVersion || !isActive || !canEdit}
            iconDescription="delete-parameter"
            kind="ghost"
            onClick={() => DeleteResult(index)}
            renderIcon={TrashCan16}
            size="field"
          />
        </TooltipHover>
      </div>
    </section>
  );
};

type TaskTemplateOverviewProps = {
  taskTemplates: any[];
  updateTemplateInState: (args: TaskModel) => void;
  editVerifiedTasksEnabled: any;
  canEditWorkflow: boolean;
};

export function TaskTemplateOverview({
  taskTemplates,
  updateTemplateInState,
  editVerifiedTasksEnabled,
  canEditWorkflow,
}: TaskTemplateOverviewProps) {
  const cancelRequestRef = React.useRef();
  const queryClient = useQueryClient();

  const params = useParams();
  const history = useHistory();

  const invalidateQueries = () => {
    queryClient.invalidateQueries(
      serviceUrl.getTaskTemplates({
        query: queryString.stringify({ teamId: params?.teamId, scope: "team" }),
      })
    );
    queryClient.invalidateQueries(serviceUrl.getFeatureFlags());
  };

  const { mutateAsync: uploadTaskTemplateMutation, isLoading } = useMutation(
    (args) => {
      const { promise, cancel } = resolver.putCreateTaskTemplate(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: invalidateQueries,
    }
  );
  const { mutateAsync: archiveTaskTemplateMutation, isLoading: archiveIsLoading } = useMutation(
    resolver.deleteArchiveTaskTemplate,
    {
      onSuccess: invalidateQueries,
    }
  );
  const { mutateAsync: restoreTaskTemplateMutation, isLoading: restoreIsLoading } = useMutation(
    resolver.putRestoreTaskTemplate,
    {
      onSuccess: invalidateQueries,
    }
  );

  let selectedTaskTemplate = taskTemplates.find((taskTemplate) => taskTemplate.id === params.taskId) ?? {};
  const canEdit = !selectedTaskTemplate?.verified || (editVerifiedTasksEnabled && selectedTaskTemplate?.verified);

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
  const resultKeys = currentRevision.result?.map((input: DataDrivenInput) => input.key) ?? [];

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
        command: Boolean(values.command) ? values.command.trim().split(/\n{1,}/) : [],
        script: values.script,
        workingDir: values.workingDir,
        arguments: Boolean(values.arguments) ? values.arguments.trim().split(/\n{1,}/) : [],
        config: values.currentConfig,
        results: values.result,
        envs: values.envs,
        serviceAccountName: values.serviceAccountName,
        securityContext: values.securityContext,
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
        scope: "team",
        flowTeamId: params?.teamId,
      };
    } else {
      newRevisionConfig = {
        version: newVersion,
        image: values.image,
        command: Boolean(values.command) ? values.command.trim().split(/\n{1,}/) : [],
        script: values.script,
        workingDir: values.workingDir,
        arguments: Boolean(values.arguments) ? values.arguments.trim().split(/\n{1,}/) : [],
        config: values.currentConfig,
        results: values.result,
        envs: values.envs,
        serviceAccountName: values.serviceAccountName,
        securityContext: values.securityContext,
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
        scope: "team",
        flowTeamId: params?.teamId,
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
        appLink.manageTaskTemplateEdit({
          teamId: params.teamId,
          taskId: params.taskId,
          version: response.data.currentVersion,
        })
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
      <EmptyState title="Task Template not found" message="Crikey. We can't find the template you are looking for." />
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
        arguments: Array.isArray(currentRevision.arguments)
          ? currentRevision.arguments?.join("\n")
          : currentRevision.arguments ?? "",
        command: Array.isArray(currentRevision.command)
          ? currentRevision.command?.join("\n")
          : currentRevision.command ?? "",
        script: currentRevision.script ?? "",
        workingDir: currentRevision.workingDir ?? "",
        result: currentRevision.results ?? [],
        envs: currentRevision.envs ?? [],
        serviceAccountName: currentRevision.serviceAccountName ?? "",
        securityContext: currentRevision.securityContext ?? "",
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
        function DeleteResult(index) {
          let newResults = [].concat(values.result);
          newResults.splice(index, 1);
          setFieldValue("result", newResults);
        }
        const onDragEnd = async (result) => {
          if (result.source && result.destination) {
            const newFields = reorder(values.currentConfig, result.source.index, result.destination.index);
            setFieldValue("currentConfig", newFields);
          }
        };
        return (
          <div className={styles.container}>
            <Helmet>
              <title>{`Task manager - ${selectedTaskTemplate.name}`}</title>
            </Helmet>
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
              editVerifiedTasksEnabled={editVerifiedTasksEnabled}
              selectedTaskTemplate={selectedTaskTemplate}
              currentRevision={currentRevision}
              formikProps={formikProps}
              handleputRestoreTaskTemplate={handleputRestoreTaskTemplate}
              handleSaveTaskTemplate={handleSaveTaskTemplate}
              isActive={isActive}
              isLoading={isLoading}
              isOldVersion={isOldVersion}
              cancelRequestRef={cancelRequestRef}
              canEditWorkflow={canEditWorkflow}
            />
            <div className={styles.content}>
              <section className={styles.taskActionsSection}>
                <p className={styles.description}>Build the definition requirements for this task.</p>
                {!canEdit && (
                  <InlineNotification
                    lowContrast
                    kind="info"
                    title="Verified tasks are not editable"
                    subtitle="Admins can adjust this in global settings"
                  />
                )}
                {canEditWorkflow && (
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
                        disabled={isOldVersion || !isActive || !canEdit}
                        className={styles.archive}
                        onClick={openModal}
                      >
                        Archive
                      </Button>
                    )}
                  />
                )}
              </section>
              <div className={styles.detailCardsContainer}>
                <Tile className={styles.editDetailsCard}>
                  <section className={styles.editTitle}>
                    <h1>Basics</h1>
                    {canEditWorkflow && (
                      <EditTaskTemplateModal
                        taskTemplates={taskTemplates}
                        setFieldValue={setFieldValue}
                        fields={values.currentConfig}
                        values={values}
                        isOldVersion={isOldVersion}
                        isActive={isActive}
                        nodeType={selectedTaskTemplate.nodeType}
                        canEdit={canEdit}
                      />
                    )}
                  </section>
                  <dl className={styles.detailsDataList}>
                    <DetailDataElements value={values.name} label="Name" />
                    <DetailDataElements value={values.category} label="Category" />
                    <DetailDataElements value={values.icon} label="Icon" />
                    <DetailDataElements value={values.description} label="Description" />
                    <DetailDataElements value={values.image} label="Image" />
                    <DetailDataElements value={values.command} label="Command" />
                    <DetailDataElements value={values.arguments} label="Arguments" />
                    <DetailDataElements value={values.script} label="Script" />
                    <DetailDataElements value={values.workingDir} label="Working Directory" />
                    <DetailDataElements value={values.envs} label="Envs" />
                    <DetailDataElements value={values.serviceAccountName} label="Service Account Name" />
                    <DetailDataElements value={values.securityContext} label="Security Context" />
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
                        canEdit={canEdit && canEditWorkflow}
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
                                    canEdit={canEdit && canEditWorkflow}
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
                <Tile className={styles.editFieldsCard}>
                  <section className={styles.editTitleParameters}>
                    <h1>Result Parameters</h1>
                    <TemplateParametersModal
                      resultKeys={resultKeys}
                      setFieldValue={setFieldValue}
                      templateFields={values.result}
                      isOldVersion={isOldVersion}
                      isActive={isActive}
                      canEdit={canEdit && canEditWorkflow}
                    />
                  </section>
                  <div className={styles.fieldsContainer}>
                    {values.result?.length > 0 ? (
                      values.result.map((result, index) => (
                        <Result
                          result={result}
                          setFieldValue={setFieldValue}
                          results={values.result}
                          DeleteResult={DeleteResult}
                          isOldVersion={isOldVersion}
                          isActive={isActive}
                          canEdit={canEdit && canEditWorkflow}
                          index={index}
                        />
                      ))
                    ) : (
                      <div className={styles.noFieldsContainer}>
                        <p className={styles.noFieldsTitle}>No Result Paramaters (yet)</p>
                        <p className={styles.noFieldsText}>
                          Result Parameters map to the output of a task. Provide the name and description for the
                          variables that will be output as a results of this task.
                        </p>
                        <p className={styles.noFieldsText}>Add a result paramater above to get started.</p>
                      </div>
                    )}
                  </div>
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
