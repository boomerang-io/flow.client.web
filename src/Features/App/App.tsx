import React, { lazy, useState, Suspense } from "react";
import axios from "axios";
import { FlagsProvider } from "flagged";
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
import { AppPath, PRODUCT_STANDALONE } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { stringToBooleanHelper } from "Utils/stringHelper";
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
const TaskTemplates = lazy(() => import(/* webpackChunkName: "TaskTemplates" */ "Features/TaskTemplates"));
const Teams = lazy(() => import(/* webpackChunkName: "Teams" */ "Features/Teams"));
const TeamProperties = lazy(() => import(/* webpackChunkName: "TeamProperties" */ "Features/TeamProperties"));
const Users = lazy(() => import(/* webpackChunkName: "TeamProperties" */ "Features/Users"));
const Workflows = lazy(() => import(/* webpackChunkName: "Workflows" */ "Features/Workflows"));

const getUserUrl = serviceUrl.getUserProfile();
const getNavigationUrl = serviceUrl.getNavigation();
const getTeamsUrl = serviceUrl.getTeams();
const platformSettingsUrl = serviceUrl.resourceSettings();
const browser = detect();
const allowedUserRoles = [UserType.Admin, UserType.Operator];
const supportedBrowsers = ["chrome", "firefox", "safari", "edge"];
const settingsWorkersName = "Workers";

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

  const settingsQuery = useQuery({
    queryKey: platformSettingsUrl,
    queryFn: resolver.query(platformSettingsUrl),
    config: {
      enabled: Boolean(userQuery.data?.id),
    },
  });

  const isLoading = userQuery.isLoading || navigationQuery.isLoading || teamsQuery.isLoading || settingsQuery.isLoading;
  const hasError = userQuery.isError || navigationQuery.isError || teamsQuery.isError || settingsQuery.isError;
  const hasData = userQuery.data && navigationQuery.data && teamsQuery.data && settingsQuery.data;

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
    const editVerifiedTasksEnabled = stringToBooleanHelper(
      settingsQuery.data
        .find((arr: any) => arr.name === settingsWorkersName)
        ?.config?.find((setting: { key: string }) => setting.key === "enable.tasks").value ?? false
    );
    console.log("editVerifiedTasksEnabled");

    console.log(editVerifiedTasksEnabled);
    return (
      <FlagsProvider features={{ standalone: PRODUCT_STANDALONE, editVerifiedTasksEnabled }}>
        <Navbar
          handleOnTutorialClick={() => setIsTutorialActive(true)}
          navigationData={navigationQuery.data}
          userData={userQuery.data}
        />
        <OnBoardExpContainer isTutorialActive={isTutorialActive} setIsTutorialActive={setIsTutorialActive} />
        <ErrorBoundary>
          <Main
            isStandaloneMode={PRODUCT_STANDALONE}
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
  isStandaloneMode: boolean;
  isTutorialActive: boolean;
  setIsTutorialActive: (isTutorialActive: boolean) => void;
  setShouldShowBrowserWarning: (shouldShowBrowserWarning: boolean) => void;
  shouldShowBrowserWarning: boolean;
  teamsData: Array<FlowTeam>;
  userData: FlowUser;
}

function Main({
  isStandaloneMode,
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
      <AppFeatures isStandaloneMode={isStandaloneMode} platformRole={platformRole} />
    </AppContextProvider>
  );
}

interface AppFeaturesProps {
  isStandaloneMode: boolean;
  platformRole: string;
}

const AppFeatures = React.memo(function AppFeatures({ isStandaloneMode, platformRole }: AppFeaturesProps) {
  return (
    <main id="content" className={styles.container}>
      <Suspense fallback={<Loading />}>
        <Switch>
          <ProtectedRoute
            allowedUserRoles={allowedUserRoles}
            component={<GlobalProperties />}
            path={AppPath.Properties}
            userRole={platformRole}
          />
          <ProtectedRoute
            allowedUserRoles={allowedUserRoles}
            component={<TeamProperties />}
            path={AppPath.TeamProperties}
            userRole={platformRole}
          />
          <ProtectedRoute
            allowedUserRoles={allowedUserRoles}
            component={<TaskTemplates />}
            path={AppPath.TaskTemplates}
            userRole={platformRole}
          />
          <ProtectedRoute
            allowedUserRoles={allowedUserRoles}
            component={<Quotas />}
            path={AppPath.Quotas}
            userRole={platformRole}
          />
          <ProtectedRoute
            allowedUserRoles={allowedUserRoles}
            component={<Settings />}
            path={AppPath.Settings}
            userRole={platformRole}
          />
          {isStandaloneMode && (
            <ProtectedRoute
              allowedUserRoles={allowedUserRoles}
              component={<Teams />}
              path={AppPath.TeamList}
              userRole={platformRole}
            />
          )}
          {isStandaloneMode && (
            <ProtectedRoute
              allowedUserRoles={allowedUserRoles}
              component={<Users />}
              path={AppPath.UserList}
              userRole={platformRole}
            />
          )}
          <Route path={AppPath.Execution}>
            <Execution />
          </Route>
          <Route path={AppPath.Activity}>
            <Activity />
          </Route>
          <Route path={AppPath.Editor}>
            <Editor />
          </Route>
          <Route path={AppPath.Insights}>
            <Insights />
          </Route>
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
