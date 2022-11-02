import React from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { useFeature } from "flagged";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { Box } from "reflexbox";
import { ErrorMessage, Loading } from "@carbon/react";
import Header from "./Header";
import Labels from "./Labels";
import Teams from "./Teams";
import Workflows from "./Workflows";
import { FlowUser } from "Types";
import { AppPath, FeatureFlag } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import styles from "./UserDetailed.module.scss";

interface FeatureLayoutProps {
  isError?: boolean;
  isLoading?: boolean;
  user?: FlowUser;
  children: any;
}

const FeatureLayout = ({ children, isLoading, isError }: FeatureLayoutProps) => {
  return (
    <>
      <Helmet>
        <title>User</title>
      </Helmet>
      <Header isError={isError} isLoading={isLoading} />
      <Box p="1rem">{children}</Box>
    </>
  );
};

function TeamDetailedContainer() {
  const userManagementEnabled = useFeature(FeatureFlag.UserManagementEnabled);
  const match: { params: { userId: string } } = useRouteMatch();
  const userId = match?.params?.userId;

  const userDetailsUrl = serviceUrl.resourceManageUser({ userId });

  const { data: userDetailsData, isError: userDetailsIsError, isLoading: userDetailsIsLoading } = useQuery({
    queryKey: userDetailsUrl,
    queryFn: resolver.query(userDetailsUrl),
  });

  if (userDetailsIsLoading)
    return (
      <FeatureLayout isLoading={userDetailsIsLoading}>
        <Loading />
      </FeatureLayout>
    );
  if (userDetailsIsError)
    return (
      <FeatureLayout isError={userDetailsIsError}>
        <ErrorMessage />
      </FeatureLayout>
    );

  if (userDetailsData) {
    return (
      <div className={styles.container}>
        <Header user={userDetailsData} userManagementEnabled={userManagementEnabled} />
        <Switch>
          <Route exact path={AppPath.User}>
            <Workflows user={userDetailsData} />
          </Route>
          <Route exact path={AppPath.UserTeams}>
            <Teams user={userDetailsData} />
          </Route>
          <Route exact path={AppPath.UserLabels}>
            <Labels user={userDetailsData} userManagementEnabled={userManagementEnabled} />
          </Route>
        </Switch>
      </div>
    );
  }

  return null;
}

export default TeamDetailedContainer;
