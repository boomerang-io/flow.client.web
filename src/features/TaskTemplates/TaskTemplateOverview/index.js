import React, { useEffect } from "react";
// import PropTypes from "prop-types";
// import { useQuery, queryCache } from "react-query";
import { Route, Switch, useRouteMatch, Redirect, useParams } from "react-router-dom";
// import orderBy from "lodash/orderBy";
import { Tile, Button, Error404 } from "@boomerang/carbon-addons-boomerang-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import ErrorDragon from "Components/ErrorDragon";
// import Loading from "Components/Loading";
import Header from "../Header";
// import Sidenav from "./Sidenav";
// import TaskTemplatesTable from "./TaskTemplatesTable";
// import TaskTemplateView from "./TaskTemplateView";
// import { resolver, serviceUrl } from "Config/servicesConfig";
// import { QueryStatus } from "Constants/reactQueryStatuses";
import { Edit16, Add16, Draggable16, Delete16 } from "@carbon/icons-react";
import styles from "./taskTemplateOverview.module.scss";

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

function Field({field, innerRef, draggableProps, dragHandleProps}) {
  return (
    <section className={styles.fieldSection} ref={innerRef} {...draggableProps} >
      <div className={styles.iconContainer} {...dragHandleProps}>
        <Draggable16 className={styles.dragabble}/>
      </div>
      <dd className={styles.value} data-testid={field.label}>
        {`${field.type} - ${field.label}`}
      </dd>
      <div className={styles.actions}>
        <Button renderIcon={Edit16} kind="ghost" size="field"/>
        <Button renderIcon={Delete16} kind="ghost" size="field" className={styles.delete}/>
      </div>
    </section>
  );
}

export function TaskTemplateOverview({taskTemplates, deleteTemplateInState}){
  const match = useRouteMatch();
  const params = useParams();
  const { taskTemplateId = "", version = ""} = params;
  let selectedTaskTemplate = taskTemplates.find(taskTemplate => taskTemplate.id === taskTemplateId) ?? {};
  let taskTemplateNames = taskTemplates.map(taskTemplate => taskTemplate.name);

  if (taskTemplateId) {
    taskTemplateNames = taskTemplateNames.filter(name => name !== selectedTaskTemplate.name);
  }
  const invalidVersion = version === "0" || version > selectedTaskTemplate.currentVersion;
  // Checks if the version in url are a valid one. If not, go to the latest version
  // Need to improve this
  const currentRevision = selectedTaskTemplate?.revisions ? 
  invalidVersion?
  selectedTaskTemplate.revisions[selectedTaskTemplate.currentVersion - 1]
  :
  selectedTaskTemplate.revisions.find(revision => revision.version.toString() === version)
  :{};

  const [ currentConfig, setCurrentConfig ] = React.useState(currentRevision.config??[]);

  const templateNotFound = match.url.includes("edit") && !selectedTaskTemplate.id;

  useEffect(() => {
    setCurrentConfig(currentRevision.config??[]);
  },[currentRevision]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = async result => {
    if (result.source && result.destination) {
      const newSettings = reorder(currentConfig, result.source.index, result.destination.index);
      setCurrentConfig(newSettings);
      // setFieldValue("actionsInfo", { ...actionsInfo, [type]: actions });
    }
  };

  // const getTaskTemplatesUrl = serviceUrl.getTaskTemplates();
  // const {
  //   data: taskTemplatesData,
  //   error: taskTemplatesDataError,
  //   status: taskTemplatesStatus
  // } = useQuery({queryKey: getTaskTemplatesUrl, queryFn: resolver.query(getTaskTemplatesUrl)});
  // const isLoading = taskTemplatesStatus === QueryStatus.Loading;
  return (
    <div className={styles.container}>
      <Header selectedTaskTemplate={selectedTaskTemplate} currentRevision={currentRevision}/>
      <div className={styles.content}>
        <p className={styles.description}>Build the definition requirements for this task.</p>
        <div className={styles.actionContainer}>
          <Tile className={styles.editDetails}>
            <section className={styles.editTitle}>
              <p>Basics</p>
              <Button renderIcon={Edit16} kind="ghost" size="field"/>
            </section>
            <dl>
              <DetailDataElements value={selectedTaskTemplate.name} label="Name" />
              <DetailDataElements value={selectedTaskTemplate.category} label="Category" />
              <DetailDataElements value={selectedTaskTemplate.image} label="Icon" />
              <DetailDataElements value={selectedTaskTemplate.description} label="Description" />
            </dl>
          </Tile>
          <Tile className={styles.editFields}>
            <section className={styles.editTitle}>
              <div className={styles.fieldsTitle}>
                <p>Definition fields</p>
                <p className={styles.fieldDesc}>Drag to reorder the fields</p>
              </div>
              <Button renderIcon={Add16} kind="ghost" size="field">Add a field</Button>
            </section>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable" direction="vertical">
                  {
                    provided => (
                      <section className={styles.fieldsContainer} ref={provided.innerRef}>
                      {
                        currentConfig?.length > 0 ?
                        currentConfig.map((field, index) => (
                          <Draggable key={index} draggableId={index} index={index}>
                            { provided => (
                              <Field 
                                field={field} 
                                dragHandleProps={provided.dragHandleProps}
                                draggableProps={provided.draggableProps}
                                innerRef={provided.innerRef}
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

export default TaskTemplateOverview;
