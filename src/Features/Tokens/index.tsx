import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Helmet } from "react-helmet";
import { notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import { serviceUrl, resolver } from "Config/servicesConfig";
import GlobalTokenComponent from "./GlobalTokenComponent";
import styles from "./tokens.module.scss";

const getGlobalTokensUrl = serviceUrl.getGlobalTokens();

function GlobalTokensContainer() {
  const queryClient = useQueryClient();

  const { data: tokensData, error: tokensError, isLoading: tokensIsLoading } = useQuery({
    queryKey: getGlobalTokensUrl,
    queryFn: resolver.query(getGlobalTokensUrl),
  });

  const { mutateAsync: deleteTokenMutator } = useMutation(resolver.deleteToken, {
    onSuccess: () => queryClient.invalidateQueries([getGlobalTokensUrl]),
  });

  const deleteToken = async (tokenId: string) => {
    try {
      await deleteTokenMutator({ tokenId });
      notify(<ToastNotification kind="success" title="Delete Global Token" subtitle={`Token successfully deleted`} />);
    } catch (error) {
      notify(<ToastNotification kind="error" title="Something's Wrong" subtitle="Request to delete token failed" />);
    }
  };

  return (
    <div className={styles.tokensContainer}>
      <Helmet>
        <title>Global Tokens</title>
      </Helmet>
      <GlobalTokenComponent
        deleteToken={deleteToken}
        isLoading={tokensIsLoading}
        hasError={tokensError}
        tokens={tokensData}
      />
    </div>
  );
}

export default GlobalTokensContainer;
