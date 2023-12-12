import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useFeature } from "flagged";
import { useQuery, useAppContext } from "Hooks";
import { useQueryClient } from "react-query";
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
import { elevatedUserRoles, UserType } from "Constants";
import { AppPath, appLink, FeatureFlag } from "Config/appConfig";
import { serviceUrl } from "Config/servicesConfig";
import styles from "./taskTemplates.module.scss";

const TaskTemplatesContainer: React.FC = () => {
  const params: { teamId: string } = useParams();
  const { user, teams } = useAppContext();
  const { type: roleType } = user;
  const [activeTeam, setActiveTeam] = useState(params?.teamId ?? null);
  const match = useRouteMatch();
  const queryClient = useQueryClient();
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
    queryClient.setQueryData(getTaskTemplatesUrl, orderBy(updatedTemplatesData, "name", "asc"));
  };
  const updateTemplateInState = (updatedTemplate: TaskModel) => {
    const updatedTemplatesData = [...taskTemplatesData];
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

  const selectedTeam = teams.find((team) => team.id === activeTeam);
  const systemWorkflowsEnabled = elevatedUserRoles.includes(roleType);
  const canEditWorkflow =
    (selectedTeam?.userRoles && selectedTeam?.userRoles.indexOf(UserType.Operator) > -1) || systemWorkflowsEnabled;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Team Tasks</title>
      </Helmet>
      <Sidenav
        taskTemplates={taskTemplatesData}
        addTemplateInState={addTemplateInState}
        setActiveTeam={setActiveTeam}
        activeTeam={activeTeam}
        canEditWorkflow={canEditWorkflow}
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
            updateTemplateInState={updateTemplateInState}
            canEditWorkflow={canEditWorkflow}
          />
        </Route>
        <Route path={AppPath.ManageTaskTemplateEdit}>
          <TaskTemplateOverview
            editVerifiedTasksEnabled={editVerifiedTasksEnabled}
            taskTemplates={taskTemplatesData}
            updateTemplateInState={updateTemplateInState}
            canEditWorkflow={canEditWorkflow}
          />
        </Route>
        <Redirect to={appLink.manageTaskTemplates({ teamId: activeTeam })} />
      </Switch>
    </div>
  );
};

export default TaskTemplatesContainer;
