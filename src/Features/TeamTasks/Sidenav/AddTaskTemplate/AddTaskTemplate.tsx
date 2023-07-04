//@ts-nocheck
import React from "react";
import PropTypes from "prop-types";
import { isCancel } from "axios";
import { useMutation } from "react-query";
import { Button } from "@carbon/react";
import { notify, ToastNotification, ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import AddTaskTemplateForm from "./AddTaskTemplateForm";
import { resolver } from "Config/servicesConfig";
import { appLink } from "Config/appConfig";
import { Add } from "@carbon/react/icons";
import styles from "./addTaskTemplate.module.scss";

AddTaskTemplate.propTypes = {
  addTemplateInState: PropTypes.func.isRequired,
  taskTemplateNames: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

function AddTaskTemplate({ addTemplateInState, taskTemplateNames, history, location }) {
  const cancelRequestRef = React.useRef();

  const { mutateAsync: CreateTaskTemplateMutation, isLoading } = useMutation((args) => {
    const { promise, cancel } = resolver.putCreateTaskTemplate(args);
    cancelRequestRef.current = cancel;
    return promise;
  });

  const handleAddTaskTemplate = async ({ replace, team, body, closeModal }) => {
    try {
      let response = await CreateTaskTemplateMutation({ replace, team, body });
      notify(
        <ToastNotification
          kind="success"
          subtitle="Successfully created task template"
          title="Update Task Template"
          data-testid="create-task-template-notification"
        />
      );
      addTemplateInState(response.data);
      history.push(appLink.manageTaskTemplateEdit({ name: response.data.name, version: 1, teamId: team }));
      closeModal();
    } catch (err) {
      if (!isCancel(err)) {
        const { data } = err && err.response;
        notify(
          <ToastNotification
            kind="error"
            title={`${data.status} - ${data.error}`}
            subtitle={data.message}
            data-testid="create-task-template-notification"
          />
        );
      }
    }
  };
  return (
    <ComposedModal
      composedModalProps={{ containerClassName: styles.modalContainer }}
      confirmModalProps={{
        title: "Close this?",
        children: "Your request will not be saved",
      }}
      modalTrigger={({ openModal }) => (
        <Button iconDescription="Add task template" onClick={openModal} size="sm" kind="ghost" renderIcon={Add}>
          Add a new task
        </Button>
      )}
      onCloseModal={() => {
        if (cancelRequestRef.current) cancelRequestRef.current();
      }}
      modalHeaderProps={{
        title: "Add a new task",
        subtitle: "Import a task file to auto-populate these fields, or start from scratch.",
      }}
    >
      {({ closeModal }) => (
        <AddTaskTemplateForm
          handleAddTaskTemplate={handleAddTaskTemplate}
          isLoading={isLoading}
          taskTemplateNames={taskTemplateNames}
          closeModal={closeModal}
        />
      )}
    </ComposedModal>
  );
}

export default AddTaskTemplate;
