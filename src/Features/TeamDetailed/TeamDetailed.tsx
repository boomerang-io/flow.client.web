import React from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { useFeature } from "flagged";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { useAppContext } from "Hooks";
import { Box } from "reflexbox";
import {
  ErrorMessage,
  FeatureHeader,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
  Loading,
} from "@boomerang-io/carbon-addons-boomerang-react";
import Header from "./Header";
import Members from "./Members";
import Settings from "./Settings";
import Quotas from "./Quotas";
import Labels from "./Labels";
import Workflows from "./Workflows";
import { AppPath, FeatureFlag } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import styles from "./teamDetailed.module.scss";

const FeatureLayout: React.FC = ({ children }) => {
  return (
    <>
      <Helmet>
        <title>Teams</title>
      </Helmet>
      <FeatureHeader
        includeBorder={false}
        header={
          <>
            <HeaderTitle style={{ margin: "0" }}>Teams</HeaderTitle>
            <HeaderSubtitle>View and manage Flow teams</HeaderSubtitle>
          </>
        }
      />
      <Box p="1rem">{children}</Box>
    </>
  );
};

function TeamDetailedContainer() {
  const teamManagementEnabled = useFeature(FeatureFlag.TeamManagementEnabled);
  const match: { params: { teamId: string } } = useRouteMatch();
  const teamId = match?.params?.teamId;
  const { user } = useAppContext();

  const teamDetailsUrl = serviceUrl.getTeam({ teamId });

  const {
    data: teamDetailsData,
    error: teamDetailsError,
    isLoading: teamDetailsIsLoading,
  } = useQuery({
    queryKey: teamDetailsUrl,
    queryFn: resolver.query(teamDetailsUrl),
  });

  if (teamDetailsIsLoading)
    return (
      <FeatureLayout>
        <Loading />
      </FeatureLayout>
    );
  if (teamDetailsError)
    return (
      <FeatureLayout>
        <ErrorMessage />
      </FeatureLayout>
    );

  if (teamDetailsData) {
    // const teamOwnerIdList = teamDetailsData?.owners?.map((owner) => owner.ownerId);
    const { isActive } = teamDetailsData;
    return (
      <div className={styles.container}>
        <Header isActive={isActive} team={teamDetailsData} teamManagementEnabled={teamManagementEnabled} />
        <Switch>
          <Route exact path={AppPath.Team}>
            <Members
              isActive={isActive}
              team={teamDetailsData}
              memberList={teamDetailsData.users}
              user={user}
              teamManagementEnabled={teamManagementEnabled}
            />
          </Route>
          <Route exact path={AppPath.TeamWorkflows}>
            <Workflows team={teamDetailsData} />
          </Route>
          <Route exact path={AppPath.TeamLabels}>
            <Labels isActive={isActive} team={teamDetailsData} teamManagementEnabled={teamManagementEnabled} />
          </Route>
          <Route exact path={AppPath.TeamQuotas}>
            <Quotas team={teamDetailsData} teamManagementEnabled={teamManagementEnabled} />
          </Route>
          <Route exact path={AppPath.TeamSettings}>
            <Settings team={teamDetailsData} teamManagementEnabled={teamManagementEnabled} />
          </Route>
        </Switch>
      </div>
    );
  }

  return null;
}

export default TeamDetailedContainer;
