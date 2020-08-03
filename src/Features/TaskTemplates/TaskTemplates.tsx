import React from "react";
import { useQuery } from "Hooks";
import { queryCache } from "react-query";
import { Route, Switch, useRouteMatch, Redirect } from "react-router-dom";
import { Loading } from "@boomerang-io/carbon-addons-boomerang-react";
import ErrorDragon from "Components/ErrorDragon";
import WombatMessage from "Components/WombatMessage";
import Sidenav from "./Sidenav";
import TaskTemplateOverview from "./TaskTemplateOverview";
import orderBy from "lodash/orderBy";
import{ TaskModel } from "Types";
import { AppPath, appLink } from "Config/appConfig";
import { serviceUrl } from "Config/servicesConfig";
import styles from "./taskTemplates.module.scss";

const TaskTemplatesContainer: React.FC = () => {
  const match = useRouteMatch();
  const getTaskTemplatesUrl = serviceUrl.getTaskTemplates();
  const { data: taskTemplatesData, error: taskTemplatesDataError, isLoading, isIdle } = useQuery(
    getTaskTemplatesUrl
  );

  const addTemplateInState = (newTemplate: TaskModel) => {
    const updatedTemplatesData = [...taskTemplatesData];
    updatedTemplatesData.push(newTemplate);
    queryCache.setQueryData(getTaskTemplatesUrl, orderBy(updatedTemplatesData, "name", "asc"));
  };
  const updateTemplateInState = (updatedTemplate: TaskModel) => {
    const updatedTemplatesData = [...taskTemplatesData];
    const templateToUpdateIndex = updatedTemplatesData.findIndex((template) => template.id === updatedTemplate.id);
    // If we found it
    if (templateToUpdateIndex !== -1) {
      updatedTemplatesData.splice(templateToUpdateIndex, 1, updatedTemplate);
      queryCache.setQueryData(getTaskTemplatesUrl, updatedTemplatesData);
    }
  };

  if (isIdle) {
    return null;
  }

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

  return (
    <div className={styles.container}>
      <Sidenav taskTemplates={taskTemplatesData} addTemplateInState={addTemplateInState} />
      <Switch>
        <Route exact path={match.path}>
          <WombatMessage className={styles.wombat} message="Select a task or add a new one" />
        </Route>
        <Route path={AppPath.TaskTemplateEdit}>
          <TaskTemplateOverview taskTemplates={taskTemplatesData} updateTemplateInState={updateTemplateInState} />
        </Route>
        <Redirect to={appLink.taskTemplates()} />
      </Switch>
    </div>
  );

}

export default TaskTemplatesContainer;
