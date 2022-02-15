// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useMutation, queryCache } from "react-query";
import {
  Button,
  Loading,
  ModalBody,
  ModalFooter,
  ModalFlowForm,
  notify,
  RadioButton,
  RadioButtonGroup,
  ToastNotification,
  InlineNotification,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { UserType, UserTypeCopy } from "Constants";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { FlowUser } from "Types";
import styles from "./ChangeRole.module.scss";

interface ChangeRoleProps {
  cancelRequestRef: object;
  closeModal: () => void;
  user: FlowUser | undefined;
}

// used to avoid id collisions
const ROLE_PREFIX = "platform-role-";

const rolesList = [
  { name: UserTypeCopy[UserType.Admin], id: UserType.Admin },
  { name: UserTypeCopy[UserType.User], id: UserType.User },
];

const ChangeRole: React.FC<ChangeRoleProps> = ({ cancelRequestRef, closeModal, user }) => {
  const location = useLocation();
  const role = user?.type;
  const [selectedRole, setSelectedRole] = useState(null);
  const [error, setError] = useState();

  useEffect(() => {
    setSelectedRole(role);
  }, [role]);

  const [changeUserMutator, { isLoading }] = useMutation(
    (args) => {
      const { promise, cancel } = resolver.patchManageUser(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => {
        closeModal();
        queryCache.invalidateQueries(serviceUrl.getManageUsers({ query: location.search }));
      },
    }
  );

  const handleOnSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    changeRoleConfirmed();
  };

  const changeRoleConfirmed = async () => {
    const { name } = user;
    const request = {
      type: selectedRole,
    };

    try {
      await changeUserMutator({ body: request, userId: user.id });
      notify(
        <ToastNotification
          kind="success"
          title="Role Changed"
          subtitle={`Platform role for ${name} is updated to ${selectedRole}`}
        />
      );
    } catch (error) {
      if (!axios.isCancel(error)) {
        setError({ title: "Something's Wrong", subtitle: `Request to change ${name}'s platform role failed` });
      }
    }
  };

  return (
    <ModalFlowForm onSubmit={handleOnSubmit}>
      <ModalBody>
        {isLoading && <Loading />}
        <div className={styles.gridContainer}>
          <RadioButtonGroup
            labelPosition="right"
            name="platform-role"
            onChange={setSelectedRole}
            orientation="vertical"
            valueSelected={selectedRole}
          >
            {rolesList.map((option) => (
              <RadioButton
                key={option.id}
                id={`${ROLE_PREFIX}${option.id}`}
                labelText={option.name}
                value={option.id}
              />
            ))}
          </RadioButtonGroup>
        </div>
        {error && <InlineNotification lowContrast kind="error" {...error} />}
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          Cancel
        </Button>
        <Button type="submit" disabled={role === selectedRole || isLoading}>
          {isLoading ? "Updating..." : error ? "Try again" : "Submit"}
        </Button>
      </ModalFooter>
    </ModalFlowForm>
  );
};

export default ChangeRole;
