import React, { lazy, useState, Suspense } from "react";
import axios from "axios";
import { FlagsProvider, useFeature, useFeatures } from "flagged";
import { AppContextProvider } from "State/context";
import { useQuery } from "react-query";
import { Switch, Route, Redirect } from "react-router-dom";
import { Error404, Loading, NotificationsContainer, ProtectedRoute } from "@boomerang-io/carbon-addons-boomerang-react";
import ErrorBoundary from "Components/ErrorBoundary";
import ErrorDragon from "Components/ErrorDragon";
import OnBoardExpContainer from "Features/Tutorial";
import Navbar from "./Navbar";
import UnsupportedBrowserPrompt from "./UnsupportedBrowserPrompt";
import { detect } from "detect-browser";
import { UserType } from "Constants";
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
const getNavigationUrl = serviceUrl.getNavigation();
const getTeamsUrl = serviceUrl.getTeams();
const browser = detect();
const allowedUserRoles = [UserType.Admin, UserType.Operator];
const supportedBrowsers = ["chrome", "firefox", "safari", "edge"];

export default function App() {
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
    queryKey: getNavigationUrl,
    queryFn: resolver.query(getNavigationUrl),
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

  const isLoading = userQuery.isLoading || navigationQuery.isLoading || teamsQuery.isLoading || featureQuery.isLoading;
  const hasError = userQuery.isError || navigationQuery.isError || teamsQuery.isError || featureQuery.isError;
  const hasData = userQuery.data && navigationQuery.data && teamsQuery.data && featureQuery.data;

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
    console.log(feature);
    console.log(feature["activity"]);
    return (
      <FlagsProvider
        features={{
          TeamManagementEnabled: feature["team.management"],
          WorkflowQuotasEnabled: feature["workflow.quotas"],
          SettingsEnabled: feature["settings"],
          UserManagementEnabled: feature["user.management"],
          GlobalPropertiesEnabled: feature["global.properties"],
          WorkflowTokensEnabled: feature["workflow.tokens"],
          TaskManagerEnabled: feature["taskManager"],
          EditVerifiedTasksEnabled: feature["enable.verified.tasks.edit"],
          WorkflowTriggersEnabled: feature["workflow.triggers"],
          TeamPropertiesEnabled: feature["team.properties"],

          ActivityEnabled: feature["activity"],
          InsightsEnabled: feature["insights"],
        }}
      >
        <Navbar
          handleOnTutorialClick={() => setIsTutorialActive(true)}
          navigationData={navigationQuery.data}
          userData={userQuery.data}
        />
        <OnBoardExpContainer isTutorialActive={isTutorialActive} setIsTutorialActive={setIsTutorialActive} />
        <ErrorBoundary>
          <Main
            isTutorialActive={isTutorialActive}
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
  setIsTutorialActive: (isTutorialActive: boolean) => void;
  setShouldShowBrowserWarning: (shouldShowBrowserWarning: boolean) => void;
  shouldShowBrowserWarning: boolean;
  teamsData: Array<FlowTeam>;
  userData: FlowUser;
}

function Main({
  isTutorialActive,
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
  const globalPropertiesEnabled = useFeature(FeatureFlag.GlobalPropertiesEnabled);
  const teamPropertiesEnabled = useFeature(FeatureFlag.TeamPropertiesEnabled);
  const taskManagerEnabled = useFeature(FeatureFlag.TaskManagerEnabled);
  const workflowQuotasEnabled = useFeature(FeatureFlag.WorkflowQuotasEnabled);
  const settingsEnabled = useFeature(FeatureFlag.SettingsEnabled);
  const teamManagementEnabled = useFeature(FeatureFlag.TeamManagementEnabled);
  const userManagementEnabled = useFeature(FeatureFlag.UserManagementEnabled);
  const activityEnabled = useFeature(FeatureFlag.ActivityEnabled);
  const insightsEnabled = useFeature(FeatureFlag.InsightsEnabled);

  console.log("ACTIVITY ENABLED");
  console.log(activityEnabled);
  console.log(useFeatures());

  return (
    <main id="content" className={styles.container}>
      <Suspense fallback={<Loading />}>
        <Switch>
          {globalPropertiesEnabled && (
            <ProtectedRoute
              allowedUserRoles={allowedUserRoles}
              component={<GlobalProperties />}
              path={AppPath.Properties}
              userRole={platformRole}
            />
          )}
          {teamPropertiesEnabled && (
            <ProtectedRoute
              allowedUserRoles={allowedUserRoles}
              component={<TeamProperties />}
              path={AppPath.TeamProperties}
              userRole={platformRole}
            />
          )}
          {taskManagerEnabled && (
            <ProtectedRoute
              allowedUserRoles={allowedUserRoles}
              component={<TaskTemplates />}
              path={AppPath.TaskTemplates}
              userRole={platformRole}
            />
          )}
          {workflowQuotasEnabled && (
            <ProtectedRoute
              allowedUserRoles={allowedUserRoles}
              component={<Quotas />}
              path={AppPath.Quotas}
              userRole={platformRole}
            />
          )}
          {settingsEnabled && (
            <ProtectedRoute
              allowedUserRoles={allowedUserRoles}
              component={<Settings />}
              path={AppPath.Settings}
              userRole={platformRole}
            />
          )}
          {teamManagementEnabled && (
            <ProtectedRoute
              allowedUserRoles={allowedUserRoles}
              component={<Teams />}
              path={AppPath.TeamList}
              userRole={platformRole}
            />
          )}
          {userManagementEnabled && (
            <ProtectedRoute
              allowedUserRoles={allowedUserRoles}
              component={<Users />}
              path={AppPath.UserList}
              userRole={platformRole}
            />
          )}

          <Route path={AppPath.SystemWorkflows}>
            <SystemWorkflows />
          </Route>

          <Route path={AppPath.Execution}>
            <Execution />
          </Route>

          {activityEnabled && (
            <Route path={AppPath.Activity}>
              <Activity />
            </Route>
          )}

          <Route path={AppPath.Editor}>
            <Editor />
          </Route>
          {insightsEnabled && (
            <Route path={AppPath.Insights}>
              <Insights />
            </Route>
          )}
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
