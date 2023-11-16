import React, { lazy, useState, Suspense, useMemo } from "react";
import axios from "axios";
import { FlagsProvider, useFeature } from "flagged";
import { AppContextProvider } from "State/context";
import { useQuery, useQueryClient } from "react-query";
import { Switch, Route, Redirect, useLocation, matchPath } from "react-router-dom";
import {
  DelayedRender,
  Error404,
  Loading,
  NotificationsContainer,
  ProtectedRoute,
} from "@boomerang-io/carbon-addons-boomerang-react";
import ErrorBoundary from "Components/ErrorBoundary";
import ErrorDragon from "Components/ErrorDragon";

import OnBoardExpContainer from "Features/Tutorial";
import Navbar from "./Navbar";
import UnsupportedBrowserPrompt from "./UnsupportedBrowserPrompt";
import { detect } from "detect-browser";
import queryString from "query-string";
import { elevatedUserRoles } from "Constants";
import { AppPath, FeatureFlag } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { FlowFeatures, FlowNavigationItem, FlowTeam, FlowUser, PlatformConfig, UserWorkflow } from "Types";
import { sortByProp } from "@boomerang-io/utils";
import styles from "./app.module.scss";

// import directly bc of webpack chunking error
import Schedules from "Features/Schedules";
const AppActivation = lazy(() => import(/* webpackChunkName: "App Activation" */ "./AppActivation"));
// const Activity = lazy(() => import(/* webpackChunkName: "Activity" */ "Features/Activity"));
const Actions = lazy(() => import(/* webpackChunkName: "Actions" */ "Features/Actions"));
const ApproverGroups = lazy(() => import(/* webpackChunkName: "ApproverGroups" */ "Features/ApproverGroups"));
const Editor = lazy(() => import(/* webpackChunkName: "Editor" */ "Features/Editor"));
const Execution = lazy(() => import(/* webpackChunkName: "Execution" */ "Features/Execution"));
const GlobalProperties = lazy(() => import(/* webpackChunkName: "GlobalProperties" */ "Features/GlobalProperties"));
const Tokens = lazy(() => import(/* webpackChunkName: "Tokens" */ "Features/Tokens"));
const Insights = lazy(() => import(/* webpackChunkName: "Insights" */ "Features/Insights"));
const Quotas = lazy(() => import(/* webpackChunkName: "Quotas" */ "Features/Quotas"));
//const Schedules = lazy(() => import(/* webpackChunkName: "Schedules" */ "Features/Schedules"));
const Settings = lazy(() => import(/* webpackChunkName: "Settings" */ "Features/Settings"));
const SystemWorkflows = lazy(() => import(/* webpackChunkName: "SystemWorkflows" */ "Features/SystemWorkflows"));
const TaskTemplates = lazy(() => import(/* webpackChunkName: "TaskTemplates" */ "Features/TaskTemplates"));
const Teams = lazy(() => import(/* webpackChunkName: "Teams" */ "Features/Teams"));
const TeamProperties = lazy(() => import(/* webpackChunkName: "TeamProperties" */ "Features/TeamProperties"));
const TeamTokens = lazy(() => import(/* webpackChunkName: "TeamTokens" */ "Features/TeamTokens"));
const ManageTeamTasks = lazy(() => import(/* webpackChunkName: "ManageTeamTasks" */ "Features/ManageTeamTasks"));
const ManageTeamTasksContainer = lazy(() =>
  import(/* webpackChunkName: "ManageTeamTasksContainer" */ "Features/ManageTeamTasksContainer")
);
const Users = lazy(() => import(/* webpackChunkName: "TeamProperties" */ "Features/Users"));
const Workflows = lazy(() => import(/* webpackChunkName: "Workflows" */ "Features/Workflows"));

const getUserUrl = serviceUrl.getUserProfile();
const getPlatformConfigUrl = serviceUrl.getPlatformConfig();
const getTeamsUrl = serviceUrl.getTeams();
const getUserWorkflows = serviceUrl.getUserWorkflows();
const featureFlagsUrl = serviceUrl.getFeatureFlags();
const browser = detect();
const supportedBrowsers = ["chrome", "firefox", "safari", "edge"];

export interface ManageTaskTemplatesTeamParams {
  teamId: string;
}

export default function App() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const getTeamIdFromURL = () => {
    let teamIds = queryString.parse(location.search).teams;
    if (teamIds === "" || teamIds === undefined || teamIds === null) {
      const templateMatch = matchPath<ManageTaskTemplatesTeamParams>(location.pathname, {
        path: AppPath.ManageTaskTemplatesTeam,
      });
      teamIds = templateMatch?.params?.teamId ? templateMatch?.params?.teamId : null;
    }
    return teamIds;
  };

  const teamIds = getTeamIdFromURL();
  const teamIdsArray = teamIds === null || teamIds === undefined ? [] : teamIds.toString().split(",");
  const query = teamIdsArray.length > 0 ? `?teamId=${teamIdsArray[0]}` : "";
  const getFlowNavigationUrl = serviceUrl.getFlowNavigation({ query });
  const [shouldShowBrowserWarning, setShouldShowBrowserWarning] = useState(
    !supportedBrowsers.includes(browser?.name ?? "")
  );
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [showActivatePlatform, setShowActivatePlatform] = React.useState(false);
  const [activationCode, setActivationCode] = React.useState<string>();

  const fetchUserResolver = async () => {
    try {
      const response = await axios.get(getUserUrl);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error))
        if (error.response?.status === 423) {
          // Prevent both the rerender and remount on refetch
          if (!showActivatePlatform && !activationCode) {
            setShowActivatePlatform(true);
          }
          return {};
        }
    }
  };

  const featureQuery = useQuery<FlowFeatures, string>({
    queryKey: featureFlagsUrl,
    queryFn: resolver.query(featureFlagsUrl),
  });

  const userQuery = useQuery<FlowUser, string>({
    queryKey: getUserUrl,
    queryFn: fetchUserResolver,
  });

  const navigationQuery = useQuery<PlatformConfig, string>({
    queryKey: getPlatformConfigUrl,
    queryFn: resolver.query(getPlatformConfigUrl),
    enabled: Boolean(userQuery.data?.id),
  });

  const flowNavigationQuery = useQuery<Array<FlowNavigationItem>, string>({
    queryKey: getFlowNavigationUrl,
    queryFn: resolver.query(getFlowNavigationUrl),
    enabled: Boolean(userQuery.data?.id),
  });

  const teamsQuery = useQuery<Array<FlowTeam>, string>({
    queryKey: getTeamsUrl,
    queryFn: resolver.query(getTeamsUrl),
    enabled: Boolean(userQuery.data?.id),
  });

  const userWorkflowsQuery = useQuery<UserWorkflow, string>({
    queryKey: getUserWorkflows,
    queryFn: resolver.query(getUserWorkflows),
    enabled: Boolean(userQuery.data?.id),
  });

  const isLoading =
    userQuery.isLoading ||
    navigationQuery.isLoading ||
    teamsQuery.isLoading ||
    featureQuery.isLoading ||
    flowNavigationQuery.isLoading ||
    userWorkflowsQuery.isLoading;

  const hasError =
    userQuery.isError ||
    navigationQuery.isError ||
    teamsQuery.isError ||
    featureQuery.isError ||
    flowNavigationQuery.isError ||
    userWorkflowsQuery.isError;

  const teamsData = teamsQuery.data;
  const memoizedFormattedTeams = useMemo(() => {
    if (Array.isArray(teamsData) && teamsData.length > 0) {
      return sortByProp(
        teamsData.map((team) => ({ ...team, label: team.name, value: team.id })),
        (team: any) => team.name?.toLowerCase()
      );
    } else {
      return teamsData;
    }
  }, [teamsData]);

  const handleSetActivationCode = (code: string) => {
    setActivationCode(code);
    setShowActivatePlatform(false);
    queryClient.invalidateQueries(getUserUrl);
  };

  if (isLoading) {
    return (
      <DelayedRender>
        <Loading />
      </DelayedRender>
    );
  }

  if (hasError) {
    return <ErrorDragon style={{ margin: "5rem 0" }} />;
  }

  if (showActivatePlatform) {
    return (
      <Suspense fallback={() => <DelayedRender>{null}</DelayedRender>}>
        <div className={styles.appActivationContainer}>
          <AppActivation setActivationCode={handleSetActivationCode} />
        </div>
      </Suspense>
    );
  }

  if (
    userQuery.data &&
    navigationQuery.data &&
    memoizedFormattedTeams &&
    featureQuery.data &&
    flowNavigationQuery.data &&
    userWorkflowsQuery.data
  ) {
    const feature = featureQuery.data.features;
    return (
      <FlagsProvider
        features={{
          ActivityEnabled: feature["activity"],
          EditVerifiedTasksEnabled: feature["enable.verified.tasks.edit"],
          GlobalParametersEnabled: feature["global.parameters"],
          InsightsEnabled: feature["insights"],
          TeamManagementEnabled: feature["team.management"],
          TeamParametersEnabled: feature["team.parameters"],
          TeamTasksEnabled: feature["team.tasks"],
          UserManagementEnabled: feature["user.management"],
          WorkflowQuotasEnabled: feature["workflow.quotas"],
          WorkflowTokensEnabled: feature["workflow.tokens"],
          WorkflowTriggersEnabled: feature["workflow.triggers"],
        }}
      >
        <Navbar
          handleOnTutorialClick={() => setIsTutorialActive(true)}
          platformConfigData={navigationQuery.data}
          flowNavigationData={flowNavigationQuery.data}
          userData={userQuery.data}
        />
        <OnBoardExpContainer isTutorialActive={isTutorialActive} setIsTutorialActive={setIsTutorialActive} />
        <ErrorBoundary>
          <Main
            isTutorialActive={isTutorialActive}
            platformConfigData={navigationQuery.data}
            setIsTutorialActive={setIsTutorialActive}
            setShouldShowBrowserWarning={setShouldShowBrowserWarning}
            shouldShowBrowserWarning={shouldShowBrowserWarning}
            teamsData={memoizedFormattedTeams}
            userData={userQuery.data}
            userWorkflowsData={userWorkflowsQuery.data}
            quotas={featureQuery.data.quotas}
          />
        </ErrorBoundary>
      </FlagsProvider>
    );
  }
  return null;
}

interface MainProps {
  isTutorialActive: boolean;
  platformConfigData: PlatformConfig;
  setIsTutorialActive: (isTutorialActive: boolean) => void;
  setShouldShowBrowserWarning: (shouldShowBrowserWarning: boolean) => void;
  shouldShowBrowserWarning: boolean;
  teamsData: Array<FlowTeam>;
  userData: FlowUser;
  quotas: FlowFeatures["quotas"];
  userWorkflowsData: UserWorkflow;
}

function Main({
  isTutorialActive,
  platformConfigData,
  setIsTutorialActive,
  setShouldShowBrowserWarning,
  shouldShowBrowserWarning,
  teamsData,
  userData,
  userWorkflowsData,
  quotas,
}: MainProps) {
  const { id: userId, type: platformRole } = userData;

  // Don't show anything to a user that doesn't exist, the UIShell will show the redirect
  if (!userId) {
    return null;
  }

  if (shouldShowBrowserWarning) {
    return <UnsupportedBrowserPrompt onDismissWarning={() => setShouldShowBrowserWarning(false)} />;
  }

  return (
    <AppContextProvider
      value={{
        isTutorialActive,
        communityUrl: platformConfigData?.platform?.communityUrl ?? "",
        setIsTutorialActive,
        user: userData,
        teams: teamsData,
        userWorkflows: userWorkflowsData,
        quotas,
      }}
    >
      <AppFeatures platformRole={platformRole} />
    </AppContextProvider>
  );
}

interface AppFeaturesProps {
  platformRole: string;
}

const AppFeatures = React.memo(function AppFeatures({ platformRole }: AppFeaturesProps) {
  const activityEnabled = useFeature(FeatureFlag.ActivityEnabled);
  const insightsEnabled = useFeature(FeatureFlag.InsightsEnabled);
  const teamPropertiesEnabled = useFeature(FeatureFlag.TeamParametersEnabled);
  const teamTasksEnabled = useFeature(FeatureFlag.TeamTasksEnabled);

  return (
    <main id="content" className={styles.container}>
      <Suspense
        fallback={
          <DelayedRender>
            <Loading />
          </DelayedRender>
        }
      >
        <Switch>
          <ProtectedRoute
            allowedUserRoles={["*"]}
            component={<Execution />}
            path={AppPath.Execution}
            userRole={activityEnabled ? "*" : ""}
          />
          <Redirect exact from={AppPath.Activity} to={AppPath.Workflows} />
          {/* <ProtectedRoute
            allowedUserRoles={["*"]}
            component={<Activity />}
            path={AppPath.Activity}
            userRole={activityEnabled ? "*" : ""}
          /> */}
          <ProtectedRoute
            allowedUserRoles={elevatedUserRoles}
            component={<GlobalProperties />}
            path={AppPath.Properties}
            userRole={platformRole}
          />
          <ProtectedRoute
            allowedUserRoles={["*"]}
            component={<Insights />}
            path={AppPath.Insights}
            userRole={insightsEnabled ? "*" : "none"}
          />
          <ProtectedRoute
            allowedUserRoles={["*"]}
            component={<ManageTeamTasks />}
            path={AppPath.ManageTaskTemplatesTeam}
            userRole={teamTasksEnabled ? "*" : ""}
          />
          <ProtectedRoute
            allowedUserRoles={["*"]}
            component={<ManageTeamTasksContainer />}
            path={AppPath.ManageTaskTemplates}
            userRole={teamTasksEnabled ? "*" : ""}
          />
          <ProtectedRoute
            allowedUserRoles={elevatedUserRoles}
            component={<Quotas />}
            path={AppPath.Quotas}
            userRole={platformRole}
          />
          <ProtectedRoute
            allowedUserRoles={elevatedUserRoles}
            component={<Settings />}
            path={AppPath.Settings}
            userRole={platformRole}
          />
          <ProtectedRoute
            allowedUserRoles={elevatedUserRoles}
            component={<SystemWorkflows />}
            path={AppPath.SystemWorkflows}
            userRole={platformRole}
          />
          <ProtectedRoute
            allowedUserRoles={elevatedUserRoles}
            component={<TaskTemplates />}
            path={AppPath.TaskTemplates}
            userRole={platformRole}
          />
          <ProtectedRoute
            allowedUserRoles={["*"]}
            component={<TeamProperties />}
            path={AppPath.TeamProperties}
            userRole={teamPropertiesEnabled ? "*" : ""}
          />
          {/* {<ProtectedRoute
            allowedUserRoles={["*"]}
            component={<TeamTokens />}
            path={AppPath.TeamTokens}
            userRole={teamTokensEnabled}
          />} */}
          <ProtectedRoute
            allowedUserRoles={elevatedUserRoles}
            component={<Tokens />}
            path={AppPath.Tokens}
            userRole={platformRole}
          />
          <Route path={AppPath.Actions}>
            <Actions />
          </Route>
          <Route path={AppPath.Editor}>
            <Editor />
          </Route>
          <Route path={AppPath.Schedules}>
            <Schedules />
          </Route>
          <Route path={AppPath.TeamList}>
            <Teams />
          </Route>
          <Route path={AppPath.TeamApprovers}>
            <ApproverGroups />
          </Route>
          <Route path={AppPath.TeamTokens}>
            <TeamTokens />
          </Route>
          <Route path={AppPath.UserList}>
            <Users />
          </Route>
          <Route path={AppPath.Workflows}>
            <Workflows />
          </Route>
          <Redirect exact from="/" to={AppPath.Workflows} />
          <Route path="*" component={() => <Error404 theme="boomerang" />} />
        </Switch>
      </Suspense>
      <NotificationsContainer enableMultiContainer />
    </main>
  );
});
