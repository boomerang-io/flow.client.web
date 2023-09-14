import React from "react";
import { ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import { FlowTeam, ComposedModalChildProps, ModalTriggerProps } from "Types";
import TeamCreateContent from "./TeamCreateContent";
import { Add } from "@carbon/react/icons";
import styles from "./teamCardCreate.module.scss";

interface TeamCardProps {
  teams: Array<FlowTeam> | null;
}

const TeamCard: React.FC<TeamCardProps> = ({ teams }) => {
  return (
    <div className={styles.container}>
      <ComposedModal
        composedModalProps={{ shouldCloseOnOverlayClick: true }}
        modalHeaderProps={{
          title: "Create Team",
          subtitle: `Scope your workflows and parameters to a team`,
        }}
        modalTrigger={({ openModal }: ModalTriggerProps) => (
          <button className={styles.content} onClick={openModal} data-testid="workflows-create-workflow-button">
            <Add className={styles.addIcon} />
            <p className={styles.text}>{`Create a new Team`}</p>
          </button>
        )}
      >
        {({ closeModal }: ComposedModalChildProps) => {
          return <TeamCreateContent closeModal={closeModal} teamRecords={teams} />;
        }}
      </ComposedModal>
    </div>
  );
};

export default TeamCard;
