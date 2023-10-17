import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Button } from "@carbon/react";
import type { FlowUser } from "Types";
import { resolver, serviceUrl } from "Config/servicesConfig";
import queryString from "query-string";
import styles from "./github.module.scss";

//TODO validate the props needed
interface CallbackProps {
  user: FlowUser;
  userManagementEnabled: any;
}

export default function Callback() {
  // const queryClient = useQueryClient();

  // const getTokensUrl = serviceUrl.getTokens({
  //   query: queryString.stringify({ types: "user", principals: user?.id }),
  // });

  // const getTokensQuery = useQuery({
  //   queryKey: getTokensUrl,
  //   queryFn: resolver.query(getTokensUrl),
  //   enabled: Boolean(user?.id),
  // });

  // const deleteTokenMutator = useMutation(resolver.deleteToken);

  // const deleteToken = async (tokenId: string) => {
  //   try {
  //     await deleteTokenMutator.mutateAsync({ tokenId });
  //     queryClient.invalidateQueries([getTokensUrl]);
  //     notify(<ToastNotification kind="success" title="Delete Token" subtitle={`Token successfully deleted`} />);
  //   } catch (error) {
  //     notify(<ToastNotification kind="error" title="Something's Wrong" subtitle="Request to delete token failed" />);
  //   }
  // };

  return (
    <section aria-label="User Settings" className={styles.settingsContainer}>
      <Helmet>
        <title>Integration Registration Callback</title>
      </Helmet>
      <section className={styles.container}>
        <h1>GitHub App Registration</h1>
        <p>Thank you for installing the GitHub App!</p>
        <br />
        <p>
          Your Team will now be able to receive events from GitHub and use these events to trigger Workflows. Make sure
          to let them know!
        </p>
        <br />
        <Button kind="tertiary" type="button" size="sm">
          Go to Home
        </Button>
      </section>
    </section>
  );
}
