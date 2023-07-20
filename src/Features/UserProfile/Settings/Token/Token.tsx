import React from "react";
import { ConfirmModal } from "@boomerang-io/carbon-addons-boomerang-react";
import { TrashCan } from "@carbon/react/icons";
import { StructuredListRow, StructuredListCell, Button } from "@carbon/react";
import type { Token as TokenType } from "Types";
import moment from "moment";
import styles from "./Token.module.scss";

interface TokenProps {
  tokenData: TokenType;
  deleteToken: (tokenId: string) => void;
}

const Token: React.FC<TokenProps> = ({ tokenData, deleteToken }) => {
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
        <ConfirmModal
          modalTrigger={({ openModal }: { openModal: () => void }) => (
            <Button
              className={styles.button}
              iconDescription="deleteToken"
              kind="danger--ghost"
              onClick={openModal}
              renderIcon={TrashCan}
              size="sm"
              data-testid={`delete-token-button-${tokenData.id}`}
            />
          )}
          affirmativeAction={() => deleteToken(tokenData.id)}
          affirmativeButtonProps={{ kind: "danger" }}
          affirmativeText="Yes"
          negativeText="No"
          title={`Are you sure?`}
        >
          The token will be deleted. This action cannot be undone. Are you sure you want to do this?
        </ConfirmModal>
      </div>
      <StructuredListCell />
    </StructuredListRow>
  );
};

export default Token;
