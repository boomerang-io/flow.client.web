import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { ComposedModal, ToastNotification, notify } from "@boomerang-io/carbon-addons-boomerang-react";
import ScheduleManagerForm from "Components/ScheduleManagerForm";
import moment from "moment-timezone";
import { cronDayNumberMap } from "Utils/cronHelper";
import { resolver } from "Config/servicesConfig";
import { ComposedModalChildProps, ScheduleManagerFormInputs, ScheduleUnion, Workflow } from "Types";
import styles from "./ScheduleEditor.module.scss";

interface ScheduleEditorProps {
  getCalendarUrl: string;
  getSchedulesUrl: string;
  includeWorkflowDropdown?: boolean;
  isModalOpen: boolean;
  onCloseModal: () => void;
  schedule?: ScheduleUnion;
  workflow?: Workflow;
  workflowOptions?: Array<Workflow>;
}

function ScheduleEditor(props: ScheduleEditorProps) {
  const queryClient = useQueryClient();
  /**
   * Update schedule
   */
  const { mutateAsync: updateScheduleMutator, ...editScheduleMutation } = useMutation(resolver.patchSchedule, {});

  const handleUpdateSchedule = async (updatedSchedule: ScheduleUnion) => {
    if (props.schedule) {
      // intentionally don't catch error so it can be done by the ScheduleManagerForm
      await updateScheduleMutator({ body: updatedSchedule, scheduleId: props.schedule.id });
      notify(
        <ToastNotification
          kind="success"
          title={`Update Schedule`}
          subtitle={`Successfully updated schedule ${props.schedule.name} `}
        />
      );
      queryClient.invalidateQueries(props.getCalendarUrl);
      queryClient.invalidateQueries(props.getSchedulesUrl);
      return;
    }
  };

  const handleSubmit = async (values: ScheduleManagerFormInputs) => {
    const {
      id,
      name,
      description,
      cronSchedule,
      dateTime,
      labels,
      timezone,
      type,
      days,
      time,
      workflow,
      ...parameters
    } = values;

    let scheduleLabels: Record<string, string> = {};
    // if (values.labels.length) {
    //   scheduleLabels = values.labels.map((pair: string) => {
    //     const [key, value] = pair.split(":");
    //     return { key, value };
    //   });
    // }

    // Undo the namespacing of parameter keys and add to parameter object
    const resetParameters: { [key: string]: any } = {};
    Object.keys(parameters).forEach((paramKey) => {
      resetParameters[paramKey.replace("$parameter:", "")] = parameters[paramKey];
    });

    const schedule: Partial<ScheduleUnion> = {
      description,
      name,
      type,
      labels: scheduleLabels,
      timezone: timezone.value,
      parameters: resetParameters,
      workflowRef: workflow.id || props.workflow?.id,
    };

    if (schedule.type === "runOnce") {
      const timeZoneDate = moment.tz(dateTime, timezone.value);
      schedule["dateSchedule"] = timeZoneDate.toISOString();
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

    return await handleUpdateSchedule(schedule as ScheduleUnion);
  };

  return (
    <ComposedModal
      isOpen={Boolean(props.isModalOpen)}
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
          handleSubmit={handleSubmit}
          isError={editScheduleMutation.isError}
          isLoading={editScheduleMutation.isLoading}
          includeWorkflowDropdown={props.includeWorkflowDropdown}
          modalProps={modalProps}
          schedule={props.schedule}
          type={"edit"}
          workflow={props.workflow || props.schedule?.workflow}
          workflowOptions={props.workflowOptions}
        />
      )}
    </ComposedModal>
  );
}

export default ScheduleEditor;
