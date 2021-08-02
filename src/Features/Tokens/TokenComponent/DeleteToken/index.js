import React from "react";
import { Button, ConfirmModal } from "@boomerang-io/carbon-addons-boomerang-react";
import { TrashCan16 } from "@carbon/icons-react";
import styles from "./deleteToken.module.scss";

function DeleteToken({ tokenItem, deleteToken }) {
  const message = tokenItem.toolTemplateName
    ? `If instances of ${tokenItem.toolTemplateName} are actively using this token, things will likely break.`
    : "If this token is actively being used, things will likely break.";
  return (
    <ConfirmModal
      modalTrigger={({ openModal }) => (
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
