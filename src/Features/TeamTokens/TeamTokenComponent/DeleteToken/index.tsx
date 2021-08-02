import React from "react";
import { Button, ConfirmModal } from "@boomerang-io/carbon-addons-boomerang-react";
import { TrashCan16 } from "@carbon/icons-react";
import { Token } from "Types";
import styles from "./deleteToken.module.scss";

interface Props {
  tokenItem: Token;
  deleteToken(tokenId: string): void;
}

function DeleteToken({ tokenItem, deleteToken }: Props) {
  const message = "If this token is actively being used, things will likely break.";
  return (
    <ConfirmModal
      modalTrigger={({ openModal }: { openModal: () => void }) => (
        <Button
          className={styles.button}
          iconDescription="deleteToken"
          kind="danger--ghost"
          onClick={openModal}
          renderIcon={TrashCan16}
          size="small"
          data-testid={`delete-token-button-${tokenItem.id}`}
        />
      )}
      affirmativeAction={() => deleteToken(tokenItem.id)}
      affirmativeButtonProps={{ kind: "danger" }}
      affirmativeText="Yes"
      negativeText="No"
      title={`Are you sure?`}
    >
      {message}
    </ConfirmModal>
  );
}

export default DeleteToken;
