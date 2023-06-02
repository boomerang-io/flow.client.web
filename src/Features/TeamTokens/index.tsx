import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Helmet } from "react-helmet";
import { useAppContext } from "Hooks";
import { notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import { serviceUrl, resolver } from "Config/servicesConfig";
import TeamTokenComponent from "./TeamTokenComponent";
import { FlowTeam } from "Types";
import styles from "./tokens.module.scss";

function TeamTokensContainer() {
  const { activeTeam, user } = useAppContext();
  const queryClient = useQueryClient();

  const getTeamTokensUrl = serviceUrl.getTeamTokens({ teamId: activeTeam?.id });

  const {
    data: tokensData,
    error: tokensError,
    isLoading: tokensIsLoading,
  } = useQuery({
    queryKey: getTeamTokensUrl,
    queryFn: resolver.query(getTeamTokensUrl),
    enabled: Boolean(activeTeam?.id),
  });

  const { mutateAsync: deleteTokenMutator } = useMutation(resolver.deleteToken, {
    onSuccess: () => queryClient.invalidateQueries([getTeamTokensUrl]),
  });

  const deleteToken = async (tokenId: string) => {
    try {
      await deleteTokenMutator({ tokenId });
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
      <TeamTokenComponent
        deleteToken={deleteToken}
        isLoading={tokensIsLoading}
        hasError={tokensError}
        tokens={tokensData}
        activeTeam={activeTeam}
        userType={user.type}
      />
    </div>
  );
}

export default TeamTokensContainer;
