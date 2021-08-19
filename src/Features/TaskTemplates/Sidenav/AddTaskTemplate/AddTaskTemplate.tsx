//@ts-nocheck
import React from "react";
import { isCancel } from "axios";
import { useMutation } from "react-query";
import { notify, ToastNotification, Button, ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import AddTaskTemplateForm from "./AddTaskTemplateForm";
import { resolver } from "Config/servicesConfig";
import { appLink } from "Config/appConfig";
import { TaskModel } from "Types";
import { Add16 } from "@carbon/icons-react";
import styles from "./addTaskTemplate.module.scss";

interface AddTaskTemplateProps {
  addTemplateInState: Function,
  isAdmin: boolean,
  taskTemplates: TaskModel[],
  history: any,
};

const AddTaskTemplate: React.FC<AddTaskTemplateProps> = ({ addTemplateInState, isAdmin, taskTemplates, history }) => {
  const cancelRequestRef = React.useRef();

  const [CreateTaskTemplateMutation, { isLoading }] = useMutation((args) => {
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
      if(isAdmin) {
        history.push(appLink.taskTemplateEdit({ id: response.data.id, version: 1 }));
      } else {
        history.push(
          appLink.manageTaskTemplateEdit({ taskId: response.data.id, version: 1, teamId: response.data.flowTeamId })
        );
      }
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
          isAdmin={isAdmin}
          taskTemplates={taskTemplates}
          closeModal={closeModal}
        />
      )}
    </ComposedModal>
  );
}

export default AddTaskTemplate;
