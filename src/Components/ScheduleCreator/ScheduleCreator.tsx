import React from "react";
import { useMutation, queryCache } from "react-query";
import { ComposedModal, ToastNotification, notify } from "@boomerang-io/carbon-addons-boomerang-react";
import ScheduleManagerForm from "Components/ScheduleManagerForm";
import moment from "moment-timezone";
import { cronDayNumberMap } from "Utils/cronHelper";
import { resolver } from "Config/servicesConfig";
import {
  ComposedModalChildProps,
  ScheduleManagerFormInputs,
  ScheduleDate,
  ScheduleUnion,
  WorkflowSummary,
  DayOfWeekCronAbbreviation,
} from "Types";
import styles from "./ScheduleCreator.module.scss";

interface CreateScheduleProps {
  getCalendarUrl: string;
  getSchedulesUrl: string;
  includeWorkflowDropdown?: boolean;
  isModalOpen: boolean;
  onCloseModal: () => void;
  schedule?: Pick<ScheduleDate, "dateSchedule" | "type">;
  workflow?: WorkflowSummary;
  workflowOptions?: Array<WorkflowSummary>;
}

export default function CreateSchedule(props: CreateScheduleProps) {
  /**
   * Create schedule
   */
  const [createScheduleMutator, createScheduleMutation] = useMutation(resolver.postSchedule, {});

  const handleCreateSchedule = async (schedule: ScheduleUnion) => {
    // intentionally don't handle error so it can be done by the ScheduleManagerForm
    await createScheduleMutator({ body: schedule });
    notify(
      <ToastNotification
        kind="success"
        title={`Create Schedule`}
        subtitle={`Successfully created schedule ${schedule.name} `}
      />
    );
    queryCache.invalidateQueries(props.getCalendarUrl);
    queryCache.invalidateQueries(props.getSchedulesUrl);
    return;
  };

  const handleSubmit = async (values: ScheduleManagerFormInputs) => {
    const {
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
      workflowId: workflow.id,
    };

    if (schedule.type === "runOnce") {
      const timeZoneDate = moment.tz(dateTime, timezone.value);
      schedule["dateSchedule"] = timeZoneDate.toISOString();
    }

    if (schedule.type === "cron") {
      let daysCron: Array<DayOfWeekCronAbbreviation> = [];
      for (let day of Object.values(days)) {
        daysCron.push(cronDayNumberMap[day]);
      }
      const timeCron = !time ? ["0", "0"] : time.split(":");
      const cronSchedule = `0 ${timeCron[1]} ${timeCron[0]} ? * ${daysCron.length !== 0 ? daysCron.toString() : "*"}`;
      schedule["cronSchedule"] = cronSchedule;
    }

    if (schedule.type === "advancedCron") {
      schedule["cronSchedule"] = cronSchedule;
    }

    return await handleCreateSchedule(schedule as ScheduleUnion);
  };

  return (
    <ComposedModal
      isOpen={props.isModalOpen}
      onCloseModal={props.onCloseModal}
      composedModalProps={{
        containerClassName: styles.modalContainer,
      }}
      modalHeaderProps={{
        title: "Create a Schedule",
      }}
    >
      {(modalProps: ComposedModalChildProps) => (
        <ScheduleManagerForm
          handleSubmit={handleSubmit}
          includeWorkflowDropdown={props.includeWorkflowDropdown}
          isError={createScheduleMutation.isError}
          isLoading={createScheduleMutation.isLoading}
          modalProps={modalProps}
          schedule={props.schedule as ScheduleUnion}
          type="create"
          workflow={props.workflow}
          workflowOptions={props.workflowOptions}
        />
      )}
    </ComposedModal>
  );
}
