import React from "react";
import PropTypes from "prop-types";
import { isCancel } from "axios";
import { useMutation } from "react-query";
import { notify, ToastNotification, Button, ComposedModal } from "@boomerang/carbon-addons-boomerang-react";
import AddTaskTemplateForm from "./AddTaskTemplateForm";
import { resolver } from "Config/servicesConfig";
import { appLink } from "Config/appConfig";
import { Add16 } from "@carbon/icons-react";
import { QueryStatus } from "Constants/reactQueryStatuses";
import styles from "./addTaskTemplate.module.scss";

AddTaskTemplate.propTypes = {
  addTemplateInState: PropTypes.func.isRequired,
  taskTemplates: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

function AddTaskTemplate({ addTemplateInState, taskTemplates, history, location }) {
  const cancelRequestRef = React.useRef();

  const [CreateTaskTemplateMutation, { status }] = useMutation(args => {
    const { promise, cancel } = resolver.postCreateTaskTemplate(args);
    cancelRequestRef.current = cancel;
    return promise;
  });
  const isLoading = status === QueryStatus.Loading;

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
      history.push(appLink.taskTemplateEdit({ id: response.data.id, version: 1 }));
      closeModal();
    } catch (err) {
      if (!isCancel(err)) {
        console.log("AXIOS Error :-S", err);
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
        children: "Your request will not be saved"
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
        subtitle: "Import a task file to auto-populate these fields, or start from scratch. All fields are required."
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
