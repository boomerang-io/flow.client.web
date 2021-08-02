import React from "react";
import { useMutation, useQuery, queryCache } from "react-query";
import { Helmet } from "react-helmet";
import { notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import { serviceUrl, resolver } from "Config/servicesConfig";
import TokenComponent from "./TokenComponent";
import styles from "./tokens.module.scss";

const getGlobalTokensUrl = serviceUrl.getGlobalTokens();

function GlobalTokensContainer() {
  const { data: tokensData, error: tokensError, isLoading: tokensIsLoading } = useQuery({
    queryKey: getGlobalTokensUrl,
    queryFn: resolver.query(getGlobalTokensUrl),
  });

  const [deleteTokenMutator] = useMutation(resolver.deleteToken, {
    onSuccess: () => queryCache.invalidateQueries([getGlobalTokensUrl]),
  });

  const deleteToken = async (id) => {
    try {
      await deleteTokenMutator({ tokenId: id });
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
      <TokenComponent
        deleteToken={deleteToken}
        isLoading={tokensIsLoading}
        hasError={tokensError}
        tokens={tokensData}
      />
    </div>
  );
}

export default GlobalTokensContainer;
