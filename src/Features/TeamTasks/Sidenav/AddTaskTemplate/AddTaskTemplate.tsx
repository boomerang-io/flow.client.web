//@ts-nocheck
import React from "react";
import { isCancel } from "axios";
import { useMutation } from "react-query";
import { Button } from "@carbon/react";
import { notify, ToastNotification, ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import AddTaskTemplateForm from "./AddTaskTemplateForm";
import { resolver } from "Config/servicesConfig";
import { useAppContext } from "Hooks";
import { useQueryClient } from "react-query";
import { appLink } from "Config/appConfig";
import { Add } from "@carbon/react/icons";
import styles from "./addTaskTemplate.module.scss";

interface AddTaskTemplateProps {
  taskTemplateNames: Array<string>;
  history: History;
  getTaskTemplatesUrl: string;
}

function AddTaskTemplate({ taskTemplateNames, history, getTaskTemplatesUrl }: AddTaskTemplateProps) {
  const { activeTeam } = useAppContext();
  const queryClient = useQueryClient();
  const cancelRequestRef = React.useRef();

  const { mutateAsync: createTaskTemplateMutation, isLoading } = useMutation((args) => {
    const { promise, cancel } = resolver.putCreateTaskTemplate(args);
    cancelRequestRef.current = cancel;
    return promise;
  });

  const handleAddTaskTemplate = async ({ replace, body, closeModal }) => {
    try {
      let response = await createTaskTemplateMutation({ replace, team: activeTeam.id, body });
      notify(
        <ToastNotification
          kind="success"
          subtitle="Successfully created task template"
          title="Update Task Template"
          data-testid="create-task-template-notification"
        />
      );
      console.log(response);
      await queryClient.invalidateQueries(getTaskTemplatesUrl);
      history.push(appLink.manageTaskTemplateEdit({ name: response.data.name, version: 1, teamId: activeTeam.id }));
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
