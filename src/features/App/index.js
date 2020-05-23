import React, { useState, useMemo, Suspense } from "react";
import { useQuery } from "Hooks";
import { detect } from "detect-browser";
import { Switch, Route, Redirect } from "react-router-dom";
import {
  ErrorBoundary,
  Error404,
  Loading,
  NotificationsContainer,
  ProtectedRoute,
} from "@boomerang/carbon-addons-boomerang-react";
import OnBoardExpContainer from "Features/OnBoard";
import Navbar from "./Navbar";
import NoAccessRedirectPrompt from "./NoAccessRedirectPrompt";
import UnsupportedBrowserPrompt from "./UnsupportedBrowserPrompt";
import {
  AsyncActivity,
  AsyncEditor,
  AsyncExecution,
  AsyncGlobalConfiguration,
  AsyncInsights,
  AsyncTaskTemplates,
  AsyncTeamProperties,
  AsyncWorkflows,
} from "./asyncFeatureImports";
import USER_TYPES from "Constants/userTypes";
import ErrorDragon from "Components/ErrorDragon";
import { appPath } from "Config/appConfig";
import { serviceUrl } from "Config/servicesConfig";
import { AppContext } from "State/context";
import { QueryStatus } from "Constants";
import styles from "./app.module.scss";

const userUrl = serviceUrl.getUserProfile();
const navigationUrl = serviceUrl.getNavigation();
const getTeamsUrl = serviceUrl.getTeams();
const browser = detect();
const allowedUserRoles = [USER_TYPES.ADMIN, USER_TYPES.OPERATOR];
const supportedBrowsers = ["chrome", "firefox", "safari", "edge"];

export default function App() {
  const [shouldShowBrowserWarning, setShouldShowBrowserWarning] = useState(!supportedBrowsers.includes(browser.name));
  const [activeTeam, setActiveTeam] = useState(undefined);
  const [onBoardShow, setOnBoardShow] = useState(false);

  const userQuery = useQuery(userUrl);
  const navigationQuery = useQuery(navigationUrl);
  const teamsQuery = useQuery(getTeamsUrl);

  const { data: userData = {} } = userQuery;
  const { data: teamsData } = teamsQuery;
  const { id: userId, type: platformRole } = userData;

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

  const renderAppContent = useMemo(
    () => () => {
      if (isLoadingInitialData) {
        return <Loading />;
      }

      if (isErrorState) {
        return <ErrorDragon style={{ margin: "5rem 0" }} />;
      }

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

      if (isSuccessState) {
        return (
          <div className={styles.container}>
            <Suspense fallback={<Loading />}>
              <Switch>
                <ProtectedRoute
                  allowedUserRoles={allowedUserRoles}
                  component={<AsyncGlobalConfiguration />}
                  path={appPath.properties}
                  userRole={platformRole}
                />
                <ProtectedRoute
                  allowedUserRoles={allowedUserRoles}
                  component={<AsyncTeamProperties />}
                  path={appPath.teamProperties}
                  userRole={platformRole}
                />
                <ProtectedRoute
                  allowedUserRoles={allowedUserRoles}
                  component={<AsyncTaskTemplates />}
                  path={appPath.taskTemplates}
                  userRole={platformRole}
                />
                <Route path={appPath.execution} component={AsyncExecution} />
                <Route path={appPath.activity} component={AsyncActivity} />
                <Route path={appPath.editor} component={AsyncEditor} />
                <Route path={appPath.insights} component={AsyncInsights} />
                <Route path={appPath.workflows} component={AsyncWorkflows} />
                <Redirect exact from="/" to={appPath.workflows} />
                <Route path="*" component={Error404} />
              </Switch>
            </Suspense>
            <NotificationsContainer enableMultiContainer />
          </div>
        );
      }

      return null;
    },
    [isLoadingInitialData, isErrorState, isSuccessState, platformRole, shouldShowBrowserWarning, teamsData, userId]
  );

  return (
    <>
      <AppContext.Provider
        value={{
          user: userData,
          teams: teamsData,
          teamsQuery: teamsQuery,
          activeTeam: activeTeam,
          setActiveTeam: setActiveTeam,
          onBoardShow: onBoardShow,
          setOnBoardShow: setOnBoardShow,
        }}
      >
        <Navbar
          handleOnTutorialClick={() => setOnBoardShow(true)}
          navigationState={navigationQuery}
          userState={userQuery}
        />
        <OnBoardExpContainer />
        <ErrorBoundary errorComponent={ErrorDragon}>{renderAppContent()}</ErrorBoundary>
      </AppContext.Provider>
    </>
  );
}
