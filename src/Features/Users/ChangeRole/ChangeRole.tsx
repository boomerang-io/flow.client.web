// @ts-nocheck
import React, { useState } from "react";
import axios from "axios";
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

import { serviceUrl, resolver } from "Config/servicesConfig";
import { FlowUser } from "Types";
import styles from "./ChangeRole.module.scss";

interface ChangeRoleProps {
  cancelRequestRef?: object;
  closeModal: () => void;
  roles?: string[];
  role?: string;
  user: FlowUser | undefined;
}

// used to avoid id collisions
const ROLE_PREFIX = "platform-role-";

const ChangeRole: React.FC<ChangeRoleProps> = ({ cancelRequestRef, closeModal, roles, role, user }) => {
  const [selectedRole, setSelectedRole] = useState(role);
  const [error, setError] = useState();

  const [changeUserMutator, { isLoading }] = useMutation(
    (args) => {
      const { promise, cancel } = resolver.patchUser(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryCache.invalidateQueries(serviceUrl.getUsers({ userId: user.id })),
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
      closeModal();
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
            {roles.map((option) => (
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
          {isLoading ? "Submitting..." : error ? "Try again" : "Submit"}
        </Button>
      </ModalFooter>
    </ModalFlowForm>
  );
};

export default ChangeRole;
