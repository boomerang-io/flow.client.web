import React from "react";
import { useQuery } from "react-query";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { 
  ErrorMessage,
  FeatureHeader, 
  FeatureHeaderTitle as HeaderTitle, 
  FeatureHeaderSubtitle as HeaderSubtitle, 
  Loading
} from "@boomerang-io/carbon-addons-boomerang-react";
import Members from "./Members";
import Settings from "./Settings";
import Workflows from "./Workflows";
import { AppPath } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import styles from "./teamDetailed.module.scss";
import { Box } from "reflexbox";
import Header from "./Header";

import { useAppContext } from "Hooks";

const FeatureLayout: React.FC = ({ children }) => {
  return (
    <>
      <FeatureHeader
        includeBorder={false}
        header={
          <>
            <HeaderTitle style={{ margin: "0" }}>Teams</HeaderTitle>
            <HeaderSubtitle>View and manage Flow teams.</HeaderSubtitle>
          </>
        }
      />
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
          <Route exact path={AppPath.TeamSettings}>
            <Settings team={teamDetailsData} />
          </Route>
        </Switch>
      </div>
    );
  }

  return null;
}

export default TeamDetailedContainer;
