import React, { lazy, useState, Suspense } from "react";
import axios from "axios";
import { FlagsProvider, useFeature } from "flagged";
import { AppContextProvider } from "State/context";
import { useQuery } from "react-query";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { Error404, Loading, NotificationsContainer, ProtectedRoute } from "@boomerang-io/carbon-addons-boomerang-react";
import ErrorBoundary from "Components/ErrorBoundary";
import ErrorDragon from "Components/ErrorDragon";
import OnBoardExpContainer from "Features/Tutorial";
import Navbar from "./Navbar";
import UnsupportedBrowserPrompt from "./UnsupportedBrowserPrompt";
import { detect } from "detect-browser";
import queryString from "query-string";
import { allowedUserRoles } from "Constants";
import { AppPath, FeatureFlag } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { FlowTeam, FlowUser } from "Types";
import styles from "./app.module.scss";

const AppActivation = lazy(() => import(/* webpackChunkName: "App Activation" */ "./AppActivation"));
const Activity = lazy(() => import(/* webpackChunkName: "Activity" */ "Features/Activity"));
const Editor = lazy(() => import(/* webpackChunkName: "Editor" */ "Features/Editor"));
const Execution = lazy(() => import(/* webpackChunkName: "Execution" */ "Features/Execution"));
const GlobalProperties = lazy(() => import(/* webpackChunkName: "GlobalProperties" */ "Features/GlobalProperties"));
const Insights = lazy(() => import(/* webpackChunkName: "Insights" */ "Features/Insights"));
const Quotas = lazy(() => import(/* webpackChunkName: "Quotas" */ "Features/Quotas"));
const Settings = lazy(() => import(/* webpackChunkName: "Settings" */ "Features/Settings"));
const SystemWorkflows = lazy(() => import(/* webpackChunkName: "SystemWorkflows" */ "Features/SystemWorkflows"));
const TaskTemplates = lazy(() => import(/* webpackChunkName: "TaskTemplates" */ "Features/TaskTemplates"));
const Teams = lazy(() => import(/* webpackChunkName: "Teams" */ "Features/Teams"));
const TeamProperties = lazy(() => import(/* webpackChunkName: "TeamProperties" */ "Features/TeamProperties"));
const Users = lazy(() => import(/* webpackChunkName: "TeamProperties" */ "Features/Users"));
const Workflows = lazy(() => import(/* webpackChunkName: "Workflows" */ "Features/Workflows"));

const getUserUrl = serviceUrl.getUserProfile();
const getPlatformNavigationUrl = serviceUrl.getPlatformNavigation();
const getTeamsUrl = serviceUrl.getTeams();
const browser = detect();
const supportedBrowsers = ["chrome", "firefox", "safari", "edge"];

export default function App() {
  const location = useLocation();
  const teamIds = queryString.parse(location.search).teams;
  const teamIdsArray = teamIds === null || teamIds === undefined ? [] : teamIds.toString().split(",");
  const query = teamIdsArray.length === 1 ? `?teamId=${teamIdsArray[0]}` : "";
  const getFlowNavigationUrl = serviceUrl.getFlowNavigation({query});

  const [shouldShowBrowserWarning, setShouldShowBrowserWarning] = useState(
    !supportedBrowsers.includes(browser?.name ?? "")
  );
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [showActivatePlatform, setShowActivatePlatform] = React.useState(false);
  const [activationCode, setActivationCode] = React.useState("");

  const fetchUserResolver = async () => {
    try {
      const response = await axios.get(getUserUrl);
      return response.data;
    } catch (error) {
      if (error.response?.status === 423) {
        // Prevent both the rerender and remount on refetch
        if (!showActivatePlatform && !activationCode) {
          setShowActivatePlatform(true);
        }
        return {};
      }
    }
  };

  const featureQuery = useQuery({
    queryKey: serviceUrl.getFeatureFlags(),
    queryFn: resolver.query(serviceUrl.getFeatureFlags()),
  });

  const userQuery = useQuery({
    queryKey: getUserUrl,
    queryFn: fetchUserResolver,
  });

  const navigationQuery = useQuery({
    queryKey: getPlatformNavigationUrl,
    queryFn: resolver.query(getPlatformNavigationUrl),
    config: {
      enabled: Boolean(userQuery.data?.id),
    },
  });

  const flowNavigationQuery = useQuery({
    queryKey: getFlowNavigationUrl,
    queryFn: resolver.query(getFlowNavigationUrl),
    config: {
      enabled: Boolean(userQuery.data?.id),
    },
  });

  const teamsQuery = useQuery({
    queryKey: getTeamsUrl,
    queryFn: resolver.query(getTeamsUrl),
    config: {
      enabled: Boolean(userQuery.data?.id),
    },
  });

  const isLoading =
    userQuery.isLoading ||
    navigationQuery.isLoading ||
    teamsQuery.isLoading ||
    featureQuery.isLoading ||
    flowNavigationQuery.isLoading;
  const hasError =
    userQuery.isError ||
    navigationQuery.isError ||
    teamsQuery.isError ||
    featureQuery.isError ||
    flowNavigationQuery.isError;
  const hasData =
    userQuery.data && navigationQuery.data && teamsQuery.data && featureQuery.data && flowNavigationQuery.data;

  const handleSetActivationCode = (code: string) => {
    setActivationCode(code);
    setShowActivatePlatform(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (hasError) {
    return <ErrorDragon style={{ margin: "5rem 0" }} />;
  }

  if (showActivatePlatform) {
    return (
      <Suspense fallback={<Loading />}>
        <div className={styles.appActivationContainer}>
          <AppActivation setActivationCode={handleSetActivationCode} />
        </div>
      </Suspense>
    );
  }

  if (hasData) {
    const feature = featureQuery.data?.features;

    return (
      <FlagsProvider
        features={{
          TeamManagementEnabled: feature["team.management"],
          WorkflowQuotasEnabled: feature["workflow.quotas"],
          SettingsEnabled: feature["settings"],
          UserManagementEnabled: feature["user.management"],
          GlobalParametersEnabled: feature["global.parameters"],
          WorkflowTokensEnabled: feature["workflow.tokens"],
          TaskManagerEnabled: feature["taskManager"],
          EditVerifiedTasksEnabled: feature["enable.verified.tasks.edit"],
          WorkflowTriggersEnabled: feature["workflow.triggers"],
          TeamParametersEnabled: feature["team.parameters"],

          ActivityEnabled: feature["activity"],
          InsightsEnabled: feature["insights"],
        }}
      >
        <Navbar
          handleOnTutorialClick={() => setIsTutorialActive(true)}
          platformNavigationData={navigationQuery.data}
          flowNavigationData={flowNavigationQuery.data}
          userData={userQuery.data}
        />
        <OnBoardExpContainer isTutorialActive={isTutorialActive} setIsTutorialActive={setIsTutorialActive} />
        <ErrorBoundary>
          <Main
            isTutorialActive={isTutorialActive}
            platformNavigationData={navigationQuery.data}
            setIsTutorialActive={setIsTutorialActive}
            setShouldShowBrowserWarning={setShouldShowBrowserWarning}
            shouldShowBrowserWarning={shouldShowBrowserWarning}
            teamsData={teamsQuery.data}
            userData={userQuery.data}
          />
        </ErrorBoundary>
      </FlagsProvider>
    );
  }
  return null;
}

interface MainProps {
  isTutorialActive: boolean;
  platformNavigationData: { platform: { communityUrl: string } };
  setIsTutorialActive: (isTutorialActive: boolean) => void;
  setShouldShowBrowserWarning: (shouldShowBrowserWarning: boolean) => void;
  shouldShowBrowserWarning: boolean;
  teamsData: Array<FlowTeam>;
  userData: FlowUser;
}

function Main({
  isTutorialActive,
  platformNavigationData,
  setIsTutorialActive,
  setShouldShowBrowserWarning,
  shouldShowBrowserWarning,
  teamsData,
  userData,
}: MainProps) {
  const { id: userId, type: platformRole }: { id: string; type: string } = userData;

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
        communityUrl: platformNavigationData?.platform?.communityUrl ?? "",
        setIsTutorialActive,
        user: userData,
        teams: teamsData,
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
  const globalPropertiesEnabled = useFeature(FeatureFlag.GlobalParametersEnabled);
  const teamPropertiesEnabled = useFeature(FeatureFlag.TeamParametersEnabled);
  const taskManagerEnabled = useFeature(FeatureFlag.TaskManagerEnabled);
  const workflowQuotasEnabled = useFeature(FeatureFlag.WorkflowQuotasEnabled);
  const settingsEnabled = useFeature(FeatureFlag.SettingsEnabled);
  const teamManagementEnabled = useFeature(FeatureFlag.TeamManagementEnabled);
  const userManagementEnabled = useFeature(FeatureFlag.UserManagementEnabled);
  const activityEnabled = useFeature(FeatureFlag.ActivityEnabled);
  const insightsEnabled = useFeature(FeatureFlag.InsightsEnabled);

  return (
    <main id="content" className={styles.container}>
      <Suspense fallback={<Loading />}>
        <Switch>
          <ProtectedRoute
            allowedUserRoles={[true]}
            component={<GlobalProperties />}
            path={AppPath.Properties}
            userRole={globalPropertiesEnabled}
          />

          <ProtectedRoute
            allowedUserRoles={[true]}
            component={<TeamProperties />}
            path={AppPath.TeamProperties}
            userRole={teamPropertiesEnabled}
          />

          <ProtectedRoute
            allowedUserRoles={[true]}
            component={<TaskTemplates />}
            path={AppPath.TaskTemplates}
            userRole={taskManagerEnabled}
          />

          <ProtectedRoute
            allowedUserRoles={[true]}
            component={<Quotas />}
            path={AppPath.Quotas}
            userRole={workflowQuotasEnabled}
          />

          <ProtectedRoute
            allowedUserRoles={[true]}
            component={<Settings />}
            path={AppPath.Settings}
            userRole={settingsEnabled}
          />

          <ProtectedRoute
            allowedUserRoles={[true]}
            component={<Teams />}
            path={AppPath.TeamList}
            userRole={teamManagementEnabled}
          />

          <ProtectedRoute
            allowedUserRoles={[true]}
            component={<Users />}
            path={AppPath.UserList}
            userRole={userManagementEnabled}
          />

          <ProtectedRoute
            allowedUserRoles={allowedUserRoles}
            component={<SystemWorkflows />}
            path={AppPath.SystemWorkflows}
            userRole={platformRole}
          />

          <ProtectedRoute
            allowedUserRoles={[true]}
            component={<Execution />}
            path={AppPath.Execution}
            userRole={activityEnabled}
          />

          <ProtectedRoute
            allowedUserRoles={[true]}
            component={<Activity />}
            path={AppPath.Activity}
            userRole={activityEnabled}
          />

          <Route path={AppPath.Editor}>
            <Editor />
          </Route>

          <ProtectedRoute
            allowedUserRoles={[true]}
            component={<Insights />}
            path={AppPath.Insights}
            userRole={insightsEnabled}
          />

          <Route path={AppPath.Workflows}>
            <Workflows />
          </Route>

          <Redirect exact from="/" to={AppPath.Workflows} />
          <Route path="*" component={Error404} />
        </Switch>
      </Suspense>
      <NotificationsContainer enableMultiContainer />
    </main>
  );
});
