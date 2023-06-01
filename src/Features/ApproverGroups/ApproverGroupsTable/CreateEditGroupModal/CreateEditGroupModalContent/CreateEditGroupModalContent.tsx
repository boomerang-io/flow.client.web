import React from "react";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import sortBy from "lodash/sortBy";
import { matchSorter } from "match-sorter";
import {
  ErrorMessage,
  Loading,
  ModalFlowForm,
  notify,
  TextInput,
  ToastNotification,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { Button, Checkbox, InlineNotification, ModalBody, ModalFooter, Search } from "@carbon/react";
import { formatErrorMessage, isAccessibleKeyboardEvent } from "@boomerang-io/utils";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { AddAlt, SubtractAlt } from "@carbon/react/icons";
import { FlowTeam, Approver, ApproverGroup } from "Types";
import styles from "./createEditGroupModalContent.module.scss";

type RenderMembersListProps = {
  members: Approver[];
  approvers: Approver[];
  setFieldValue: (field: string, args: any) => void;
};

function RenderMembersList({ members, approvers, setFieldValue }: RenderMembersListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const filteredMembers = Boolean(searchQuery)
    ? matchSorter(members, searchQuery, {
        keys: ["name", "email"],
      })
    : members;
  const filteredMembersIds = filteredMembers.map((member: Approver) => member.id);
  const currentApproversIds = approvers.map((approver: Approver) => approver.id);
  const allMembersChecked =
    filteredMembers.length !== 0 &&
    filteredMembers.length ===
      filteredMembers.filter((member: Approver) => currentApproversIds.includes(member.id)).length;

  const handleSelectAllMembers = () => {
    if (!allMembersChecked) {
      setFieldValue("approvers", [
        ...approvers,
        ...filteredMembers.filter((member: Approver) => !currentApproversIds.includes(member.id)),
      ]);
    } else
      setFieldValue(
        "approvers",
        approvers.filter((approver: Approver) => !filteredMembersIds.includes(approver.id))
      );
  };

  const handleSelectMember = ({ member, arrayHelpers }: { member: Approver; arrayHelpers: any }) => {
    const memberIndex = approvers.findIndex((approver) => approver.id === member.id);
    if (memberIndex >= 0) arrayHelpers.remove(memberIndex);
    else arrayHelpers.push({ ...member });
  };

  return (
    <div>
      <div className={styles.divider} />
      <Search
        labelText="member search"
        id="member-search"
        placeholder="Search for Team Members by name or email"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
      />
      <p className={styles.selectedUsers}>{`${approvers.length} users selected`}</p>
      <ul>
        <Checkbox
          id="teamMembers"
          labelText="Team members"
          checked={allMembersChecked}
          className={styles.selectAllMembers}
          onChange={handleSelectAllMembers}
        />
        <FieldArray
          name="approvers"
          render={(arrayHelpers) =>
            filteredMembers.map((member: Approver, index: number) => (
              <li className={styles.userListCheckItem}>
                <Checkbox
                  id={member.id}
                  labelText={member.name}
                  checked={currentApproversIds.includes(member.id)}
                  className={styles.userName}
                  onChange={() => handleSelectMember({ member, arrayHelpers })}
                />
                <p className={styles.userEmail}>{member.email}</p>
              </li>
            ))
          }
        />
      </ul>
    </div>
  );
}

type RenderEditMembersInGroupProps = {
  members: Approver[];
  title: string;
  isRemove?: boolean;
};

function RenderEditMembersInGroup({ members, title, isRemove = false }: RenderEditMembersInGroupProps) {
  const determineMemberIndex = (userId: string) => members.findIndex((approver) => approver.id === userId);
  return (
    <div className={styles.membersContainer}>
      <p className={styles.listTitle}>{`${title} (${members.length})`}</p>
      <ul className={styles.userList}>
        {Boolean(members.length) ? (
          <FieldArray
            name="approvers"
            render={(arrayHelpers) =>
              sortBy(members, ["userName"]).map((member) => (
                <li className={styles.userListItem}>
                  <div className={styles.memberInfo}>
                    <p className={styles.userName}>{member.name}</p>
                    <p className={styles.userEmail}>{member.email}</p>
                  </div>
                  {isRemove ? (
                    <div
                      role="button"
                      onClick={() => arrayHelpers.remove(determineMemberIndex(member.id))}
                      onKeyDown={(e: any) =>
                        isAccessibleKeyboardEvent(e) && arrayHelpers.remove(determineMemberIndex(member.id))
                      }
                      tabIndex={0}
                    >
                      <SubtractAlt className={styles.actionIcon} />
                    </div>
                  ) : (
                    <div
                      role="button"
                      onClick={() => arrayHelpers.push(member)}
                      onKeyDown={(e: any) => isAccessibleKeyboardEvent(e) && arrayHelpers.push(member)}
                      tabIndex={0}
                    >
                      <AddAlt className={styles.actionIcon} />
                    </div>
                  )}
                </li>
              ))
            }
          />
        ) : (
          <div className={styles.noMembers}>
            <p className={styles.noMembersTitle}>{isRemove ? "No group members" : "No team members"}</p>
            <p className={styles.noMembersMessage}>
              {isRemove ? "Add members from the list below in order to save this group" : ""}
            </p>
          </div>
        )}
      </ul>
    </div>
  );
}

type Props = {
  closeModal: () => void;
  isEdit?: boolean;
  approverGroup?: ApproverGroup;
  approverGroups: string[];
  team?: FlowTeam | null;
  cancelRequestRef: any;
};

function CreateEditGroupModalContent({
  closeModal,
  isEdit = false,
  approverGroup,
  approverGroups,
  team,
  cancelRequestRef,
}: Props) {
  const queryClient = useQueryClient();
  const teamMembers = team?.users;
  console.log("teamMembers", teamMembers);
  // const flowTeamUsersUrl = serviceUrl.getTeamMembers({ teamId: team?.id });

  // const {
  //   data: teamMembers,
  //   isLoading: teamMembersIsLoading,
  //   error: teamMembersError,
  // } = useQuery({
  //   queryKey: flowTeamUsersUrl,
  //   queryFn: resolver.query(flowTeamUsersUrl),
  //   enabled: Boolean(team?.id),
  // });

  const approverGroupsUrl = serviceUrl.resourceApproverGroups({ teamId: team?.id, groupId: undefined });

  /** Add Approver Group */
  const {
    mutateAsync: addTeamApproverGroupMutation,
    isLoading: addIsLoading,
    error: addError,
  } = useMutation(
    (args: { teamId: string | undefined; body: ApproverGroup }) => {
      const { promise, cancel } = resolver.postApproverGroupRequest(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(approverGroupsUrl),
    }
  );

  /** Update Approver Group */
  const {
    mutateAsync: updateTeamApproverGroupMutation,
    isLoading: updateIsLoading,
    error: updateError,
  } = useMutation(
    (args: { teamId: string | undefined; body: ApproverGroup }) => {
      const { promise, cancel } = resolver.putApproverGroupRequest(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(approverGroupsUrl),
    }
  );

  const loading = addIsLoading || updateIsLoading;

  const hasError = Boolean(addError) || Boolean(updateError);
  const { title, message: subtitle } = formatErrorMessage({
    error: addError || updateError,
    defaultMessage: `${Boolean(addError) ? "Create" : "Update"} Approver Group Failed`,
  });

  const handleSubmit = async (values: any) => {
    values.approvers.forEach((approver: any) => delete approver.id);
    const newTeamApproverGroup = isEdit ? { ...values, groupId: approverGroup?.id } : { ...values };

    if (isEdit) {
      try {
        const response: any = await updateTeamApproverGroupMutation({
          teamId: team?.id,
          body: newTeamApproverGroup,
        });
        notify(
          <ToastNotification
            kind="success"
            title={"Approver Group Updated"}
            subtitle={`Request to update ${response.data.groupName} succeeded`}
            data-testid="create-update-approver-group-notification"
          />
        );
        closeModal();
      } catch (err) {
        //noop
      }
    } else {
      try {
        const response: any = await addTeamApproverGroupMutation({ teamId: team?.id, body: newTeamApproverGroup });
        notify(
          <ToastNotification
            kind="success"
            title={"Approver Group Created"}
            subtitle={`Request to create ${response.data.groupName} succeeded`}
            data-testid="create-update-approver-group-notification"
          />
        );
        closeModal();
      } catch (err) {
        //noop
      }
    }
  };

  const loadingText = isEdit ? "Saving..." : "Creating...";
  const normalText = isEdit ? "Save" : "Create group";
  const buttonText = loading ? loadingText : normalText;

  return (
    <Formik
      initialValues={{
        groupName: approverGroup && approverGroup.name ? approverGroup.name : "",
        approvers: approverGroup && approverGroup.approvers ? sortBy(approverGroup.approvers, ["name"]) : [],
      }}
      onSubmit={handleSubmit}
      validationSchema={Yup.object().shape({
        groupName: Yup.string()
          .lowercase()
          .required("Enter a group name")
          .notOneOf(approverGroups, "Group name must be unique within the Team"),
        approvers: Yup.array().min(1, "Groups should have at least 1 member"),
      })}
    >
      {(props) => {
        const { dirty, values, touched, errors, isValid, handleChange, handleBlur, handleSubmit, setFieldValue } =
          props;
        const currentGroupMembersIds = values.approvers.map((approver) => approver.id);
        const sortedTeamMembers = sortBy(teamMembers, ["name"]);
        const eligibleMembers = teamMembers
          ? sortedTeamMembers.filter((teamMember) => !currentGroupMembersIds.includes(teamMember.id))
          : [];

        return (
          <ModalFlowForm onSubmit={handleSubmit}>
            {loading && <Loading />}
            <ModalBody className={styles.formBody}>
              <div className={styles.input}>
                <TextInput
                  id="groupName"
                  labelText="Group name"
                  placeholder="i.e. Senior level approvers"
                  name="groupName"
                  helperText="Must be unique within the Team"
                  value={values.groupName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  invalid={Boolean(errors.groupName && touched.groupName)}
                  invalidText={errors.groupName}
                />
              </div>
              {isEdit ? (
                <>
                  <RenderEditMembersInGroup title="Group members" members={values.approvers} isRemove />
                  <RenderEditMembersInGroup title="Team members not in this group" members={eligibleMembers} />
                </>
              ) : (
                <RenderMembersList
                  members={sortedTeamMembers ?? []}
                  approvers={values.approvers}
                  setFieldValue={setFieldValue}
                />
              )}
              {hasError && <InlineNotification lowContrast kind="error" subtitle={subtitle} title={title} />}
            </ModalBody>
            <ModalFooter>
              <Button kind="secondary" type="button" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid || loading || !dirty}>
                {hasError ? "Try Again" : buttonText}
              </Button>
            </ModalFooter>
          </ModalFlowForm>
        );
      }}
    </Formik>
  );
}

export default CreateEditGroupModalContent;
