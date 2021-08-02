import React from "react";
import { useMutation, useQuery, queryCache } from "react-query";
import { Helmet } from "react-helmet";
import { useAppContext } from "Hooks";
import { notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import { serviceUrl, resolver } from "Config/servicesConfig";
import TokenComponent from "./TokenComponent";
import styles from "./tokens.module.scss";

function TeamTokensContainer() {
  const [activeTeam, setActiveTeam] = React.useState(null);
  const { teams } = useAppContext();

  const getTeamTokensUrl = serviceUrl.getTeamTokens({teamId: activeTeam?.id});

  const { data: tokensData, error: tokensError, isLoading: tokensIsLoading } = useQuery({
    queryKey: getTeamTokensUrl,
    queryFn: resolver.query(getTeamTokensUrl),
    config: {enabled: activeTeam?.id},
  });

  const [deleteTokenMutator] = useMutation(resolver.deleteToken, {
    onSuccess: () => queryCache.invalidateQueries([getTeamTokensUrl]),
  });

  const deleteToken = async (id) => {
    try {
      await deleteTokenMutator({ tokenId: id });
      notify(<ToastNotification kind="success" title="Delete Team Token" subtitle={`Token successfully deleted`} />);
    } catch (error) {
      notify(<ToastNotification kind="error" title="Something's Wrong" subtitle="Request to delete token failed" />);
    }
  };

  return (
    <div className={styles.tokensContainer}>
      <Helmet>
        <title>Team Tokens</title>
      </Helmet>
      <TokenComponent
        deleteToken={deleteToken}
        isLoading={tokensIsLoading}
        hasError={tokensError}
        tokens={tokensData}
        teams={teams}
        setActiveTeam={setActiveTeam}
      />
    </div>
  );
}

export default TeamTokensContainer;
