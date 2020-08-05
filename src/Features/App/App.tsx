import React, { lazy, useState, Suspense } from "react";
import axios from "axios";
import { FlagsProvider } from "flagged";
import { AppContextProvider } from "State/context";
import { useQuery } from "react-query";
import { useQuery as useSimpleQuery } from "Hooks";
import { Switch, Route, Redirect } from "react-router-dom";
import {
  Error404,
  Loading,
  NotificationsContainer,
  ProtectedRoute,
} from "@boomerang-io/carbon-addons-boomerang-react";
import ErrorBoundary from "Components/ErrorBoundary";
import ErrorDragon from "Components/ErrorDragon";
import OnBoardExpContainer from "Features/Tutorial";
import Navbar from "./Navbar";
import NoAccessRedirectPrompt from "./NoAccessRedirectPrompt";
import UnsupportedBrowserPrompt from "./UnsupportedBrowserPrompt";
import { detect } from "detect-browser";
import { UserType } from "Constants";
import { AppPath, PRODUCT_STANDALONE } from "Config/appConfig";
import { serviceUrl } from "Config/servicesConfig";
import { FlowTeam, FlowUser } from "Types";
import styles from "./app.module.scss";

const AppActivation = lazy(() => import(/* webpackChunkName: "App Activation" */ "./AppActivation"));
const Activity = lazy(() => import(/* webpackChunkName: "Activity" */ "Features/Activity"));
const Editor = lazy(() => import(/* webpackChunkName: "Editor" */ "Features/Editor"));
const Execution = lazy(() => import(/* webpackChunkName: "Execution" */ "Features/Execution"));
const GlobalProperties = lazy(() => import(/* webpackChunkName: "GlobalProperties" */ "Features/GlobalProperties"));
const Insights = lazy(() => import(/* webpackChunkName: "Insights" */ "Features/Insights"));
const Quotas = lazy(() => import(/* webpackChunkName: "Quotas" */ "Features/Quotas"));
const TaskTemplates = lazy(() => import(/* webpackChunkName: "TaskTemplates" */ "Features/TaskTemplates"));
const Teams = lazy(() => import(/* webpackChunkName: "Teams" */ "Features/Teams"));
const TeamProperties = lazy(() => import(/* webpackChunkName: "TeamProperties" */ "Features/TeamProperties"));
const Users = lazy(() => import(/* webpackChunkName: "TeamProperties" */ "Features/Users"));
const Workflows = lazy(() => import(/* webpackChunkName: "Workflows" */ "Features/Workflows"));

const userUrl = serviceUrl.getUserProfile();
const navigationUrl = serviceUrl.getNavigation();
const getTeamsUrl = serviceUrl.getTeams();
const browser = detect();
const allowedUserRoles = [UserType.Admin, UserType.Operator];
const supportedBrowsers = ["chrome", "firefox", "safari", "edge"];

export default function App() {
  const [shouldShowBrowserWarning, setShouldShowBrowserWarning] = useState(
    !supportedBrowsers.includes(browser?.name || "")
  );
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [showActivatePlatform, setShowActivatePlatform] = React.useState(false);
  const [activationCode, setActivationCode] = React.useState("");

  const fetchUserResolver = async () => {
    try {
      const response = await axios.get(userUrl);
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
    queryKey: userUrl,
    queryFn: fetchUserResolver,
  });
  const navigationQuery = useSimpleQuery(navigationUrl);
  const teamsQuery = useSimpleQuery(getTeamsUrl);

  const isLoading = userQuery.isLoading || navigationQuery.isLoading || teamsQuery.isLoading;
  const isError = userQuery.isError || navigationQuery.isError || teamsQuery.isError;

  const handleSetActivationCode = (code: string) => {
    setActivationCode(code);
    setShowActivatePlatform(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
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

  return (
    <FlagsProvider features={{ standalone: PRODUCT_STANDALONE }}>
      <Navbar
        handleOnTutorialClick={() => setIsTutorialActive(true)}
        navigationQuery={navigationQuery}
        userQuery={userQuery}
      />
      <OnBoardExpContainer isTutorialActive={isTutorialActive} setIsTutorialActive={setIsTutorialActive} />
      <ErrorBoundary>
        <Main
          isError={isError}
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

interface MainProps {
  isError: boolean;
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

  // Show redirect prompt if the user doesn't have any teams
  if (Object.keys(teamsData).length === 0) {
    return <NoAccessRedirectPrompt />;
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
            component={<Teams />}
            path={AppPath.TeamList}
            userRole={platformRole}
          />
          <ProtectedRoute
            allowedUserRoles={allowedUserRoles}
            component={<Users />}
            path={AppPath.UserList}
            userRole={platformRole}
          />
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
