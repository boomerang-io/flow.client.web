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
import DeleteToken from "Components/DeleteToken";
import moment from "moment";
import { TokenType } from "Constants";
import type { Token, TokenScopeType } from "Types";
import styles from "./TokenSection.module.scss";

interface TokenProps {
  type: TokenScopeType;
  principal: string;
}

const TokenSection: React.FC<TokenProps> = ({ type, principal }) => {
  const queryClient = useQueryClient();
  const getTokensUrl = serviceUrl.getTokens({
    query: queryString.stringify({ types: type, principals: principal }),
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
              getTokensQuery.data.content?.map((token: Token) => (
                <TokenRow tokenData={token} deleteToken={deleteToken} />
              ))
            )}
          </StructuredListBody>
        </StructuredListWrapper>
      </dl>
      <CreateToken getTokensUrl={getTokensUrl} principal={principal} type={type} />
    </>
  );
};

interface TokenRowProps {
  tokenData: Token;
  deleteToken: (tokenId: string) => void;
}

const TokenRow: React.FC<TokenRowProps> = ({ tokenData, deleteToken }) => {
  return (
    <StructuredListRow>
      <StructuredListCell>{tokenData.name}</StructuredListCell>
      <StructuredListCell>{tokenData.valid ? "Active" : "Inactive"}</StructuredListCell>
      <StructuredListCell>
        {tokenData.creationDate ? moment(tokenData.creationDate).utc().startOf("day").format("MMMM DD, YYYY") : "---"}
      </StructuredListCell>
      <StructuredListCell>
        {tokenData.expirationDate
          ? moment(tokenData.expirationDate).utc().startOf("day").format("MMMM DD, YYYY")
          : "---"}
      </StructuredListCell>
      <StructuredListCell>{tokenData.permissions ? tokenData.permissions.join(", ") : "---"}</StructuredListCell>
      <div>
        <DeleteToken tokenItem={tokenData} deleteToken={deleteToken} />
      </div>
      <StructuredListCell />
    </StructuredListRow>
  );
};

export default TokenSection;
