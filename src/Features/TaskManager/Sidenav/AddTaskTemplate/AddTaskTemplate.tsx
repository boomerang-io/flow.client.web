//@ts-nocheck
import React from "react";
import { useMutation } from "react-query";
import { Button } from "@carbon/react";
import { notify, ToastNotification, ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import AddTaskTemplateForm from "./AddTaskTemplateForm";
import { resolver } from "Config/servicesConfig";
import { useQueryClient } from "react-query";
import { appLink } from "Config/appConfig";
import { Add } from "@carbon/react/icons";
import styles from "./addTaskTemplate.module.scss";

interface AddTaskTemplateProps {
  taskTemplateNames: Array<string>;
  history: History;
  getTaskTemplatesUrl: string;
  team?: FlowTeam;
}

function AddTaskTemplate({ taskTemplateNames, history, getTaskTemplatesUrl, team }: AddTaskTemplateProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitError, setIsSubmitError] = React.useState(false);

  const queryClient = useQueryClient();
  const createTaskTemplateMutation = useMutation(resolver.putApplyTaskTemplate);
  const createTaskTemplateYAMLMutation = useMutation(resolver.putApplyTaskTemplateYaml);

  const handleAddTaskTemplate = async ({ replace, body, closeModal }) => {
    setIsSubmitting(true);
    try {
      let response = await createTaskTemplateMutation.mutateAsync({ replace, team: team?.name, body });
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
        team
          ? appLink.manageTaskTemplateEdit({
              team: team.name,
              name: task.name,
              version: task.version.toString(),
            })
          : appLink.adminTaskTemplateDetail({
              name: task.name,
              version: task.version.toString(),
            })
      );
      closeModal();
    } catch (err) {
      setIsSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImportTaskTemplate = async ({ type, replace, body, closeModal }) => {
    setIsSubmitting(true);
    try {
      if (type === "application/json") {
        let response = await createTaskTemplateMutation.mutateAsync({ replace, team: team?.name, body });
      } else {
        let response = await createTaskTemplateYAMLMutation.mutateAsync({ replace, team: team?.name, body });
      }
      await queryClient.invalidateQueries(getTaskTemplatesUrl);
      notify(
        <ToastNotification
          kind="success"
          subtitle="Successfully imported task template"
          title={`Task Template ${response.data.displayName} imported`}
          data-testid="import-task-template-notification"
        />
      );
      history.push(
        team
          ? appLink.manageTaskTemplateEdit({
              team: team.name,
              name: task.name,
              version: task.version.toString(),
            })
          : appLink.adminTaskTemplateDetail({
              name: task.name,
              version: task.version.toString(),
            })
      );
      closeModal();
    } catch (err) {
      setIsSubmitError(true);
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
      modalHeaderProps={{
        title: "Add a new task",
        subtitle: "Get started from scratch with these basics, or import a file to auto-populate these fields.",
      }}
    >
      {({ closeModal }) => (
        <AddTaskTemplateForm
          handleAddTaskTemplate={handleAddTaskTemplate}
          handleImportTaskTemplate={handleImportTaskTemplate}
          isSubmitting={isSubmitting}
          createError={createTaskTemplateMutation.error || isSubmitError}
          taskTemplateNames={taskTemplateNames}
          closeModal={closeModal}
        />
      )}
    </ComposedModal>
  );
}

export default AddTaskTemplate;
