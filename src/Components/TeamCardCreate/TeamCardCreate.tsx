import { ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import { Add } from "@carbon/react/icons";
import TeamCreateContent from "./TeamCreateContent";
import styles from "./teamCardCreate.module.scss";
import { ModalTriggerProps } from "Types";

interface TeamCardProps {
  createTeam: (values: { name: string | undefined }) => void;
  isError: boolean;
  isLoading: boolean;
}

function TeamCard(props: TeamCardProps) {
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
        {({ closeModal }) => {
          return (
            <TeamCreateContent
              closeModal={closeModal}
              createTeam={props.createTeam}
              isError={props.isError}
              isLoading={props.isLoading}
            />
          );
        }}
      </ComposedModal>
    </div>
  );
}

export default TeamCard;
