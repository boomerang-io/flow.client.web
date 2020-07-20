// @ts-nocheck
import React, { lazy, useState, Suspense } from "react";
import { FlagsProvider } from "flagged";
import { AppContext } from "State/context";
import { useQuery } from "Hooks";
import { Switch, Route, Redirect } from "react-router-dom";
import {
  ErrorBoundary,
  Error404,
  Loading,
  NotificationsContainer,
  ProtectedRoute,
} from "@boomerang-io/carbon-addons-boomerang-react";
import ErrorDragon from "Components/ErrorDragon";
import OnBoardExpContainer from "Features/Tutorial";
import Navbar from "./Navbar";
import NoAccessRedirectPrompt from "./NoAccessRedirectPrompt";
import UnsupportedBrowserPrompt from "./UnsupportedBrowserPrompt";
import { detect } from "detect-browser";
import { UserType } from "Constants";
import { appPath } from "Config/appConfig";
import { serviceUrl } from "Config/servicesConfig";
import styles from "./app.module.scss";

const Activity = lazy(() => import(/* webpackChunkName: "Activity" */ "Features/Activity"));
const Editor = lazy(() => import(/* webpackChunkName: "Editor" */ "Features/Editor"));
const Execution = lazy(() => import(/* webpackChunkName: "Execution" */ "Features/Execution"));
const GlobalProperties = lazy(() => import(/* webpackChunkName: "GlobalProperties" */ "Features/GlobalProperties"));
const Insights = lazy(() => import(/* webpackChunkName: "Insights" */ "Features/Insights"));
const TaskTemplates = lazy(() => import(/* webpackChunkName: "TaskTemplates" */ "Features/TaskTemplates"));
const TeamProperties = lazy(() => import(/* webpackChunkName: "TeamProperties" */ "Features/TeamProperties"));
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

  const userQuery = useQuery(userUrl);
  const navigationQuery = useQuery(navigationUrl);
  const teamsQuery = useQuery(getTeamsUrl);

  const isLoading = userQuery.isLoading || navigationQuery.isLoading || teamsQuery.isLoading;
  const isError = userQuery.isError || navigationQuery.isError || teamsQuery.isError;

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorDragon style={{ margin: "5rem 0" }} />;
  }

  return (
    <FlagsProvider features={{ standalone: true }}>
      <Navbar
        handleOnTutorialClick={() => setIsTutorialActive(true)}
        navigationState={navigationQuery}
        userState={userQuery}
      />
      <OnBoardExpContainer isTutorialActive={isTutorialActive} setIsTutorialActive={setIsTutorialActive} />
      <ErrorBoundary errorComponent={ErrorDragon}>
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

interface Team {
  name: string;
  id: string;
}

interface MainProps {
  isLoading: boolean;
  isError: boolean;
  isTutorialActive: boolean;
  setIsTutorialActive: (isTutorialActive: boolean) => void;
  setShouldShowBrowserWarning: (shouldShowBrowserWarning: boolean) => void;
  shouldShowBrowserWarning: boolean;
  teamsData: Array<Team>;
  userData: { id: string; type: string };
}

function Main({
  isError,
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
    <AppContext.Provider
      value={{
        isTutorialActive,
        setIsTutorialActive,
        user: userData,
        teams: teamsData,
      }}
    >
      <AppFeatures platformRole={platformRole} />
    </AppContext.Provider>
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
            path={appPath.properties}
            userRole={platformRole}
          />
          <ProtectedRoute
            allowedUserRoles={allowedUserRoles}
            component={<TeamProperties />}
            path={appPath.teamProperties}
            userRole={platformRole}
          />
          <ProtectedRoute
            allowedUserRoles={allowedUserRoles}
            component={<TaskTemplates />}
            path={appPath.taskTemplates}
            userRole={platformRole}
          />
          <Route path={appPath.execution}>
            <Execution />
          </Route>
          <Route path={appPath.activity}>
            <Activity />
          </Route>
          <Route path={appPath.editor}>
            <Editor />
          </Route>
          <Route path={appPath.insights}>
            <Insights />
          </Route>
          <Route path={appPath.workflows}>
            <Workflows />
          </Route>
          <Redirect exact from="/" to={appPath.workflows} />
          <Route path="*" component={Error404} />
        </Switch>
      </Suspense>
      <NotificationsContainer enableMultiContainer />
    </main>
  );
});
