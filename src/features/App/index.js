import React, { useState, Suspense } from "react";
import { useQuery } from "react-query";

import { detect } from "detect-browser";
import { Switch, Route, Redirect } from "react-router-dom";
import { NotificationsContainer, ProtectedRoute, ErrorBoundary } from "@boomerang/carbon-addons-boomerang-react";
import OnBoardExpContainer from "Features/OnBoard";
import Loading from "Components/Loading";
import Navbar from "./Navbar";
import NoAccessRedirectPrompt from "./NoAccessRedirectPrompt";
import UnsupportedBrowserPrompt from "./UnsupportedBrowserPrompt";
import DesignerV2 from "Features/DesignerV2";
import {
  AsyncActivity,
  AsyncDesigner,
  AsyncExecution,
  AsyncGlobalConfiguration,
  AsyncInsights,
  AsyncTaskTemplates,
  AsyncTeamProperties,
  AsyncWorkflows,
} from "./asyncFeatureImports";
// import { BASE_USERS_URL, BASE_SERVICE_URL } from "Config/servicesConfig";
// import SERVICE_REQUEST_STATUSES from "Constants/serviceRequestStatuses";
import USER_TYPES from "Constants/userTypes";
import ErrorDragon from "Components/ErrorDragon";
import styles from "./app.module.scss";

import { serviceUrl, resolver } from "Config/servicesConfig";

import { AppContext } from "State/context";
import { QueryStatus } from "Constants";

const userUrl = serviceUrl.getUserProfile();
const navigationUrl = serviceUrl.getNavigation();
const getTeamsUrl = serviceUrl.getTeams();
//Fetch data

const browser = detect();

const allowedUserRoles = [USER_TYPES.ADMIN, USER_TYPES.OPERATOR];
const supportedBrowsers = ["chrome", "firefox", "safari", "edge"];
export default function App() {
  const [shouldShowBrowserWarning, setShouldShowBrowserWarning] = useState(!supportedBrowsers.includes(browser.name));
  const [activeTeam, setActiveTeam] = useState(undefined);
  const [onBoardShow, setOnBoardShow] = useState(false);

  const userQuery = useQuery({ queryKey: userUrl, queryFn: resolver.query(userUrl) });
  const navigationQuery = useQuery({ queryKey: navigationUrl, queryFn: resolver.query(navigationUrl) });
  const teamsQuery = useQuery({ queryKey: getTeamsUrl, queryFn: resolver.query(getTeamsUrl) });
  const { data: userData } = userQuery;
  const { data: teamsData, refetch: refetchTeams } = teamsQuery;

  const userIsLoading = userQuery.status === QueryStatus.Loading;
  const navigationIsLoading = navigationQuery.status === QueryStatus.Loading;
  const teamsIsLoading = teamsQuery.status === QueryStatus.Loading;

  const renderAppContent = () => {
    if (userIsLoading || navigationIsLoading || teamsIsLoading) {
      return <Loading />;
    }

    // Don't show anything to a user that doesn't exist, the UIShell will show the redirect
    if (userQuery.status === QueryStatus.Success && !userData.id) {
      return null;
    }

    // Show redirect prompt if the user doesn't have any teams
    if (teamsQuery.status === QueryStatus.Success && Object.keys(teamsData).length === 0) {
      return <NoAccessRedirectPrompt />;
    }

    if (shouldShowBrowserWarning) {
      return <UnsupportedBrowserPrompt onDismissWarning={() => setShouldShowBrowserWarning(false)} />;
    }

    if (
      userQuery.status === QueryStatus.Success &&
      navigationQuery.status === QueryStatus.Success //&&
      //teamsQuery.status === QueryStatus.Success
    ) {
      const userRole = userData.type;

      return (
        <div className={styles.container}>
          <Suspense fallback={<Loading />}>
            <Switch>
              <ProtectedRoute
                allowedUserRoles={allowedUserRoles}
                component={<AsyncGlobalConfiguration />}
                path="/properties"
                userRole={userRole}
              />
              <ProtectedRoute
                allowedUserRoles={allowedUserRoles}
                component={<AsyncTeamProperties />}
                path="/team-properties"
                userRole={userRole}
              />
              <ProtectedRoute
                allowedUserRoles={allowedUserRoles}
                component={<AsyncTaskTemplates />}
                path="/task-templates"
                userRole={userRole}
              />
              <Route path="/activity/:workflowId/execution/:executionId" component={AsyncExecution} />
              <Route path="/activity" component={AsyncActivity} />
              <Route path="/editor-old/:workflowId" component={AsyncDesigner} />
              <Route path="/editor/:workflowId" component={DesignerV2} />
              <Route path="/insights" component={AsyncInsights} />
              <Route path="/workflows" component={AsyncWorkflows} />
              <Redirect from="/" to="/workflows" />
            </Switch>
          </Suspense>
          <NotificationsContainer enableMultiContainer />
        </div>
      );
    }
    if (
      userQuery.status === QueryStatus.Error ||
      navigationQuery.status === QueryStatus.Error ||
      teamsQuery.status === QueryStatus.Error
    ) {
      return <ErrorDragon style={{ margin: "5rem 0" }} />;
    }

    return null;
  };

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
          refetchTeams: refetchTeams,
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
