import React from "react";
import { StructuredListRow, StructuredListCell } from "@carbon/react";
import type { Token as TokenType } from "Types";
import DeleteToken from "Components/DeleteToken";
import moment from "moment";

interface TokenProps {
  tokenData: TokenType;
  deleteToken: (tokenId: string) => void;
}

const TokenRow: React.FC<TokenProps> = ({ tokenData, deleteToken }) => {
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

export default TokenRow;
