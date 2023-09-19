import React, { lazy, useState, Suspense } from "react";
import axios from "axios";
import { FlagsProvider, useFeature } from "flagged";
import { AppContextProvider, TeamContextProvider, useAppContext } from "State/context";
import { useQuery, useQueryClient } from "react-query";
import { Switch, Route, Redirect, useLocation, useParams } from "react-router-dom";
import { Button } from "@carbon/react";
import {
  DelayedRender,
  Error404,
  Loading,
  NotificationsContainer,
  ProtectedRoute,
} from "@boomerang-io/carbon-addons-boomerang-react";
import Joyride, { CallBackProps, TooltipRenderProps, STATUS } from "react-joyride";
import ErrorBoundary from "Components/ErrorBoundary";
import ErrorDragon from "Components/ErrorDragon";
import Navbar from "./Navbar";
import UnsupportedBrowserPrompt from "./UnsupportedBrowserPrompt";
import { detect } from "detect-browser";
import { sortBy } from "lodash";
import { elevatedUserRoles } from "Constants";
import { ArrowRight, ArrowLeft, Close } from "@carbon/react/icons";
import { AppPath, FeatureFlag } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { FlowFeatures, FlowNavigationItem, FlowTeam, FlowUser, ContextConfig } from "Types";
import styles from "./app.module.scss";

const AppActivation = lazy(() => import("./AppActivation"));
const Activity = lazy(() => import("Features/Activity"));
const Actions = lazy(() => import("Features/Actions"));
// const ApproverGroups = lazy(() => import("Features/TeamDetailed/ApproverGroups"));
const Editor = lazy(() => import("Features/Editor"));
const Execution = lazy(() => import("Features/Execution"));
const GlobalParameters = lazy(() => import("Features/Parameters/GlobalParameters"));
const Tokens = lazy(() => import("Features/GlobalTokens/GlobalTokens"));
const Insights = lazy(() => import("Features/Insights"));
const Schedules = lazy(() => import("Features/Schedules"));
const Settings = lazy(() => import("Features/Settings"));
const TemplateWorkflows = lazy(() => import("Features/TemplateWorkflows"));
// const TaskTemplates = lazy(() => import("Features/TaskTemplates"));
const Teams = lazy(() => import("Features/Teams"));
const ManageTeam = lazy(() => import("Features/TeamDetailed"));
const TeamParameters = lazy(() => import("Features/Parameters/TeamParameters"));
const TeamTasks = lazy(() => import("Features/TaskManager/TeamTasks"));
const AdminTasks = lazy(() => import("Features/TaskManager/systemTasks"));
// const TaskTemplatesContainer = lazy(() => import("Features/ManageTeamTasks"));
const Users = lazy(() => import("Features/Users"));
const UserProfile = lazy(() => import("Features/UserProfile"));
const Workflows = lazy(() => import("Features/Workflows"));
const Home = lazy(() => import("Features/Home"));

const getUserUrl = serviceUrl.getUserProfile();
const getContextUrl = serviceUrl.getContext();
const featureFlagsUrl = serviceUrl.getFeatureFlags();
const browser = detect();
const supportedBrowsers = ["chrome", "firefox", "safari", "edge"];

export default function App() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const teamName =
    location.pathname.endsWith("/home") ||
    location.pathname.startsWith("/system") ||
    location.pathname.endsWith("/profile")
      ? null
      : location.pathname.split("/").filter(Boolean)[0];
  const query = teamName ? `?team=${teamName}` : "";
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

  const contextQuery = useQuery<ContextConfig, string>({
    queryKey: getContextUrl,
    queryFn: resolver.query(getContextUrl),
    enabled: Boolean(userQuery.data?.id),
  });

  const navigationQuery = useQuery<Array<FlowNavigationItem>, string>({
    queryKey: getNavigationUrl,
    queryFn: resolver.query(getNavigationUrl),
    enabled: Boolean(userQuery.data?.id),
  });

  const isLoading =
    userQuery.isLoading || contextQuery.isLoading || featureQuery.isLoading || navigationQuery.isLoading;

  const hasError = userQuery.isError || contextQuery.isError || featureQuery.isError || navigationQuery.isError;

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
  if (userQuery.data && contextQuery.data && featureQuery.data && navigationQuery.data) {
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
          contextData={contextQuery.data}
          userData={userQuery.data}
        />
        {
          //<OnBoardExpContainer isTutorialActive={isTutorialActive} setIsTutorialActive={setIsTutorialActive} />
        }
        <ErrorBoundary>
          <Main
            isTutorialActive={isTutorialActive}
            contextData={contextQuery.data}
            setIsTutorialActive={setIsTutorialActive}
            setShouldShowBrowserWarning={setShouldShowBrowserWarning}
            shouldShowBrowserWarning={shouldShowBrowserWarning}
            userData={userQuery.data}
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
  contextData: ContextConfig;
  setIsTutorialActive: (isTutorialActive: boolean) => void;
  setShouldShowBrowserWarning: (shouldShowBrowserWarning: boolean) => void;
  shouldShowBrowserWarning: boolean;
  userData: FlowUser;
  quotas: FlowFeatures["quotas"];
}

function Main({
  isTutorialActive,
  contextData: contextData,
  setIsTutorialActive,
  setShouldShowBrowserWarning,
  shouldShowBrowserWarning,
  userData,
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
        setIsTutorialActive,
        quotas,
        communityUrl: contextData?.platform?.communityUrl ?? "",
        name: contextData?.platform?.name ?? "",
        teams: sortBy(userData.teams, "name"),
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
  const teamParametersEnabled = useFeature(FeatureFlag.TeamParametersEnabled);
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
          <Route path={"/profile"}>
            <UserProfile />
          </Route>
          <Route path={"/system"}>
            <Switch>
              <ProtectedRoute
                allowedUserRoles={elevatedUserRoles}
                component={() => <Settings />}
                path={AppPath.Settings}
                userRole={platformRole}
              />
              <ProtectedRoute
                allowedUserRoles={elevatedUserRoles}
                component={() => <GlobalParameters />}
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
                component={() => <AdminTasks />}
                path={AppPath.TaskTemplates}
                userRole={platformRole}
              />
              <ProtectedRoute
                allowedUserRoles={elevatedUserRoles}
                component={<Tokens />}
                path={AppPath.Tokens}
                userRole={platformRole}
              />
              <ProtectedRoute
                allowedUserRoles={elevatedUserRoles}
                component={<Teams />}
                path={AppPath.TeamList}
                userRole={platformRole}
              />
              <ProtectedRoute
                allowedUserRoles={elevatedUserRoles}
                component={<Users />}
                path={AppPath.UserList}
                userRole={platformRole}
              />
              <Redirect exact from="/" to={AppPath.Settings} />
            </Switch>
          </Route>
          <Route path={"/:team"}>
            <TeamContainer>
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
                  component={() => <TeamTasks />}
                  path={AppPath.ManageTaskTemplates}
                  userRole={teamTasksEnabled ? "*" : ""}
                />
                <ProtectedRoute
                  allowedUserRoles={["*"]}
                  component={() => <TeamParameters />}
                  path={AppPath.ManageTeamParameters}
                  userRole={teamParametersEnabled ? "*" : ""}
                />
                <Route path={AppPath.ManageTeam}>
                  <ManageTeam />
                </Route>
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
            </TeamContainer>
          </Route>
          <Redirect to="/home" />
        </Switch>
        <Tutorial />
      </Suspense>
      <NotificationsContainer enableMultiContainer />
    </main>
  );
});

function TeamContainer(props: { children: React.ReactNode }) {
  const { team }: { team: string } = useParams();
  const getTeamUrl = serviceUrl.resourceTeam({ team });

  const teamQuery = useQuery<FlowTeam>({
    queryKey: getTeamUrl,
    queryFn: resolver.query(getTeamUrl),
  });

  if (teamQuery.isLoading || teamQuery.error) {
    return null;
  }

  if (teamQuery.data) {
    return (
      <TeamContextProvider
        value={{
          team: teamQuery.data,
        }}
      >
        {props.children}
      </TeamContextProvider>
    );
  }

  return null;
}

/**
 * TODO: MOVE THIS TO OWN COMPONENT
 * AND DETERMINE WHEN TO RENDER WHICH TUTORIAL
 * BASED ON THE PATH
 */
const home_steps = [
  {
    disableBeacon: true,
    target: "#your-teams",
    content: "This is my awesome feature!",
  },
  {
    disableBeacon: true,
    target: "#explore",
    content: "This is my awesome again!",
  },
];

const workflows_steps = [
  {
    disableBeacon: true,
    target: "#my-workflows",
    content: "This is my awesome feature!",
  },
];

const stepMapper = {
  ":team/workflows": workflows_steps,
};

function Tutorial() {
  const { setIsTutorialActive, isTutorialActive } = useAppContext();
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, status } = data;

    if (action === "close") {
      setIsTutorialActive(false);
    }

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setIsTutorialActive(false);
    }
  };

  if (!isTutorialActive) {
    return null;
  }

  return (
    <Joyride
      continuous
      callback={handleJoyrideCallback}
      steps={workflows_steps}
      tooltipComponent={({
        continuous,
        index,
        step,
        backProps,
        primaryProps,
        closeProps,
        tooltipProps,
      }: TooltipRenderProps) => {
        return (
          <div
            {...tooltipProps}
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "0.25rem",
              height: "10rem",
              width: "20rem",
            }}
          >
            {step.title && <h2>{step.title}</h2>}
            <div>{step.content}</div>
            <footer>
              {index > 0 && (
                <Button {...backProps} renderIcon={ArrowLeft} size="sm" kind="secondary">
                  Back
                </Button>
              )}
              {continuous && (
                <Button {...primaryProps} renderIcon={ArrowRight} size="sm">
                  Next
                </Button>
              )}
              <Button {...closeProps} hasIconOnly renderIcon={Close} label="Close" size="sm">
                Close
              </Button>
            </footer>
          </div>
        );
      }}
    />
  );
}
