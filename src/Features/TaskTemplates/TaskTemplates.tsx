import React from "react";
import { Helmet } from "react-helmet";
import { useFeature } from "flagged";
import { useQuery } from "react-query";
import { useQueryClient } from "react-query";
import { Route, Switch, useRouteMatch, Redirect } from "react-router-dom";
import { Box } from "reflexbox";
import { Loading } from "@carbon/react";
import ErrorDragon from "Components/ErrorDragon";
import WombatMessage from "Components/WombatMessage";
import Sidenav from "./Sidenav";
import TaskTemplateOverview from "./TaskTemplateOverview";
import TaskTemplateYamlEditor from "./TaskTemplateYamlEditor";
import orderBy from "lodash/orderBy";
import { TaskTemplate, PaginatedTaskTemplateResponse } from "Types";
import { AppPath, appLink, FeatureFlag } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import styles from "./taskTemplates.module.scss";

const TaskTemplatesContainer: React.FC = () => {
  const queryClient = useQueryClient();
  const match = useRouteMatch();
  const editVerifiedTasksEnabled = useFeature(FeatureFlag.EditVerifiedTasksEnabled);
  const getTaskTemplatesUrl = serviceUrl.getTaskTemplates({ query: `statuses=active` });
  const {
    data: taskTemplatesData,
    error: taskTemplatesDataError,
    isLoading,
  } = useQuery<PaginatedTaskTemplateResponse, string>({
    queryKey: getTaskTemplatesUrl,
    queryFn: resolver.query(getTaskTemplatesUrl),
  });

  const addTemplateInState = (newTemplate: TaskTemplate) => {
    const updatedTemplatesData = [...taskTemplatesData?.content];
    updatedTemplatesData.push(newTemplate);
    queryClient.setQueryData(getTaskTemplatesUrl, orderBy(updatedTemplatesData, "name", "asc"));
  };
  const updateTemplateInState = (updatedTemplate: TaskTemplate) => {
    const updatedTemplatesData = [...taskTemplatesData.content];
    const templateToUpdateIndex = updatedTemplatesData.findIndex((template) => template.id === updatedTemplate.id);
    // If we found it
    if (templateToUpdateIndex !== -1) {
      updatedTemplatesData.splice(templateToUpdateIndex, 1, updatedTemplate);
      queryClient.setQueryData(getTaskTemplatesUrl, updatedTemplatesData);
    }
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

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Task Manager</title>
      </Helmet>
      <Sidenav taskTemplates={taskTemplatesData?.content} addTemplateInState={addTemplateInState} />
      <Switch>
        <Route exact path={match.path}>
          <Box maxWidth="24rem" margin="0 auto">
            <WombatMessage className={styles.wombat} title="Select a task or create one" />
          </Box>
        </Route>
        <Route path={AppPath.TaskTemplateEditor}>
          <TaskTemplateYamlEditor
            editVerifiedTasksEnabled={editVerifiedTasksEnabled}
            taskTemplates={taskTemplatesData?.content}
            updateTemplateInState={updateTemplateInState}
          />
        </Route>
        <Route path={AppPath.TaskTemplateDetail}>
          <TaskTemplateOverview
            editVerifiedTasksEnabled={editVerifiedTasksEnabled}
            taskTemplates={taskTemplatesData?.content}
            updateTemplateInState={updateTemplateInState}
          />
        </Route>
        <Redirect to={appLink.taskTemplates()} />
      </Switch>
    </div>
  );
};

export default TaskTemplatesContainer;
