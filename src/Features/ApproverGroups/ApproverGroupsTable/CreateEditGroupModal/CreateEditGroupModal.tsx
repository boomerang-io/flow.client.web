import React from "react";
import { Button } from "@carbon/react";
import { ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import CreateEditGroupModalContent from "./CreateEditGroupModalContent";
import { FlowTeam, ApproverGroup } from "Types";
import { Add, Edit } from "@carbon/react/icons";
import styles from "./createEditGroupModal.module.scss";

type CreateEditGroupModalProps = {
  approverGroup?: ApproverGroup;
  approverGroups: ApproverGroup[];
  isEdit?: boolean;
  team?: FlowTeam | null;
};

function CreateEditGroupModal({ isEdit, approverGroup, approverGroups, team }: CreateEditGroupModalProps) {
  /**
   * arrays of values for making the key unique
   * filter out own value if editing a approverGroup, pass through all if creating
   */
  let approverGroupNames: string[] = [];
  if (Array.isArray(approverGroups)) {
    approverGroupNames = approverGroups.map((configurationObj) => configurationObj.groupName.toLowerCase());
    if (isEdit && approverGroup) {
      approverGroupNames = approverGroupNames.filter(
        (approverGroupItem) => approverGroupItem !== approverGroup.groupName.toLowerCase()
      );
    }
  }
  const cancelRequestRef = React.useRef<any>();

  return (
    <ComposedModal
      composedModalProps={{ containerClassName: styles.modalContainer, shouldCloseOnOverlayClick: false }}
      modalTrigger={({ openModal }: any) =>
        !isEdit ? (
          <Button renderIcon={Add} size="md" kind="ghost" onClick={openModal}>
            Create new group
          </Button>
        ) : (
          <Button
            className={styles.editButton}
            onClick={openModal}
            kind="ghost"
            renderIcon={Edit}
            size="sm"
            iconDescription="Edit approver group"
            data-testid="edit-approver-group"
          />
        )
      }
      modalHeaderProps={{
        title: isEdit && approverGroup ? `Edit ${approverGroup.groupName}` : "Create new group",
        subtitle:
          "Choose a group name, then add users from a selected Team. Groups can only be formed with users from the same Team. Members will receive an email notification about their new permissions.",
      }}
      onCloseModal={() => {
        if (cancelRequestRef.current) cancelRequestRef.current();
      }}
    >
      {({ closeModal }: any) => (
        <CreateEditGroupModalContent
          isEdit={isEdit}
          approverGroup={approverGroup}
          approverGroups={approverGroupNames}
          team={team}
          cancelRequestRef={cancelRequestRef}
          closeModal={closeModal}
        />
      )}
    </ComposedModal>
  );
}

export default CreateEditGroupModal;
