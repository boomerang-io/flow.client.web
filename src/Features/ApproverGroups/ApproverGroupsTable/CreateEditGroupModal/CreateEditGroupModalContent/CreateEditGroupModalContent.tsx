import React from "react";
import { useMutation, queryCache, useQuery } from "react-query";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import sortBy from "lodash/sortBy";
import matchSorter from "match-sorter";
import {
  Button,
  Checkbox,
  ErrorMessage,
  InlineNotification,
  Loading,
  ModalBody,
  ModalFooter,
  ModalFlowForm,
  notify,
  Search,
  TextInput,
  ToastNotification,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { formatErrorMessage, isAccessibleEvent } from "@boomerang-io/utils";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { AddAlt16, SubtractAlt16 } from "@carbon/icons-react";
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
        keys: ["userName", "userEmail"],
      })
    : members;
  const filteredMembersIds = filteredMembers.map((member: Approver) => member.userId);
  const currentApproversIds = approvers.map((approver: Approver) => approver.userId);
  const allMembersChecked =
    filteredMembers.length !== 0 &&
    filteredMembers.length ===
      filteredMembers.filter((member: Approver) => currentApproversIds.includes(member.userId)).length;

  const handleSelectAllMembers = () => {
    if (!allMembersChecked) {
      setFieldValue("approvers", [
        ...approvers,
        ...filteredMembers.filter((member: Approver) => !currentApproversIds.includes(member.userId)),
      ]);
    } else
      setFieldValue(
        "approvers",
        approvers.filter((approver: Approver) => !filteredMembersIds.includes(approver.userId))
      );
  };

  const handleSelectMember = ({ member, arrayHelpers }: { member: Approver; arrayHelpers: any }) => {
    const memberIndex = approvers.findIndex((approver) => approver.userId === member.userId);
    if (memberIndex >= 0) arrayHelpers.remove(memberIndex);
    else arrayHelpers.push({ ...member });
  };

  return (
    <div>
      <div className={styles.divider} />
      <Search
        labelText="member search"
        id="member-search"
        placeHolderText="Search for Team Members by name or email"
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
                  id={member.userId}
                  labelText={member.userName}
                  checked={currentApproversIds.includes(member.userId)}
                  className={styles.userName}
                  onChange={() => handleSelectMember({ member, arrayHelpers })}
                />
                <p className={styles.userEmail}>{member.userEmail}</p>
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
  const determineMemberIndex = (userId: string) => members.findIndex((approver) => approver.userId === userId);
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
                    <p className={styles.userName}>{member.userName}</p>
                    <p className={styles.userEmail}>{member.userEmail}</p>
                  </div>
                  {isRemove ? (
                    <div
                      role="button"
                      onClick={() => arrayHelpers.remove(determineMemberIndex(member.userId))}
                      onKeyDown={(e: any) =>
                        isAccessibleEvent(e) && arrayHelpers.remove(determineMemberIndex(member.userId))
                      }
                      tabIndex={0}
                    >
                      <SubtractAlt16 className={styles.actionIcon} />
                    </div>
                  ) : (
                    <div
                      role="button"
                      onClick={() => arrayHelpers.push(member)}
                      onKeyDown={(e: any) => isAccessibleEvent(e) && arrayHelpers.push(member)}
                      tabIndex={0}
                    >
                      <AddAlt16 className={styles.actionIcon} />
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
  // teams: FlowTeam[];
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
  const flowTeamUsersUrl = serviceUrl.getFlowTeamUsers({ teamId: team?.id });

  const { data: teamMembers, isLoading: teamMembersIsLoading, error: teamMembersError } = useQuery({
    queryKey: flowTeamUsersUrl,
    queryFn: resolver.query(flowTeamUsersUrl),
    config: { enabled: team?.id },
  });

  const approverGroupsUrl = serviceUrl.resourceApproverGroups({ teamId: team?.id, groupId: undefined });

  /** Add Approver Group */
  const [addTeamApproverGroupMutation, { isLoading: addIsLoading, error: addError }] = useMutation(
    (args: { teamId: string | undefined; body: ApproverGroup }) => {
      const { promise, cancel } = resolver.postApproverGroupRequest(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryCache.invalidateQueries(approverGroupsUrl),
    }
  );

  /** Update Approver Group */
  const [updateTeamApproverGroupMutation, { isLoading: updateIsLoading, error: updateError }] = useMutation(
    (args: { teamId: string | undefined; body: ApproverGroup }) => {
      const { promise, cancel } = resolver.putApproverGroupRequest(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryCache.invalidateQueries(approverGroupsUrl),
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
    const newTeamApproverGroup = isEdit ? { ...values, groupId: approverGroup?.groupId } : { ...values };

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
        groupName: approverGroup && approverGroup.groupName ? approverGroup.groupName : "",
        approvers: approverGroup && approverGroup.approvers ? sortBy(approverGroup.approvers, ["userName"]) : [],
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
        const {
          dirty,
          values,
          touched,
          errors,
          isValid,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        } = props;
        const currentGroupMembersIds = values.approvers.map((approver) => approver.userId);
        const sortedTeamMembers = sortBy(teamMembers, ["userName"]);
        const eligibleMembers = teamMembers
          ? sortedTeamMembers.filter((teamMember) => !currentGroupMembersIds.includes(teamMember.userId))
          : [];

        return (
          <ModalFlowForm onSubmit={handleSubmit}>
            {(loading || teamMembersIsLoading) && <Loading />}
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
                  invalid={errors.groupName && touched.groupName}
                  invalidText={errors.groupName}
                />
              </div>
              {Boolean(teamMembersError) ? (
                <ErrorMessage />
              ) : isEdit ? (
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
              <Button type="submit" disabled={!isValid || loading || !dirty || Boolean(teamMembersError)}>
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
