import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useFeature } from "flagged";
import { useQuery } from "Hooks";
import { queryCache } from "react-query";
import { Route, Switch, useRouteMatch, Redirect, useParams } from "react-router-dom";
import { Box } from "reflexbox";
import { Loading } from "@boomerang-io/carbon-addons-boomerang-react";
import queryString from "query-string";
import ErrorDragon from "Components/ErrorDragon";
import WombatMessage from "Components/WombatMessage";
import Sidenav from "./Sidenav";
import TaskTemplateOverview from "./TaskTemplateOverview";
import TaskTemplateYamlEditor from "./TaskTemplateYamlEditor";
import orderBy from "lodash/orderBy";
import { TaskModel } from "Types";
import { AppPath, appLink, FeatureFlag } from "Config/appConfig";
import { serviceUrl } from "Config/servicesConfig";
import styles from "./taskTemplates.module.scss";

const TaskTemplatesContainer: React.FC = () => {
  const params: { teamId: string } = useParams();
  const [activeTeam, setActiveTeam] = useState(params?.teamId ?? null);
  const match = useRouteMatch();
  const getTaskTemplatesUrl = serviceUrl.getTaskTemplates({
    query: queryString.stringify({ teamId: params?.teamId, scope: "team" }),
  });
  const editVerifiedTasksEnabled = useFeature(FeatureFlag.EditVerifiedTasksEnabled);
  const { data: taskTemplatesData, error: taskTemplatesDataError, isLoading } = useQuery(getTaskTemplatesUrl, {
    enabled: Boolean(activeTeam),
  });

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
        <title>Task manager</title>
      </Helmet>
      <Sidenav
        taskTemplates={taskTemplatesData}
        addTemplateInState={addTemplateInState}
        setActiveTeam={setActiveTeam}
        activeTeam={activeTeam}
      />
      <Switch>
        <Route exact path={match.path}>
          <Box maxWidth="24rem" margin="0 auto">
            <WombatMessage
              className={styles.wombat}
              title={`${activeTeam ? "Select a task or create one" : "Select a team"}`}
            />
          </Box>
        </Route>
        <Route path={AppPath.ManageTaskTemplateYaml}>
          <TaskTemplateYamlEditor
            editVerifiedTasksEnabled={editVerifiedTasksEnabled}
            taskTemplates={taskTemplatesData}
          />
        </Route>
        <Route path={AppPath.ManageTaskTemplateEdit}>
          <TaskTemplateOverview
            editVerifiedTasksEnabled={editVerifiedTasksEnabled}
            taskTemplates={taskTemplatesData}
            updateTemplateInState={updateTemplateInState}
          />
        </Route>
        <Redirect to={appLink.manageTaskTemplates({ teamId: activeTeam })} />
      </Switch>
    </div>
  );
};

export default TaskTemplatesContainer;
