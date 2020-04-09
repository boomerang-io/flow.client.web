import React from "react";
// import PropTypes from "prop-types";
import { useQuery, queryCache } from "react-query";
import { Route, Switch, useRouteMatch, Redirect } from "react-router-dom";
import orderBy from "lodash/orderBy";
import ErrorDragon from "Components/ErrorDragon";
import Loading from "Components/Loading";
import TaskTemplatesTable from "./TaskTemplatesTable";
import TaskTemplateView from "./TaskTemplateView";
import { resolver, serviceUrl } from "Config/servicesConfig";
import { QueryStatus } from "Constants/reactQueryStatuses";
import styles from "./taskTemplates.module.scss";

export function TaskTemplatesContainer(){
  const match = useRouteMatch();
  const getTaskTemplatesUrl = serviceUrl.getTaskTemplates();
  const {
    data: taskTemplatesData,
    error: taskTemplatesDataError,
    status: taskTemplatesStatus
  } = useQuery({queryKey: getTaskTemplatesUrl, queryFn: resolver.query(getTaskTemplatesUrl)});
  const isLoading = taskTemplatesStatus === QueryStatus.Loading;

  const addTemplateInState = newTemplate => {
    const updatedTemplatesData = [...taskTemplatesData];
    updatedTemplatesData.push(newTemplate);
    queryCache.setQueryData(getTaskTemplatesUrl, orderBy(updatedTemplatesData, "name", "asc"));
  };
  const updateTemplateInState = updatedTemplate => {
    const updatedTemplatesData = [...taskTemplatesData];
    const templateToUpdateIndex = updatedTemplatesData.findIndex(template => template.id === updatedTemplate.id);
    // If we found it
    if (templateToUpdateIndex !== -1) {
      updatedTemplatesData.splice(templateToUpdateIndex, 1, updatedTemplate);
      queryCache.setQueryData(getTaskTemplatesUrl, updatedTemplatesData);
    }
  };
  const deleteTemplateInState = deletedTemplateId => {
    const updatedTemplatesData = [...taskTemplatesData];
    const templateToDeleteIndex = updatedTemplatesData.findIndex(template => template.id === deletedTemplateId);
    // If we found it
    if (templateToDeleteIndex !== -1) {
      updatedTemplatesData.splice(templateToDeleteIndex, 1);
      queryCache.setQueryData(getTaskTemplatesUrl, updatedTemplatesData);
    }
    return updatedTemplatesData;
  };
    if (isLoading) {
      return <Loading />;
    }

    if (taskTemplatesDataError) {
      return (
        <div className={styles.container}>
          <ErrorDragon />
        </div>
      );
    }

    if (taskTemplatesData) {
      return (
        <div className={styles.container}>
          <Switch>
            <Route path={[`${match.path}/edit/:taskTemplateId/:version`, `${match.path}/create`]}>
              <TaskTemplateView taskTemplates={taskTemplatesData} updateTemplateInState={updateTemplateInState} addTemplateInState={addTemplateInState}/>
            </Route>
            <Route exact path={match.path}>
              <TaskTemplatesTable
                data={taskTemplatesData}
                deleteTemplateInState={deleteTemplateInState}
              />
            </Route>
            <Redirect to="/task-templates" />
          </Switch>
        </div>
      );
    }
    return null;
}

export default TaskTemplatesContainer;
