import React from "react";
import { ConfirmModal, TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import { TrashCan } from "@carbon/react/icons";
import { StructuredListRow, StructuredListCell, Button } from "@carbon/react";
import type { ModalTriggerProps, Token as TokenType } from "Types";
import styles from "./Token.module.scss";

interface TokenProps {
  tokenData: TokenType;
  deleteToken: (tokenId: string) => void;
}

const Token: React.FC<TokenProps> = ({ tokenData, deleteToken }) => {
  return (
    <StructuredListRow>
      <StructuredListCell>{tokenData.name}</StructuredListCell>
      <StructuredListCell>{tokenData.creationDate}</StructuredListCell>
      <StructuredListCell>{tokenData.expirationDate ? tokenData.expirationDate : "---"}</StructuredListCell>
      <StructuredListCell>{tokenData.permissions ? tokenData.permissions : "---"}</StructuredListCell>
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
        />
      </div>
      <StructuredListCell />
    </StructuredListRow>
  );
};

export default Token;
