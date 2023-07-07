import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useFeature } from "flagged";
import { useQuery } from "Hooks";
import { useQueryClient } from "react-query";
import { Route, Switch, useRouteMatch, Redirect } from "react-router-dom";
import { Box } from "reflexbox";
import queryString from "query-string";
import ErrorDragon from "Components/ErrorDragon";
import { useHistory } from "react-router-dom";
import WombatMessage from "Components/WombatMessage";
import Sidenav from "./Sidenav";
import TaskTemplateOverview from "./TaskTemplateOverview";
import TaskTemplateYamlEditor from "./TaskTemplateYamlEditor";
import orderBy from "lodash/orderBy";
import { TaskTemplate } from "Types";
import { useAppContext } from "Hooks";
import { AppPath, appLink, FeatureFlag } from "Config/appConfig";
import { serviceUrl } from "Config/servicesConfig";
import styles from "./taskTemplates.module.scss";

function TaskTemplatesContainer() {
  const { activeTeam } = useAppContext();
  const history = useHistory();
  const match = useRouteMatch();
  const queryClient = useQueryClient();
  const editVerifiedTasksEnabled = useFeature(FeatureFlag.EditVerifiedTasksEnabled);
  const getTaskTemplatesUrl = serviceUrl.getTaskTemplates({
    query: queryString.stringify({ teams: activeTeam?.id }),
  });
  const {
    data: taskTemplatesData,
    error: taskTemplatesDataError,
    isLoading,
  } = useQuery(getTaskTemplatesUrl, {
    enabled: Boolean(activeTeam),
  });

  /**
   * This adds the new TaskTemplate to the existing taskTemplates
   * rather then requerying the API for the new templates
   */
  const addTemplateInState = (newTemplate: TaskTemplate) => {
    const updatedTemplatesData = [...taskTemplatesData.content];
    updatedTemplatesData.push(newTemplate);
    queryClient.setQueryData(getTaskTemplatesUrl, orderBy(updatedTemplatesData, "name", "asc"));
  };
  const updateTemplateInState = (updatedTemplate: TaskTemplate) => {
    const updatedTemplatesData = [...taskTemplatesData];
    const templateToUpdateIndex = updatedTemplatesData.findIndex((template) => template.name === updatedTemplate.name);
    // If we found it
    if (templateToUpdateIndex !== -1) {
      updatedTemplatesData.splice(templateToUpdateIndex, 1, updatedTemplate);
      queryClient.setQueryData(getTaskTemplatesUrl, updatedTemplatesData);
    }
  };

  /** Check if there is an active team or redirect to home */
  if (!activeTeam) {
    return history.push(appLink.home());
  }

  // Collect the tasks by name and array of sorted by version task templates
  let taskTemplatesByName = taskTemplatesData?.content.reduce(
    (acc: Record<string, TaskTemplate[]>, task: TaskTemplate) => {
      if (acc[task.name]) {
        acc[task.name].push(task);
        acc[task.name].sort((a, b) => b.version - a.version);
      } else {
        acc[task.name] = [task];
      }
      return acc;
    },
    {}
  );

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Helmet>
          <title>Team Tasks</title>
        </Helmet>
        <Sidenav
          isLoading
          activeTeam={activeTeam}
          addTemplateInState={addTemplateInState}
          taskTemplates={taskTemplatesByName}
          getTaskTemplatesUrl={getTaskTemplatesUrl}
        />
        <Box maxWidth="24rem" margin="0 auto">
          <WombatMessage className={styles.wombat} title="Retrieving Tasks..." />
        </Box>
      </div>
    );
  }

  if (taskTemplatesDataError) {
    return (
      <div className={styles.container}>
        <Helmet>
          <title>Team Tasks</title>
        </Helmet>
        <ErrorDragon />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Team Tasks</title>
      </Helmet>
      <Sidenav
        activeTeam={activeTeam}
        addTemplateInState={addTemplateInState}
        taskTemplates={taskTemplatesByName}
        getTaskTemplatesUrl={getTaskTemplatesUrl}
      />
      <Switch>
        <Route exact path={match.path}>
          <Box maxWidth="24rem" margin="0 auto">
            <WombatMessage className={styles.wombat} title="Select a task or create one" />
          </Box>
        </Route>
        <Route path={AppPath.ManageTaskTemplateYaml} strict={true}>
          <TaskTemplateYamlEditor
            editVerifiedTasksEnabled={editVerifiedTasksEnabled}
            taskTemplates={taskTemplatesByName}
            updateTemplateInState={updateTemplateInState}
          />
        </Route>
        <Route path={AppPath.ManageTaskTemplateEdit} strict={true}>
          <TaskTemplateOverview
            editVerifiedTasksEnabled={editVerifiedTasksEnabled}
            taskTemplates={taskTemplatesByName}
            updateTemplateInState={updateTemplateInState}
            getTaskTemplatesUrl={getTaskTemplatesUrl}
          />
        </Route>
        <Redirect to={appLink.manageTaskTemplates({ teamId: activeTeam.id })} />
      </Switch>
    </div>
  );
}

export default TaskTemplatesContainer;
