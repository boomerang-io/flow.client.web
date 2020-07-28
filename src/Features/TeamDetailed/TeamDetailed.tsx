import React from "react";
import { useQuery } from "react-query";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { Loading, ErrorMessage } from "@boomerang-io/carbon-addons-boomerang-react";
import Members from "./Members";
import Workflows from "./Workflows";
import { AppPath } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import styles from "./teamDetailed.module.scss";

import { Box } from "reflexbox";
import FeatureHeader from "Components/FeatureHeader";
import Header from "./Header";

import { useAppContext } from "Hooks";

const FeatureLayout: React.FC = ({ children }) => {
  return (
    <>
      <FeatureHeader>
        <h1 style={{ fontWeight: 600, margin: 0 }}>Teams</h1>
        <p>View and manage all of the Flow teams</p>
      </FeatureHeader>
      <Box p="1rem">{children}</Box>
    </>
  );
};

function TeamDetailedContainer() {
  const match: { params: { teamId: string } } = useRouteMatch();
  const teamId = match?.params?.teamId;
  const { user } = useAppContext();

  const teamDetailsUrl = serviceUrl.getManageTeam({ teamId });

  const { data: teamDetailsData, error: teamDetailsError, isLoading: teamDetailsIsLoading } = useQuery({
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
        <Header team={teamDetailsData} isActive={isActive} userType={user.type} />
        <Switch>
          <Route exact path={AppPath.Team}>
            <Members
              isActive={isActive}
              team={teamDetailsData}
              memberList={teamDetailsData.users}
              user={user}
              //teamOwnerIdList={teamOwnerIdList}
            />
          </Route>
          <Route exact path={AppPath.TeamWorkflows}>
            <Workflows team={teamDetailsData} />
          </Route>
        </Switch>
      </div>
    );
  }

  return null;
}

export default TeamDetailedContainer;
