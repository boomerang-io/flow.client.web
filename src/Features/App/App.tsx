import React, { lazy, useState, Suspense } from "react";
import axios from "axios";
import { FlagsProvider, useFeature } from "flagged";
import { AppContextProvider } from "State/context";
import { useQuery, useQueryClient } from "react-query";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
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
import { sortBy } from "lodash";
import { elevatedUserRoles } from "Constants";
import { AppPath, FeatureFlag } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { FlowFeatures, FlowNavigationItem, FlowTeam, FlowUser, PlatformConfig, PaginatedTeamResponse } from "Types";
import styles from "./app.module.scss";

const AppActivation = lazy(() => import("./AppActivation"));
const Activity = lazy(() => import("Features/Activity"));
const Actions = lazy(() => import("Features/Actions"));
const ApproverGroups = lazy(() => import("Features/ApproverGroups"));
const Editor = lazy(() => import("Features/Editor"));
const Execution = lazy(() => import("Features/Execution"));
const GlobalProperties = lazy(() => import("Features/GlobalProperties"));
const Tokens = lazy(() => import("Features/Tokens"));
const Insights = lazy(() => import("Features/Insights"));
const Schedules = lazy(() => import("Features/Schedules"));
const Settings = lazy(() => import("Features/Settings"));
const TemplateWorkflows = lazy(() => import("Features/TemplateWorkflows"));
const TaskTemplates = lazy(() => import("Features/TaskTemplates"));
const Teams = lazy(() => import("Features/Teams"));
const TeamProperties = lazy(() => import("Features/TeamProperties"));
const TeamTokens = lazy(() => import("Features/TeamTokens"));
const ManageTeamTasks = lazy(() => import("Features/ManageTeamTasks"));
const TaskTemplatesContainer = lazy(() => import("Features/ManageTeamTasks"));
const Users = lazy(() => import("Features/Users"));
const Workflows = lazy(() => import("Features/Workflows"));
const Home = lazy(() => import("Features/Home"));

const getUserUrl = serviceUrl.getUserProfile();
const getContextUrl = serviceUrl.getContext();
const getTeamsUrl = serviceUrl.getMyTeams({ query: "statuses=active" });
const featureFlagsUrl = serviceUrl.getFeatureFlags();
const browser = detect();
const supportedBrowsers = ["chrome", "firefox", "safari", "edge"];

export default function App() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const teamId =
    location.pathname.startsWith("/home") || location.pathname.startsWith("/admin")
      ? null
      : location.pathname.split("/").filter(Boolean)[0];
  const query = teamId ? `?teamId=${teamId}` : "";
  const getNavigationUrl = serviceUrl.getNavigation({ query });

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

  const contextQuery = useQuery<PlatformConfig, string>({
    queryKey: getContextUrl,
    queryFn: resolver.query(getContextUrl),
    enabled: Boolean(userQuery.data?.id),
  });

  const navigationQuery = useQuery<Array<FlowNavigationItem>, string>({
    queryKey: getNavigationUrl,
    queryFn: resolver.query(getNavigationUrl),
    enabled: Boolean(userQuery.data?.id),
  });

  const teamsQuery = useQuery<PaginatedTeamResponse, string>({
    queryKey: getTeamsUrl,
    queryFn: resolver.query(getTeamsUrl),
    enabled: Boolean(userQuery.data?.id),
  });

  const isLoading =
    userQuery.isLoading ||
    contextQuery.isLoading ||
    teamsQuery.isLoading ||
    featureQuery.isLoading ||
    navigationQuery.isLoading;

  const hasError =
    userQuery.isError || contextQuery.isError || teamsQuery.isError || featureQuery.isError || navigationQuery.isError;

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

  // Check if the app is Activated
  if (showActivatePlatform) {
    return (
      <Suspense fallback={() => <DelayedRender>{null}</DelayedRender>}>
        <div className={styles.appActivationContainer}>
          <AppActivation setActivationCode={handleSetActivationCode} />
        </div>
      </Suspense>
    );
  }

  // Context Data needed for the app to render
  if (userQuery.data && contextQuery.data && teamsQuery.data && featureQuery.data && navigationQuery.data) {
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
          flowNavigationData={navigationQuery.data}
          handleOnTutorialClick={() => setIsTutorialActive(true)}
          platformConfigData={contextQuery.data}
          userData={userQuery.data}
        />
        <OnBoardExpContainer isTutorialActive={isTutorialActive} setIsTutorialActive={setIsTutorialActive} />
        <ErrorBoundary>
          <Main
            isTutorialActive={isTutorialActive}
            platformConfigData={contextQuery.data}
            setIsTutorialActive={setIsTutorialActive}
            setShouldShowBrowserWarning={setShouldShowBrowserWarning}
            shouldShowBrowserWarning={shouldShowBrowserWarning}
            teamsData={teamsQuery.data.content}
            userData={userQuery.data}
            quotas={featureQuery.data.quotas}
            activeTeamId={teamId}
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
  activeTeamId: string | null;
}

function Main({
  isTutorialActive,
  platformConfigData,
  setIsTutorialActive,
  setShouldShowBrowserWarning,
  shouldShowBrowserWarning,
  teamsData,
  userData,
  quotas,
  activeTeamId,
}: MainProps) {
  const { id: userId, type: platformRole } = userData;

  // Don't show anything to a user that doesn't exist, the UIShell will show the redirect
  if (!userId) {
    return null;
  }

  if (shouldShowBrowserWarning) {
    return <UnsupportedBrowserPrompt onDismissWarning={() => setShouldShowBrowserWarning(false)} />;
  }
  let activeTeam = teamsData.find((team) => team.id === activeTeamId);

  return (
    <AppContextProvider
      value={{
        activeTeam,
        isTutorialActive,
        setIsTutorialActive,
        quotas,
        communityUrl: platformConfigData?.platform?.communityUrl ?? "",
        teams: sortBy(teamsData, "name"),
        user: userData,
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
          <Route path={"/home"}>
            <Home />
          </Route>
          <Route path={"/admin"}>
            <Switch>
              <ProtectedRoute
                allowedUserRoles={elevatedUserRoles}
                component={() => <Settings />}
                path={AppPath.Settings}
                userRole={platformRole}
              />
              <ProtectedRoute
                allowedUserRoles={elevatedUserRoles}
                component={() => <GlobalProperties />}
                path={AppPath.Properties}
                userRole={platformRole}
              />
              <ProtectedRoute
                allowedUserRoles={elevatedUserRoles}
                component={() => <TemplateWorkflows />}
                path={AppPath.TemplateWorkflows}
                userRole={platformRole}
              />
              <ProtectedRoute
                allowedUserRoles={elevatedUserRoles}
                component={() => <TaskTemplates />}
                path={AppPath.TaskTemplates}
                userRole={platformRole}
              />
              <ProtectedRoute
                allowedUserRoles={elevatedUserRoles}
                component={<Tokens />}
                path={AppPath.Tokens}
                userRole={platformRole}
              />
              <Route path={AppPath.TeamList}>
                <Teams />
              </Route>
              <Route path={AppPath.UserList}>
                <Users />
              </Route>
            </Switch>
          </Route>
          <Route path={"/:teamId"}>
            <Switch>
              <ProtectedRoute
                allowedUserRoles={["*"]}
                component={() => <Execution />}
                path={AppPath.Execution}
                userRole={activityEnabled ? "*" : ""}
              />
              <ProtectedRoute
                allowedUserRoles={["*"]}
                component={() => <Activity />}
                path={AppPath.Activity}
                userRole={activityEnabled ? "*" : ""}
              />
              <ProtectedRoute
                allowedUserRoles={["*"]}
                component={() => <Insights />}
                path={AppPath.Insights}
                userRole={insightsEnabled ? "*" : "none"}
              />
              <ProtectedRoute
                allowedUserRoles={["*"]}
                component={() => <ManageTeamTasks />}
                path={AppPath.ManageTaskTemplatesTeam}
                userRole={teamTasksEnabled ? "*" : ""}
              />
              <ProtectedRoute
                allowedUserRoles={["*"]}
                component={() => <TaskTemplatesContainer />}
                path={AppPath.ManageTaskTemplates}
                userRole={teamTasksEnabled ? "*" : ""}
              />
              <ProtectedRoute
                allowedUserRoles={["*"]}
                component={() => <TeamProperties />}
                path={AppPath.TeamProperties}
                userRole={teamPropertiesEnabled ? "*" : ""}
              />
              <Route path={AppPath.TeamApprovers}>
                <ApproverGroups />
              </Route>
              <Route path={AppPath.TeamTokens}>
                <TeamTokens />
              </Route>
              {/* {<ProtectedRoute
            allowedUserRoles={["*"]}
            component={<TeamTokens />}
            path={AppPath.TeamTokens}
            userRole={teamTokensEnabled}
          />} */}
              <Route path={AppPath.Actions}>
                <Actions />
              </Route>
              <Route path={AppPath.Editor}>
                <Editor />
              </Route>
              <Route path={AppPath.Schedules}>
                <Schedules />
              </Route>
              <Route path={AppPath.Workflows}>
                <Workflows />
              </Route>
              <Redirect exact from="/" to={AppPath.Workflows} />
              <Route path="*" component={() => <Error404 theme="boomerang" />} />
            </Switch>
          </Route>
          <Redirect to="/home" />
        </Switch>
      </Suspense>
      <NotificationsContainer enableMultiContainer />
    </main>
  );
});
