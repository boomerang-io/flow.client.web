//@ts-nocheck
import React from "react";
import PropTypes from "prop-types";
import { isCancel } from "axios";
import { useMutation } from "react-query";
import { notify, ToastNotification, Button, ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import AddTaskTemplateForm from "./AddTaskTemplateForm";
import { resolver } from "Config/servicesConfig";
import { appLink } from "Config/appConfig";
import { Add16 } from "@carbon/icons-react";
import styles from "./addTaskTemplate.module.scss";

AddTaskTemplate.propTypes = {
  addTemplateInState: PropTypes.func.isRequired,
  taskTemplates: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

function AddTaskTemplate({ addTemplateInState, taskTemplates, history, location }) {
  const cancelRequestRef = React.useRef();

  const { mutateAsync: CreateTaskTemplateMutation, isLoading } = useMutation((args) => {
    const { promise, cancel } = resolver.postCreateTaskTemplate(args);
    cancelRequestRef.current = cancel;
    return promise;
  });

  const handleAddTaskTemplate = async ({ body, closeModal }) => {
    try {
      let response = await CreateTaskTemplateMutation({ body });
      notify(
        <ToastNotification
          kind="success"
          subtitle="Successfully created task template"
          title="Update Task Template"
          data-testid="create-task-template-notification"
        />
      );
      addTemplateInState(response.data);
      history.push(
        appLink.manageTaskTemplateEdit({ taskId: response.data.id, version: 1, teamId: response.data.flowTeamId })
      );
      closeModal();
    } catch (err) {
      if (!isCancel(err)) {
        let errorTitle = err.toString();
        let subTitle = "";
        const { data } = err && err.response;
        if (data && data.status && data.error) {
          errorTitle = data.status + " - " + data.error;
        }
        if (data && data.message) {
          subTitle = data.message;
        }
        notify(
          <ToastNotification
            kind="error"
            title={errorTitle}
            subtitle={subTitle}
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
        <Button iconDescription="Add task template" onClick={openModal} size="field" kind="ghost" renderIcon={Add16}>
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
          taskTemplates={taskTemplates}
          closeModal={closeModal}
        />
      )}
    </ComposedModal>
  );
}

export default AddTaskTemplate;
