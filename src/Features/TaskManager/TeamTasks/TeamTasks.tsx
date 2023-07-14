import React from "react";
import { Helmet } from "react-helmet";
import { useFeature } from "flagged";
import { useQuery } from "Hooks";
import { Route, Switch, useRouteMatch, Redirect } from "react-router-dom";
import { Box } from "reflexbox";
import queryString from "query-string";
import ErrorDragon from "Components/ErrorDragon";
import { useHistory } from "react-router-dom";
import WombatMessage from "Components/WombatMessage";
import Sidenav from "../Sidenav";
import TaskTemplateOverview from "../TaskTemplateOverview";
import TaskTemplateYamlEditor from "../TaskTemplateEditor";
import { groupTaskTemplatesByName } from "Utils";
import { useAppContext } from "Hooks";
import { AppPath, appLink, FeatureFlag } from "Config/appConfig";
import { serviceUrl } from "Config/servicesConfig";
import styles from "../TaskManager.module.scss";

const HELMET_TITLE = "Team Task Manager";

function TaskTemplatesContainer() {
  const { activeTeam } = useAppContext();
  const history = useHistory();
  const match = useRouteMatch();
  const editVerifiedTasksEnabled = useFeature(FeatureFlag.EditVerifiedTasksEnabled);
  const getTaskTemplatesUrl = activeTeam
    ? serviceUrl.getTaskTemplates({
      query: queryString.stringify({ teams: activeTeam?.id, statuses: "active,inactive" }),
    })
    : serviceUrl.getTaskTemplates({
      query: queryString.stringify({ statuses: "active,inactive" }),
    });
  const {
    data: taskTemplatesData,
    error: taskTemplatesDataError,
    isLoading,
  } = useQuery(getTaskTemplatesUrl, {
    enabled: Boolean(activeTeam),
  });

  /** Check if there is an active team or redirect to home */
  if (!activeTeam) {
    return history.push(appLink.home());
  }

  // Collect the tasks by name and array of sorted by version task templates
  const taskTemplatesByName = groupTaskTemplatesByName(taskTemplatesData?.content)

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Helmet>
          <title>{HELMET_TITLE}</title>
        </Helmet>
        <Sidenav
          isLoading
          team={activeTeam}
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
          <title>{HELMET_TITLE}</title>
        </Helmet>
        <ErrorDragon />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Helmet>
        <title>{HELMET_TITLE}</title>
      </Helmet>
      <Sidenav team={activeTeam} taskTemplates={taskTemplatesByName} getTaskTemplatesUrl={getTaskTemplatesUrl} />
      <Switch>
        <Route exact path={match.path}>
          <Box maxWidth="24rem" margin="0 auto">
            <WombatMessage className={styles.wombat} title="Select a task or create one" />
          </Box>
        </Route>
        <Route path={AppPath.ManageTaskTemplateEditor} strict={true}>
          <TaskTemplateYamlEditor
            editVerifiedTasksEnabled={editVerifiedTasksEnabled}
            taskTemplates={taskTemplatesByName}
            getTaskTemplatesUrl={getTaskTemplatesUrl}
          />
        </Route>
        <Route path={AppPath.ManageTaskTemplateDetail} strict={true}>
          <TaskTemplateOverview
            editVerifiedTasksEnabled={editVerifiedTasksEnabled}
            taskTemplates={taskTemplatesByName}
            getTaskTemplatesUrl={getTaskTemplatesUrl}
          />
        </Route>
        <Redirect to={appLink.manageTaskTemplates({ teamId: activeTeam.id })} />
      </Switch>
    </div>
  );
}

export default TaskTemplatesContainer;
