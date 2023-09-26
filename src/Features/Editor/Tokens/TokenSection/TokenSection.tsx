import React from "react";
import { notify, ToastNotification, TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { resolver, serviceUrl } from "Config/servicesConfig";
import queryString from "query-string";
import { Help } from "@carbon/react/icons";
import {
  SkeletonText,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
} from "@carbon/react";
import CreateToken from "Components/CreateToken";
import TokenRow from "Components/TokenRow";
import styles from "./TokenSection.module.scss";

interface TokenProps {
  workflowId: string;
  paragraph?: string;
}

const TokenSection: React.FC<TokenProps> = ({ workflowId, paragraph }) => {
  const queryClient = useQueryClient();
  const getTokensUrl = serviceUrl.getTokens({
    query: queryString.stringify({ types: "workflow", principals: workflowId }),
  });
  const getTokensQuery = useQuery({
    queryKey: getTokensUrl,
    queryFn: resolver.query(getTokensUrl),
  });

  const deleteTokenMutator = useMutation(resolver.deleteToken);
  const deleteToken = async (tokenId: string) => {
    try {
      await deleteTokenMutator.mutateAsync({ tokenId });
      queryClient.invalidateQueries([getTokensUrl]);
      notify(<ToastNotification kind="success" title="Delete Token" subtitle={`Token successfully deleted`} />);
    } catch (error) {
      notify(<ToastNotification kind="error" title="Something's Wrong" subtitle="Request to delete token failed" />);
    }
  };

  return (
    <>
      <dl className={styles.detailedListContainer}>
        {paragraph && <p className={styles.detailedListParagraph}>{paragraph}</p>}
        <StructuredListWrapper className={styles.structuredListWrapper} ariaLabel="Structured list" isCondensed={true}>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head>Name</StructuredListCell>
              <StructuredListCell head>Status</StructuredListCell>
              <StructuredListCell head>Creation Date</StructuredListCell>
              <StructuredListCell head>Expiration Date</StructuredListCell>
              <StructuredListCell head className={styles.structuredListHeader}>
                Permissions
                <TooltipHover
                  direction="top"
                  tooltipText="Permissions in the format SCOPE / PRINCIPAL / ACTION. Read more about permissions in the documentation."
                >
                  <Help className={styles.structuredListHeaderHoverIcon} />
                </TooltipHover>
              </StructuredListCell>
              <StructuredListCell head />
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {getTokensQuery.isLoading ? (
              <StructuredListRow>
                <StructuredListCell>
                  <SkeletonText data-testid="token-loading-skeleton" />
                </StructuredListCell>
                <StructuredListCell>
                  <SkeletonText data-testid="token-loading-skeleton" />
                </StructuredListCell>
                <StructuredListCell>
                  <SkeletonText data-testid="token-loading-skeleton" />
                </StructuredListCell>
                <StructuredListCell>
                  <SkeletonText data-testid="token-loading-skeleton" />
                </StructuredListCell>
                <StructuredListCell />
              </StructuredListRow>
            ) : (
              getTokensQuery.data.content?.map((token: TokenType) => (
                <TokenRow tokenData={token} deleteToken={deleteToken} />
              ))
            )}
          </StructuredListBody>
        </StructuredListWrapper>
      </dl>
      <CreateToken getTokensUrl={getTokensUrl} principal={workflowId} type="workflow" />
    </>
  );
};

export default TokenSection;
