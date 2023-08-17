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
import { useTeamContext } from "Hooks";
import { AppPath, appLink, FeatureFlag } from "Config/appConfig";
import { serviceUrl } from "Config/servicesConfig";
import styles from "../TaskManager.module.scss";

const HELMET_TITLE = "Team Task Manager";

function TaskTemplatesContainer() {
  const { team } = useTeamContext();
  const history = useHistory();
  const match = useRouteMatch();
  const editVerifiedTasksEnabled = useFeature(FeatureFlag.EditVerifiedTasksEnabled);
  const getTaskTemplatesUrl = serviceUrl.getTaskTemplates({
    query: queryString.stringify({ teams: team?.id, statuses: "active,inactive" }),
  });
  const {
    data: taskTemplatesData,
    error: taskTemplatesDataError,
    isLoading,
  } = useQuery(getTaskTemplatesUrl, {
    enabled: Boolean(team),
  });

  /** Check if there is an active team or redirect to home */
  if (!team) {
    return history.push(appLink.home());
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Helmet>
          <title>{HELMET_TITLE}</title>
        </Helmet>
        <Sidenav isLoading team={team} getTaskTemplatesUrl={getTaskTemplatesUrl} />
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
      <Sidenav team={team} taskTemplates={taskTemplatesData?.content} getTaskTemplatesUrl={getTaskTemplatesUrl} />
      <Switch>
        <Route exact path={match.path}>
          <Box maxWidth="24rem" margin="0 auto">
            <WombatMessage className={styles.wombat} title="Select a task or create one" />
          </Box>
        </Route>
        <Route path={AppPath.ManageTaskTemplateEditor} strict={true}>
          <TaskTemplateYamlEditor
            editVerifiedTasksEnabled={editVerifiedTasksEnabled}
            taskTemplates={taskTemplatesData?.content}
            getTaskTemplatesUrl={getTaskTemplatesUrl}
          />
        </Route>
        <Route path={AppPath.ManageTaskTemplateDetail} strict={true}>
          <TaskTemplateOverview
            editVerifiedTasksEnabled={editVerifiedTasksEnabled}
            taskTemplates={taskTemplatesData?.content}
            getTaskTemplatesUrl={getTaskTemplatesUrl}
          />
        </Route>
        <Redirect to={appLink.manageTaskTemplates({ teamId: team.id })} />
      </Switch>
    </div>
  );
}

export default TaskTemplatesContainer;
