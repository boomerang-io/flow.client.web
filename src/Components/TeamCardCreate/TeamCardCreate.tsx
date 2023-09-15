import React from "react";
import { ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import { ComposedModalChildProps, ModalTriggerProps } from "Types";
import TeamCreateContent from "./TeamCreateContent";
import { Add } from "@carbon/react/icons";
import styles from "./teamCardCreate.module.scss";

function TeamCard() {
  return (
    <div className={styles.container}>
      <ComposedModal
        composedModalProps={{ shouldCloseOnOverlayClick: true }}
        modalHeaderProps={{
          title: "Create Team",
          subtitle: `Set up your team. The display name will be used to create a unique identifier for your team. Display names can be adjusted post team creation.`,
        }}
        modalTrigger={({ openModal }: ModalTriggerProps) => (
          <button className={styles.content} onClick={openModal} data-testid="workflows-create-workflow-button">
            <Add className={styles.addIcon} />
            <p className={styles.text}>{`Create a new Team`}</p>
          </button>
        )}
      >
        {({ closeModal }: ComposedModalChildProps) => {
          return <TeamCreateContent closeModal={closeModal} />;
        }}
      </ComposedModal>
    </div>
  );
}

export default TeamCard;
