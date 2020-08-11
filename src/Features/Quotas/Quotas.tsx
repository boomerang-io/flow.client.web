import React from "react";
import { useQuery } from "Hooks";
import { Box } from "reflexbox";
import { Route, Switch, useRouteMatch, Redirect } from "react-router-dom";
import { Loading } from "@boomerang-io/carbon-addons-boomerang-react";
import ErrorDragon from "Components/ErrorDragon";
import WombatMessage from "Components/WombatMessage";
import Sidenav from "./Sidenav";
import TeamQuotasOverview from "./TeamQuotasOverview";
import queryString from "query-string";
import { AppPath, appLink } from "Config/appConfig";
import { serviceUrl } from "Config/servicesConfig";
import { SortDirection } from "Constants";
import styles from "./Quotas.module.scss";

const DEFAULT_ORDER = SortDirection.Desc;
const DEFAULT_PAGE = 0;
const DEFAULT_SORT = "name";

//for fetching "all" teams? Maybe make request larger?
const DEFAULT_ALL_TEAM_SIZE = 1000;

const allQuery = `?${queryString.stringify({
  order: DEFAULT_ORDER,
  page: DEFAULT_PAGE,
  size: DEFAULT_ALL_TEAM_SIZE,
  sort: DEFAULT_SORT,
})}`;

const QuotasContainer: React.FC = () => {
  const match = useRouteMatch();

  const teamsUrl = serviceUrl.getManageTeams({ query: allQuery });
  const { data: teamsData, error: teamsDataError, isLoading: getTeamLoading } = useQuery(teamsUrl);

  if (getTeamLoading) {
    return <Loading />;
  }

  if (teamsDataError) {
    return (
      <div className={styles.container}>
        <ErrorDragon />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidenav teams={teamsData.records} />
      <Switch>
        <Route exact path={match.path}>
          <Box maxWidth="24rem" margin="0 auto">
            <WombatMessage className={styles.wombat} title="Select a team to view quotas" />
          </Box>
        </Route>
        <Route path={AppPath.QuotasEdit}>
          <TeamQuotasOverview teams={teamsData.records} />
        </Route>
        <Redirect to={appLink.quotas()} />
      </Switch>
    </div>
  );
};

export default QuotasContainer;
