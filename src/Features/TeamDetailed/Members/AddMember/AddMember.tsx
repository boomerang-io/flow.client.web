import React from "react";
import { Button, ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import { Add16 } from "@carbon/icons-react";
import { FlowUser } from "Types";
import AddMemberContent from "./AddMemberContent";
import styles from "./AddMember.module.scss";

interface AddMemberProps {
  memberIdList: string[];
  memberList: FlowUser[];
  teamId: string;
  teamName: string;
}
const AddMember: React.FC<AddMemberProps> = ({ memberIdList, memberList, teamId, teamName }) => {
  return (
    <ComposedModal
      modalTrigger={({ openModal }: { openModal: Function }) => (
        <Button
          renderIcon={Add16}
          onClick={() => {
            openModal();
          }}
          iconDescription="Add members"
          size="field"
          data-testid="add-members-button"
        >
          Add Members
        </Button>
      )}
      composedModalProps={{ containerClassName: styles.modal }}
      modalHeaderProps={{
        title: "Add members",
        subtitle: `Search for people to add to this team`,
      }}
    >
      {({ closeModal }: { closeModal: Function }) => (
        <AddMemberContent
          closeModal={closeModal}
          memberList={memberList}
          memberIdList={memberIdList}
          teamId={teamId}
          teamName={teamName}
        />
      )}
    </ComposedModal>
  );
};

export default AddMember;
