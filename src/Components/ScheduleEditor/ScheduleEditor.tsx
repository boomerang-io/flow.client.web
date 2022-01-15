import React from "react";
import { useMutation, queryCache } from "react-query";
import { ComposedModal, ToastNotification, notify } from "@boomerang-io/carbon-addons-boomerang-react";
import ScheduleManagerForm from "Components/ScheduleManagerForm";
import { resolver } from "Config/servicesConfig";
import { ComposedModalChildProps, ScheduleManagerFormInputs, ScheduleUnion, WorkflowSummary } from "Types";
import styles from "./ScheduleEditor.module.scss";

interface ScheduleEditorProps {
  isModalOpen: boolean;
  onCloseModal: () => void;
  schedule?: ScheduleUnion;
  workflowScheduleUrl: string;
  workflowCalendarUrl: string;
  workflow: WorkflowSummary;
}

function ScheduleEditor(props: ScheduleEditorProps) {
  /**
   * Update schedule
   */
  const [updateScheduleMutator, { isLoading: updateScheduleIsLoading }] = useMutation(resolver.patchSchedule, {});

  const handleUpdateSchedule = async (updatedSchedule: ScheduleUnion) => {
    if (props.schedule) {
      try {
        await updateScheduleMutator({ body: updatedSchedule, scheduleId: props.schedule.id });
        notify(
          <ToastNotification
            kind="success"
            title={`Updated Schedule`}
            subtitle={`Successfully updated schedule ${props.schedule.name} `}
          />
        );
        queryCache.invalidateQueries(props.workflowScheduleUrl);
        queryCache.invalidateQueries(props.workflowCalendarUrl);
      } catch (e) {
        notify(
          <ToastNotification
            kind="error"
            title="Something's Wrong"
            subtitle={`Request to update schedule ${props.schedule.name} failed`}
          />
        );
        return;
      }
    }
  };

  const handleSubmit = async (values: ScheduleManagerFormInputs) => {
    const { id, name, description, cronSchedule, dateTime, labels, timezone, type, days, time, ...parameters } = values;

    let scheduleLabels: Array<{ key: string; value: string }> = [];
    if (values.labels.length) {
      scheduleLabels = values.labels.map((pair: string) => {
        const [key, value] = pair.split(":");
        return { key, value };
      });
    }
    let scheduleType = type;
    const schedule: Partial<ScheduleUnion> = {
      name,
      description,
      type: scheduleType,
      timezone: timezone.value,
      labels: scheduleLabels,
      parameters,
    };

    if (schedule.type === "runOnce") {
      schedule["dateSchedule"] = new Date(dateTime).toISOString();
    }

    if (schedule.type === "cron") {
      let daysCron: Array<string> | [] = [];
      Object.values(days).forEach((day) => {
        //@ts-ignore
        daysCron.push(cronDayNumberMap[day]);
      });
      const timeCron = !time ? ["0", "0"] : time.split(":");
      const cronSchedule = `0 ${timeCron[1]} ${timeCron[0]} ? * ${daysCron.length !== 0 ? daysCron.toString() : "*"}`;
      schedule["cronSchedule"] = cronSchedule;
    }

    if (schedule.type === "advancedCron") {
      schedule["cronSchedule"] = cronSchedule;
    }

    await handleUpdateSchedule(schedule as ScheduleUnion);
  };

  return (
    <ComposedModal
      isOpen={props.isModalOpen}
      onCloseModal={props.onCloseModal}
      composedModalProps={{
        containerClassName: styles.modalContainer,
      }}
      modalHeaderProps={{
        title: "Edit a Schedule",
      }}
    >
      {(modalProps: ComposedModalChildProps) => (
        <ScheduleManagerForm
          isLoading={updateScheduleIsLoading}
          handleSubmit={handleSubmit}
          modalProps={modalProps}
          parameters={props.workflow.properties}
          schedule={props.schedule}
          type={"edit"}
        />
      )}
    </ComposedModal>
  );
}

export default ScheduleEditor;
