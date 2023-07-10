//@ts-nocheck
import React from "react";
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
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { activeTeam } = useAppContext();
  const queryClient = useQueryClient();
  const cancelRequestRef = React.useRef();

  const createTaskTemplateMutation = useMutation(resolver.putApplyTaskTemplate);

  const handleAddTaskTemplate = async ({ replace, body, closeModal }) => {
    setIsSubmitting(true);
    try {
      let response = await createTaskTemplateMutation.mutateAsync({ replace, team: activeTeam.id, body });
      await queryClient.invalidateQueries(getTaskTemplatesUrl);
      notify(
        <ToastNotification
          kind="success"
          subtitle="Successfully created task template"
          title={`Task Template ${response.data.displayName} created`}
          data-testid="create-task-template-notification"
        />
      );
      history.push(
        appLink.manageTaskTemplateEdit({
          name: response.data.name,
          version: response.data.version,
          teamId: activeTeam.id,
        })
      );
      closeModal();
    } catch (err) {
      // no-op
    } finally {
      setIsSubmitting(false);
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
          isSubmitting={isSubmitting}
          createError={createTaskTemplateMutation.error}
          taskTemplateNames={taskTemplateNames}
          closeModal={closeModal}
        />
      )}
    </ComposedModal>
  );
}

export default AddTaskTemplate;
