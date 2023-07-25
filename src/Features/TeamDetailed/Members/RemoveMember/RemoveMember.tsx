import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { ConfirmModal, notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import { TrashCan } from "@carbon/react/icons";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { FlowUser } from "Types";
import styles from "./RemoveMember.module.scss";

interface RemoveMemberProps {
  member: FlowUser;
  memberIdList: string[];
  teamId: string;
  teamName: string;
  userId: string;
}
const RemoveMember: React.FC<RemoveMemberProps> = ({ member, memberIdList, teamId, teamName, userId }) => {
  const queryClient = useQueryClient();
  const { mutateAsync: leaveTeamMutator, isLoading } = useMutation(resolver.patchTeamMembers, {
    onSuccess: () => queryClient.invalidateQueries(serviceUrl.getTeam({ teamId })),
  });

  async function handleCreateLeaveTeamRequest() {
    const leaveTeamData = memberIdList.filter((id) => id !== member.id);
    try {
      await leaveTeamMutator({ teamId, body: leaveTeamData });
      notify(
        <ToastNotification
          title="Remove User Requested"
          subtitle="Request to remove user from team successful"
          kind="success"
          data-cy="b-toast_remove_success"
        />
      );
    } catch (error) {
      notify(
        <ToastNotification
          title="Something's Wrong"
          subtitle="Request to remove user from team failed"
          kind="error"
          data-cy="b-toast_remove_error"
        />
      );
    }
  }

  return (
    <ConfirmModal
      affirmativeAction={handleCreateLeaveTeamRequest}
      affirmativeButtonProps={{ kind: "danger", disabled: isLoading, "data-testid": "remove-member" }}
      negativeButtonsProps={{ disabled: isLoading }}
      children={`Are you sure you want to remove ${member.name} from ${teamName}? The user will lose access to all team workflows.`}
      title={`Remove from Team`}
      modalTrigger={({ openModal }: { openModal: () => void }) => (
        <button className={styles.removeButton} disabled={member.id === userId} onClick={openModal}>
          Remove from Team
          <TrashCan fill={"#f94d56"} />
        </button>
      )}
    />
  );
};

export default RemoveMember;
