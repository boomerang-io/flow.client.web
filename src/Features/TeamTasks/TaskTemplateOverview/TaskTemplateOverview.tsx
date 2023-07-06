//@ts-nocheck
import React from "react";
import { Helmet } from "react-helmet";
import { Formik } from "formik";
import axios from "axios";
import queryString from "query-string";
import { useHistory, Prompt, matchPath, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { Button, InlineNotification, Tag, Tile } from "@carbon/react";
import {
  ConfirmModal,
  Loading,
  notify,
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
import { Draggable as DraggableIcon, TrashCan, Archive, Bee } from "@carbon/react/icons";
import { DataDrivenInput, TaskTemplate } from "Types";
import styles from "./taskTemplateOverview.module.scss";
import { sentenceCase } from "change-case";

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
            <Bee style={{ width: "1rem", height: "1rem", marginRight: "0.75rem" }} />
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
        <DraggableIcon className={styles.dragabble} />
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
            renderIcon={TrashCan}
            size="md"
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
            renderIcon={TrashCan}
            size="md"
          />
        </TooltipHover>
      </div>
    </section>
  );
};

type TaskTemplateOverviewProps = {
  taskTemplates: Record<string, TaskTemplate[]>;
  updateTemplateInState: (args: TaskTemplate) => void;
  editVerifiedTasksEnabled: any;
};

export function TaskTemplateOverview({
  taskTemplates,
  updateTemplateInState,
  editVerifiedTasksEnabled,
}: TaskTemplateOverviewProps) {
  const cancelRequestRef = React.useRef();
  const queryClient = useQueryClient();

  const params = useParams();
  const history = useHistory();

  const invalidateQueries = () => {
    queryClient.invalidateQueries(
      serviceUrl.getTaskTemplates({
        query: queryString.stringify({ teams: params.team }),
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
    (args: { name: string; status: string }) => {
      const { promise } = resolver.putStatusTaskTemplate(args);
      return promise;
    },
    {
      onSuccess: invalidateQueries,
    }
  );
  const { mutateAsync: restoreTaskTemplateMutation, isLoading: restoreIsLoading } = useMutation(
    (args: { name: string; status: string }) => {
      const { promise } = resolver.putStatusTaskTemplate(args);
      return promise;
    },
    {
      onSuccess: invalidateQueries,
    }
  );

  let selectedTaskTemplateVersions = taskTemplates[params.name] ?? [];
  console.log("selectedTaskTemplateList", selectedTaskTemplateVersions);
  // Checks if the version in url are a valid one. If not, go to the latest version
  const invalidVersion = params.version === "0" || params.version > selectedTaskTemplateVersions.length;
  console.log("invalidVersion", invalidVersion);
  const selectedTaskTemplateVersion = invalidVersion ? selectedTaskTemplateVersions.length : params.version;
  console.log("selectedTaskTemplateVersion", selectedTaskTemplateVersion);
  let selectedTaskTemplate = selectedTaskTemplateVersions.find((t) => t.version == selectedTaskTemplateVersion) ?? {};
  console.log("selectedTaskTemplate", selectedTaskTemplate);
  const canEdit = !selectedTaskTemplate?.verified || (editVerifiedTasksEnabled && selectedTaskTemplate?.verified);
  console.log("canEdit", canEdit);
  const isActive = selectedTaskTemplate.status === TaskTemplateStatus.Active;
  console.log("isActive", isActive);
  const isOldVersion = !invalidVersion && params.version != selectedTaskTemplateVersions.length;
  console.log("isOldVersion", isOldVersion);
  const templateNotFound = !selectedTaskTemplate.name;

  const fieldKeys = selectedTaskTemplate.config?.map((input: DataDrivenInput) => input.key) ?? [];
  const resultKeys = selectedTaskTemplate.result?.map((input: DataDrivenInput) => input.key) ?? [];

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleSaveTaskTemplate = async (values, resetForm, requestType, setRequestError, closeModal) => {
    let newVersion =
      requestType === TemplateRequestType.Overwrite
        ? selectedTaskTemplateVersion
        : selectedTaskTemplateVersions.length + 1;
    let changeReason =
      requestType === TemplateRequestType.Copy
        ? "Version copied from ${values.currentConfig.version}"
        : values.comments;
    let newEnvs = values.envs.map((env) => {
      let index = env.indexOf(":");
      return { name: env.substring(0, index), value: env.substring(index + 1, env.length) };
    });
    const spec = {
      arguments: Boolean(values.arguments) ? values.arguments.trim().split(/\n{1,}/) : [],
      command: Boolean(values.command) ? values.command.trim().split(/\n{1,}/) : [],
      envs: newEnvs,
      image: values.image,
      results:
        hasFile && Boolean(values.currentRevision) && Boolean(values.currentRevision.results)
          ? values.currentRevision.results
          : [],
      script: values.script,
      workingDir: values.workingDir,
    };
    const body: TaskTemplate = {
      name: values.name,
      displayName: values.displayName,
      description: values.description,
      status: "active",
      category: values.category,
      version: newVersion,
      icon: values.icon.value,
      type: "template",
      changelog: { reason: changeReason },
      config: hasFile && Boolean(values.config) ? values.config : [],
      spec: spec,
    };

    try {
      if (requestType !== TemplateRequestType.Copy) {
        typeof setRequestError === "function" && setRequestError(null);
      }
      let replace = requestType === TemplateRequestType.Overwrite ? "true" : "false";
      let response = await uploadTaskTemplateMutation({ replace, body });
      notify(
        <ToastNotification
          kind="success"
          title={"Task Template Updated"}
          subtitle={`Request to update ${body.displayName} succeeded`}
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
      let response = await archiveTaskTemplateMutation({ name: selectedTaskTemplate.name, status: "disable" });
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
          subtitle={`Unable to archive the task. ${sentenceCase(err.message)}.`}
          data-testid="archive-task-template-notification"
        />
      );
    }
  };

  const handleputRestoreTaskTemplate = async () => {
    try {
      let response = await restoreTaskTemplateMutation({ name: selectedTaskTemplate.name, status: "enable" });
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
          subtitle={`Unable to restore the task. ${sentenceCase(err.message)}.`}
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
        displayName: selectedTaskTemplate.displayName,
        description: selectedTaskTemplate.description,
        icon: selectedTaskTemplate.icon,
        category: selectedTaskTemplate.category,
        image: selectedTaskTemplate.spec.image,
        currentConfig: selectedTaskTemplate.config ?? [],
        arguments: Array.isArray(selectedTaskTemplate.spec.arguments)
          ? selectedTaskTemplate.spec.arguments?.join("\n")
          : selectedTaskTemplate.spec.arguments ?? "",
        command: Array.isArray(selectedTaskTemplate.spec.command)
          ? selectedTaskTemplate.spec.command?.join("\n")
          : selectedTaskTemplate.spec.command ?? "",
        script: selectedTaskTemplate.spec.script ?? "",
        workingDir: selectedTaskTemplate.spec.workingDir ?? "",
        result: selectedTaskTemplate.spec.results ?? [],
        envs: selectedTaskTemplate.spec.envs ?? [],
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
              <title>{`Task manager - ${selectedTaskTemplate.displayName}`}</title>
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
              selectedTaskTemplates={selectedTaskTemplateVersions}
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
                {!canEdit && (
                  <InlineNotification
                    lowContrast
                    kind="info"
                    title="Verified tasks are not editable"
                    subtitle="Admins can adjust this in global settings"
                  />
                )}
                <ConfirmModal
                  affirmativeAction={() => handleArchiveTaskTemplate(selectedTaskTemplate)}
                  affirmativeText="Archive this task"
                  containerClassName={styles.archiveContainer}
                  children={<ArchiveText />}
                  title="Archive"
                  modalTrigger={({ openModal }) => (
                    <Button
                      iconDescription="Archive"
                      renderIcon={Archive}
                      kind="ghost"
                      size="md"
                      disabled={isOldVersion || !isActive || !canEdit}
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
                      taskTemplates={selectedTaskTemplateVersions}
                      setFieldValue={setFieldValue}
                      fields={values.currentConfig}
                      values={values}
                      isOldVersion={isOldVersion}
                      isActive={isActive}
                      canEdit={canEdit}
                    />
                  </section>
                  <dl className={styles.detailsDataList}>
                    <DetailDataElements value={values.name} label="Name" />
                    <DetailDataElements value={values.displayName} label="Display Name" />
                    <DetailDataElements value={values.category} label="Category" />
                    <DetailDataElements value={values.icon} label="Icon" />
                    <DetailDataElements value={values.description} label="Description" />
                    <DetailDataElements value={values.image} label="Image" />
                    <DetailDataElements value={values.command} label="Command" />
                    <DetailDataElements value={values.arguments} label="Arguments" />
                    <DetailDataElements value={values.script} label="Script" />
                    <DetailDataElements value={values.workingDir} label="Working Directory" />
                    <DetailDataElements value={values.envs} label="Envs" />
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
                        canEdit={canEdit}
                      />
                    </div>
                  </section>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable" direction="vertical">
                      {(provided) => (
                        <div className={styles.fieldsContainer} ref={provided.innerRef}>
                          {values.currentConfig?.length > 0 ? (
                            values.currentConfig.map((field, index) => (
                              <Draggable key={field.key} draggableId={field.key} index={index}>
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
                                    canEdit={canEdit}
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
                          {provided.placeholder}
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
                      canEdit={canEdit}
                    />
                  </section>
                  <div className={styles.fieldsContainer}>
                    {values.result?.length > 0 ? (
                      values.result.map((result, index) => (
                        <Result
                          key={result.name}
                          result={result}
                          setFieldValue={setFieldValue}
                          results={values.result}
                          DeleteResult={DeleteResult}
                          isOldVersion={isOldVersion}
                          isActive={isActive}
                          canEdit={canEdit}
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
