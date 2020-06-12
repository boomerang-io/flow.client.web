import React, { lazy, useState, Suspense } from "react";
import { Provider, reducer } from "State/reducers/app";
import { useQuery } from "Hooks";
import { Switch, Route, Redirect } from "react-router-dom";
import {
  ErrorBoundary,
  Error404,
  Loading,
  NotificationsContainer,
  ProtectedRoute,
} from "@boomerang/carbon-addons-boomerang-react";
import ErrorDragon from "Components/ErrorDragon";
import OnBoardExpContainer from "Features/OnBoard";
import Navbar from "./Navbar";
import NoAccessRedirectPrompt from "./NoAccessRedirectPrompt";
import UnsupportedBrowserPrompt from "./UnsupportedBrowserPrompt";
import { detect } from "detect-browser";
import { QueryStatus, UserType } from "Constants";
import { appPath } from "Config/appConfig";
import { serviceUrl } from "Config/servicesConfig";
import styles from "./app.module.scss";

const Activity = lazy(() => import(/* webpackChunkName: "Activity" */ "Features/Activity"));
const Editor = lazy(() => import(/* webpackChunkName: "Editor =" */ "Features/Editor"));
const Execution = lazy(() => import(/* webpackChunkName: "Execution" */ "Features/Execution"));
const GlobalConfiguration = lazy(() =>
  import(/* webpackChunkName: "GlobalConfiguration" */ "Features/GlobalProperties")
);
const Insights = lazy(() => import(/* webpackChunkName: "Insights" */ "Features/Insights"));
const TaskTemplates = lazy(() => import(/* webpackChunkName: "Task Templates" */ "Features/TaskTemplates"));
const TeamProperties = lazy(() => import(/* webpackChunkName: "TeamProperties" */ "Features/TeamProperties"));
const Workflows = lazy(() => import(/* webpackChunkName: "Workflows" */ "Features/Workflows"));

const userUrl = serviceUrl.getUserProfile();
const navigationUrl = serviceUrl.getNavigation();
const getTeamsUrl = serviceUrl.getTeams();
const browser = detect();
const allowedUserRoles = [UserType.Admin, UserType.Operator];
const supportedBrowsers = ["chrome", "firefox", "safari", "edge"];

export default function App() {
  const [shouldShowBrowserWarning, setShouldShowBrowserWarning] = useState(!supportedBrowsers.includes(browser.name));
  const [onBoardShow, setOnBoardShow] = useState(false);

  const userQuery = useQuery(userUrl);
  const navigationQuery = useQuery(navigationUrl);
  const teamsQuery = useQuery(getTeamsUrl);

  const { data: userData = {} } = userQuery;
  const { data: teamsData } = teamsQuery;

  const isLoadingInitialData =
    userQuery.status === QueryStatus.Loading ||
    navigationQuery.status === QueryStatus.Loading ||
    teamsQuery.status === QueryStatus.Loading;

  const isSuccessState =
    userQuery.status === QueryStatus.Success &&
    navigationQuery.status === QueryStatus.Success &&
    teamsQuery.status === QueryStatus.Success;

  const isErrorState =
    userQuery.status === QueryStatus.Error ||
    navigationQuery.status === QueryStatus.Error ||
    teamsQuery.status === QueryStatus.Error;

  return (
    <>
      <Navbar
        handleOnTutorialClick={() => setOnBoardShow(true)}
        navigationState={navigationQuery}
        userState={userQuery}
      />
      <OnBoardExpContainer onBoardShow={onBoardShow} setOnBoardShow={setOnBoardShow} />
      <ErrorBoundary errorComponent={ErrorDragon}>
        <Main
          isLoadingInitialData={isLoadingInitialData}
          isErrorState={isErrorState}
          isSuccessState={isSuccessState}
          onBoardShow={onBoardShow}
          setOnBoardShow={setOnBoardShow}
          setShouldShowBrowserWarning={setShouldShowBrowserWarning}
          shouldShowBrowserWarning={shouldShowBrowserWarning}
          teamsData={teamsData}
          userData={userData}
        />
      </ErrorBoundary>
    </>
  );
}

function Main({
  isLoadingInitialData,
  isErrorState,
  isSuccessState,
  platformRole,
  onBoardShow,
  setOnBoardShow,
  setShouldShowBrowserWarning,
  shouldShowBrowserWarning,
  teamsData,
  userData,
  userId,
}) {
  if (isLoadingInitialData) {
    return <Loading />;
  }

  if (isErrorState) {
    return <ErrorDragon style={{ margin: "5rem 0" }} />;
  }

  if (isSuccessState) {
    const { id: userId, type: platformRole } = userData;

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
      <Provider
        reducer={reducer}
        initialState={{
          onBoardShow,
          setOnBoardShow,
          user: userData,
          teams: teamsData,
        }}
      >
        <AppFeatures platformRole={platformRole} />
      </Provider>
    );
  }

  return null;
}

const AppFeatures = React.memo(function AppFeatures({ platformRole }) {
  return (
    <main id="content" className={styles.container}>
      <Suspense fallback={<Loading />}>
        <Switch>
          <ProtectedRoute
            allowedUserRoles={allowedUserRoles}
            component={<GlobalConfiguration />}
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
