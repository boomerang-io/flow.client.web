import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useFeature } from "flagged";
import { useQuery } from "Hooks";
import { useQueryClient } from "react-query";
import { Route, Switch, useRouteMatch, Redirect } from "react-router-dom";
import { Box } from "reflexbox";
import queryString from "query-string";
import ErrorDragon from "Components/ErrorDragon";
import WombatMessage from "Components/WombatMessage";
import Sidenav from "../Sidenav";
import TaskTemplateOverview from "../TaskTemplateOverview";
import TaskTemplateYamlEditor from "../TaskTemplateEditor";
import orderBy from "lodash/orderBy";
import { TaskTemplate } from "Types";
import { AppPath, appLink, FeatureFlag } from "Config/appConfig";
import { serviceUrl } from "Config/servicesConfig";
import styles from "../TaskManager.module.scss";

const HELMUT_TITLE = "Task Manager";

function TaskTemplatesContainer() {
  const match = useRouteMatch();
  const editVerifiedTasksEnabled = useFeature(FeatureFlag.EditVerifiedTasksEnabled);
  const getTaskTemplatesUrl = serviceUrl.getTaskTemplates({
    query: queryString.stringify({ statuses: "active,inactive" }),
  });
  const { data: taskTemplatesData, error: taskTemplatesDataError, isLoading } = useQuery(getTaskTemplatesUrl);

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
          <title>{HELMUT_TITLE}</title>
        </Helmet>
        <Sidenav isLoading taskTemplates={taskTemplatesByName} getTaskTemplatesUrl={getTaskTemplatesUrl} />
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
          <title>{HELMUT_TITLE}</title>
        </Helmet>
        <ErrorDragon />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Helmet>
        <title>{HELMUT_TITLE}</title>
      </Helmet>
      <Sidenav taskTemplates={taskTemplatesByName} getTaskTemplatesUrl={getTaskTemplatesUrl} />
      <Switch>
        <Route exact path={match.path}>
          <Box maxWidth="24rem" margin="0 auto">
            <WombatMessage className={styles.wombat} title="Select a task or create one" />
          </Box>
        </Route>
        <Route path={AppPath.TaskTemplateEditor} strict={true}>
          <TaskTemplateYamlEditor
            editVerifiedTasksEnabled={editVerifiedTasksEnabled}
            taskTemplates={taskTemplatesByName}
            getTaskTemplatesUrl={getTaskTemplatesUrl}
          />
        </Route>
        <Route path={AppPath.TaskTemplateDetail} strict={true}>
          <TaskTemplateOverview
            editVerifiedTasksEnabled={editVerifiedTasksEnabled}
            taskTemplates={taskTemplatesByName}
            getTaskTemplatesUrl={getTaskTemplatesUrl}
          />
        </Route>
        <Redirect to={appLink.taskTemplates()} />
      </Switch>
    </div>
  );
}

export default TaskTemplatesContainer;
