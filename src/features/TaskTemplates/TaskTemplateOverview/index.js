import React from "react";
// import PropTypes from "prop-types";
// import { useQuery, queryCache } from "react-query";
import { Formik } from "formik";
import { useRouteMatch , useParams, useHistory, Prompt, matchPath } from "react-router-dom";
import { useMutation } from "react-query";
// import orderBy from "lodash/orderBy";
import { Tile, Button, Error404, notify, ToastNotification, Loading, TooltipDefinition, ConfirmModal } from "@boomerang/carbon-addons-boomerang-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import EditTaskTemplateModal from "./EditTaskTemplateModal";
import PreviewConfig from "./PreviewConfig";
import TemplateConfigModal from "./TemplateConfigModal";
import Header from "../Header";
import { QueryStatus } from "Constants/reactQueryStatuses";
import { Draggable16, Delete16, Archive16 } from "@carbon/icons-react";
import { resolver } from "Config/servicesConfig";
import { appLink } from "Config/appConfig";
import styles from "./taskTemplateOverview.module.scss";

const archiveText = `Archive a task when it is no longer supported and shouldn’t be used in new Workflows. 

Once archived, it will no longer appear in the Workflow Editor, but you can still view it in the Task Manager here. The task will remain functional in any existing Workflows to avoid breakage. 

You can restore an archived task later, if needed.

If you need to permanently delete a task, contact a Boomerang Admin to help (bmrgjoe@bmrg.com).`;

function DetailDataElements({ label, value }) {
  return (
    <section className={styles.infoSection}>
      <dt className={styles.label}>{label}</dt>
      <dd className={value ? styles.value : styles.noValue} data-testid={label}>
        {value ? value : "Not defined yet"}
      </dd>
    </section>
  );
}

function Field({field, innerRef, draggableProps, dragHandleProps, setFieldValue, settings, deleteConfiguration}) {
  return (
    <section className={styles.fieldSection} ref={innerRef} {...draggableProps} >
      <div className={styles.iconContainer} {...dragHandleProps}>
        <Draggable16 className={styles.dragabble}/>
      </div>
      <dd className={styles.value} data-testid={field.label}>
        {`${field.type} - ${field.label}`}
      </dd>
      <div className={styles.actions}>
        <TemplateConfigModal 
          isEdit
          setting={field}
          setFieldValue={setFieldValue}
          settings={settings}
        />
        <TooltipDefinition direction="bottom" tooltipText={"Delete field"} className={styles.deleteField}>
          <Button onClick={() => deleteConfiguration(field)} renderIcon={Delete16} kind="ghost" size="field" className={styles.delete}/>   
        </TooltipDefinition>
      </div>
    </section>
  );
}

export function TaskTemplateOverview({taskTemplates, updateTemplateInState}){
  const match = useRouteMatch();
  const params = useParams();
  const { taskTemplateId = "", version = ""} = params;
  const history = useHistory();
  const [UploadTaskTemplateMutation, status] = useMutation(resolver.putCreateTaskTemplate);
  const isLoading = status === QueryStatus.Loading;

  let selectedTaskTemplate = taskTemplates.find(taskTemplate => taskTemplate.id === taskTemplateId) ?? {};

  const invalidVersion = version === "0" || version > selectedTaskTemplate.currentVersion;
  // Checks if the version in url are a valid one. If not, go to the latest version
  // Need to improve this
  const currentRevision = selectedTaskTemplate?.revisions ? 
  invalidVersion?
  selectedTaskTemplate.revisions[selectedTaskTemplate.currentVersion - 1]
  :
  selectedTaskTemplate.revisions.find(revision => revision.version.toString() === version)
  :{};
  

  const templateNotFound = !selectedTaskTemplate.id;

  const settingKeys = currentRevision.config??[].map(input => input.key);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleSaveTaskTemplate = async (values, formikBag)  => {
    const newRevisions = [].concat(selectedTaskTemplate.revisions);
    const newVersion = selectedTaskTemplate.currentVersion + 1;
    let newRevisionConfig = {
      version: newVersion,
      image: values.image, 
      command: values.command,
      arguments : values.arguments.trim().split(/\s{1,}/),
      config: values.currentConfig
    };
    newRevisions.push(newRevisionConfig);
    const body = {
      ...selectedTaskTemplate,
      name: values.name,
      description: values.description,
      category: values.category,
      currentVersion: newVersion,
      revisions: newRevisions
    };
      try {
        const response = await UploadTaskTemplateMutation({ body });
        notify(
          <ToastNotification
            kind="success"
            title={"Task Template Updated"}
            subtitle={`Request to update ${body.name} succeeded`}
            data-testid="create-update-task-template-notification"
          />
        );
        formikBag.resetForm();
        history.push(appLink.taskTemplateEdit({id: match.params.taskTemplateId, version: newVersion}));
        updateTemplateInState(response);
      } catch (err) {
        notify(
          <ToastNotification
            kind="error"
            title={"Update Task Template Failed"}
            subtitle={"Something's Wrong"}
            data-testid="create-update-task-template-notification"
          />
        );
      }
  };

  if(templateNotFound)
    return( 
      <Error404 
        header="Task Template not found" 
        title="Crikey. We can't find the template you are looking for."
        message=""
      />
    );

  return(

    <Formik
      initialValues={{
        name: selectedTaskTemplate.name,
        description: selectedTaskTemplate.description,
        image: currentRevision.image,
        category: selectedTaskTemplate.category, 
        currentConfig: currentRevision.config??[],
        arguments: currentRevision.arguments?.join(" ") ?? "",
        command: currentRevision.command ?? "",
      }}
      enableReinitialize={true}
      onSubmit={handleSaveTaskTemplate}
    >
      {
        props => {
          const { setFieldValue, values, isValid, dirty: isDirty, resetForm, handleSubmit, isSubmitting } = props;

          function deleteConfiguration(selectedSetting) {
            const configIndex = values.currentConfig.findIndex(setting => setting.key === selectedSetting.key);
            let newProperties = [].concat(values.currentConfig);
            newProperties.splice(configIndex,1);
            setFieldValue("currentConfig", newProperties);
          }
          const onDragEnd = async result => {
            if (result.source && result.destination) {
              const newSettings = reorder(values.currentConfig, result.source.index, result.destination.index);
              setFieldValue("currentConfig", newSettings);
            }
          };
          return (
            <div className={styles.container}>
              <Prompt 
                message={(location, match, ahh) => {
                  let prompt = true;
                  const templateMatch = matchPath(location.pathname, { path: "/task-templates/:taskTemplateId/:version" });
                  if(isDirty && templateMatch?.params?.version !== version && !isSubmitting){
                    prompt = "Are you sure you want to change the version? Your changes will be lost.";
                  }
                  if (location.pathname === "/task-templates" && isDirty && !isSubmitting) {
                    prompt = "Are you sure you want to leave? You have unsaved changes.";
                  }
                  return prompt;
                }}
              />
              {isLoading && <Loading />}
              <Header selectedTaskTemplate={selectedTaskTemplate} currentRevision={currentRevision} handleResetTemplate={resetForm} isValid={isValid} isDirty={isDirty} handleSubmit={handleSubmit}/>
              <div className={styles.content}>
                <section className={styles.taskActions}>
                  <p className={styles.description}>Build the definition requirements for this task.</p>
                  <ConfirmModal
                    affirmativeAction={() => console.log("affirmative")}
                    children={archiveText}
                    title="Archive"
                    modalTrigger={({ openModal }) => (
                      <Button renderIcon={Archive16} kind="ghost" size="field" className={styles.archive} onClick={openModal}>Archive</Button>
                    )}
                  />
                </section>
                <div className={styles.actionContainer}>
                  <Tile className={styles.editDetails}>
                    <section className={styles.editTitle}>
                      <p>Basics</p>
                      <EditTaskTemplateModal taskTemplates={taskTemplates} setFieldValue={setFieldValue} settings={values.currentConfig} values={values}/>
                    </section>
                    <dl>
                      <DetailDataElements value={values.name} label="Name" />
                      <DetailDataElements value={values.category} label="Category" />
                      <DetailDataElements value={values.image} label="Icon" />
                      <DetailDataElements value={values.description} label="Description" />
                    </dl>
                  </Tile>
                  <Tile className={styles.editFields}>
                    <section className={styles.editTitle}>
                      <div className={styles.fieldsTitle}>
                        <p>Definition fields</p>
                        <p className={styles.fieldDesc}>Drag to reorder the fields</p>
                      </div>
                      <div className={styles.fieldActions}>
                        <PreviewConfig templateConfig={values.currentConfig} taskTemplateName={values.name}/>
                        <TemplateConfigModal settingKeys={settingKeys} setFieldValue={setFieldValue} settings={values.currentConfig} />
                      </div>
                    </section>
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="droppable" direction="vertical">
                          {
                            provided => (
                              <section className={styles.fieldsContainer} ref={provided.innerRef}>
                              {
                                values.currentConfig?.length > 0 ?
                                values.currentConfig.map((field, index) => (
                                  <Draggable key={index} draggableId={index} index={index}>
                                    { provided => (
                                      <Field 
                                        field={field} 
                                        dragHandleProps={provided.dragHandleProps}
                                        draggableProps={provided.draggableProps}
                                        innerRef={provided.innerRef}
                                        setFieldValue={setFieldValue}
                                        settings={values.currentConfig}
                                        deleteConfiguration={deleteConfiguration}
                                      />
                                    )}
                                  </Draggable>
                                ))
                                :
                                <Error404 header="" message="Fields not found"/>
                              }
                              </section>
                            )
                          }
                      </Droppable>
                    </DragDropContext>
                  </Tile>
                </div>
              </div>
            </div>
          );
        }
      }
    </Formik>
  );
}

export default TaskTemplateOverview;
