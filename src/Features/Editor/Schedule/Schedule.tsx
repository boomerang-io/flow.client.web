import React from "react";
import {
  Button,
  ConfirmModal,
  ComposedModal,
  CodeSnippet,
  Creatable,
  ComboBox,
  DynamicFormik,
  ModalBody,
  ModalForm,
  ModalFooter,
  MultiSelect,
  Error,
  Loading,
  OverflowMenu,
  OverflowMenuItem,
  RadioButtonGroup,
  RadioButton,
  Search,
  Tag,
  TextArea,
  TextInput,
  Tile,
  TooltipHover,
  ToastNotification,
  notify,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { Add16, CircleFilled16, SettingsAdjust16, RadioButton16, Repeat16, RepeatOne16 } from "@carbon/icons-react";
import { useQuery, useMutation, queryCache } from "react-query";
import CronJobConfig from "./CronJobConfig";
import Calendar from "Components/Calendar";
import matchSorter from "match-sorter";
import moment from "moment-timezone";
import SlidingPane from "react-sliding-pane";
import queryString from "query-string";
import { queryStringOptions } from "Config/appConfig";
import { cronToDateTime, cronDayNumberMap } from "Utils/cronHelper";
import { DATE_TIME_LOCAL_INPUT_FORMAT, defaultTimeZone, timezoneOptions, transformTimeZone } from "Utils/dateHelper";
import cronstrue from "cronstrue";
import { scheduleStatusOptions, statusLabelMap } from "Features/Schedule";
import { serviceUrl, resolver } from "Config/servicesConfig";
import * as Yup from "yup";
import {
  CalendarEvent,
  ComposedModalChildProps,
  ScheduleCalendar,
  ScheduleType,
  ScheduleUnion,
  WorkflowSummary,
} from "Types";
import "react-sliding-pane/dist/react-sliding-pane.css";
import styles from "./Schedule.module.scss";

interface ScheduleProps {
  summaryData: WorkflowSummary;
}

export default function ScheduleView(props: ScheduleProps) {
  const [activeSchedule, setActiveSchedule] = React.useState<ScheduleUnion | undefined>();
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [isCreatorOpen, setIsCreatorOpen] = React.useState(false);
  const [fromDate, setFromDate] = React.useState(moment().startOf("month").unix());
  const [toDate, setToDate] = React.useState(moment().endOf("month").unix());

  /**
   * Get the schedules for the workflow
   * A schedule is an object that defines the events
   */

  const workflowScheduleUrl = serviceUrl.getWorkflowSchedules({ workflowId: props.summaryData.id });

  const workflowSchedulesQuery = useQuery<Array<ScheduleUnion>, string>({
    queryKey: workflowScheduleUrl,
    queryFn: resolver.query(workflowScheduleUrl),
  });

  /**
   * Get the calendar for the workflow
   * A "calendar" is the scheduled events that are well scheduled to occur
   * in a given time frame. We default to fetching the calendar for the current month
   */
  const workflowCalendarUrlQuery = queryString.stringify(
    {
      fromDate: fromDate,
      toDate: toDate,
    },
    { ...queryStringOptions, encode: false }
  );

  const workflowCalendarUrl = serviceUrl.getWorkflowSchedulesCalendar({
    workflowId: props.summaryData.id,
    query: workflowCalendarUrlQuery,
  });

  const workflowCalendarQuery = useQuery<Array<ScheduleCalendar>, string>({
    queryKey: workflowCalendarUrl,
    queryFn: resolver.query(workflowCalendarUrl),
  });

  const handleDateRangeChange = (dateInfo: any) => {
    const fromDate = moment(dateInfo.start).unix();
    const toDate = moment(dateInfo.end).unix();
    setFromDate(fromDate);
    setToDate(toDate);
  };

  /**
   * Start rendering
   */

  if (!workflowSchedulesQuery.data) {
    return <Loading />;
  }

  if (workflowSchedulesQuery.error) {
    return <Error />;
  }

  const schedules = workflowSchedulesQuery.data;

  return (
    <>
      <div className={styles.container}>
        <ScheduleList
          schedules={schedules}
          setActiveSchedule={setActiveSchedule}
          setIsEditorOpen={setIsEditorOpen}
          setIsCreatorOpen={setIsCreatorOpen}
          workflow={props.summaryData}
          workflowCalendarUrl={workflowCalendarUrl}
          workflowScheduleUrl={workflowScheduleUrl}
        />
        <CalendarView
          onDateRangeChange={handleDateRangeChange}
          setActiveSchedule={setActiveSchedule}
          setIsCreatorOpen={setIsCreatorOpen}
          setIsEditorOpen={setIsEditorOpen}
          setIsPanelOpen={setIsPanelOpen}
          workflowSchedules={workflowSchedulesQuery.data}
          workflowCalendarData={workflowCalendarQuery.data}
        />
      </div>
      <EditorPanel
        event={activeSchedule}
        isOpen={isPanelOpen}
        setIsOpen={setIsPanelOpen}
        setIsEditorOpen={setIsEditorOpen}
      />
      <CreateSchedule
        isModalOpen={isCreatorOpen}
        onCloseModal={() => setIsCreatorOpen(false)}
        workflow={props.summaryData}
        workflowScheduleUrl={workflowScheduleUrl}
        workflowCalendarUrl={workflowCalendarUrl}
      />
      <EditSchedule
        isModalOpen={isEditorOpen}
        onCloseModal={() => setIsEditorOpen(false)}
        schedule={activeSchedule}
        workflowScheduleUrl={workflowScheduleUrl}
        workflowCalendarUrl={workflowCalendarUrl}
        workflow={props.summaryData}
      />
    </>
  );
}

interface CalendarViewProps {
  onDateRangeChange: (dateInfo: any) => void;
  setActiveSchedule: React.Dispatch<React.SetStateAction<ScheduleUnion | undefined>>;
  setIsCreatorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  workflowCalendarData?: Array<ScheduleCalendar>;
  workflowSchedules: Array<ScheduleUnion>;
}

function CalendarView(props: CalendarViewProps) {
  const calendarEvents: Array<CalendarEvent> = [];
  if (props.workflowCalendarData && props.workflowSchedules) {
    for (let calendarEntry of props.workflowCalendarData) {
      const matchingSchedule: ScheduleUnion | undefined = props.workflowSchedules.find(
        (schedule: ScheduleUnion) => schedule.id === calendarEntry.scheduleId
      );
      if (matchingSchedule) {
        for (const date of calendarEntry.dates) {
          const newEntry = {
            resource: matchingSchedule,
            start: new Date(date),
            end: new Date(date),
            title: matchingSchedule.name,
          };
          calendarEvents.push(newEntry);
        }
      }
    }
  }

  return (
    <section className={styles.calendarContainer}>
      <Calendar
        onSelectEvent={(data: CalendarEvent) => {
          props.setIsPanelOpen(true);
          props.setActiveSchedule({ ...data.resource, nextScheduleDate: new Date(data.start).toISOString() });
        }}
        onRangeChange={props.onDateRangeChange}
        onSelectSlot={() => props.setIsCreatorOpen(true)}
        events={calendarEvents}
      />
    </section>
  );
}

interface ScheduleListProps {
  setActiveSchedule: React.Dispatch<React.SetStateAction<ScheduleUnion | undefined>>;
  setIsEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreatorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  schedules: Array<ScheduleUnion>;
  workflow: WorkflowSummary;
  workflowCalendarUrl: string;
  workflowScheduleUrl: string;
}

function ScheduleList(props: ScheduleListProps) {
  const [filterQuery, setFilterQuery] = React.useState("");
  const [selectedStatuses, setSelectedStatuses] = React.useState<Array<string>>([]);

  function renderLists() {
    if (props.schedules.length === 0) {
      return <div>No schedules found</div>;
    }

    const filteredSchedules = Boolean(filterQuery)
      ? matchSorter(props.schedules, filterQuery, {
          keys: ["name", "description", "type", "status"],
        })
      : props.schedules;

    const sortedSchedules = filteredSchedules.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    let selectedSchedules = sortedSchedules;
    if (selectedStatuses.length) {
      selectedSchedules = sortedSchedules.filter((schedule) => {
        return selectedStatuses.includes(schedule.status);
      });
    }

    if (selectedSchedules.length === 0) {
      return <div>No matching schedules found</div>;
    }

    return selectedSchedules.map((schedule) => (
      <ScheduledListItem
        key={schedule.id}
        schedule={schedule}
        setActiveSchedule={props.setActiveSchedule}
        setIsEditorOpen={props.setIsEditorOpen}
        workflow={props.workflow}
        workflowCalendarUrl={props.workflowCalendarUrl}
        workflowScheduleUrl={props.workflowScheduleUrl}
      />
    ));
  }

  return (
    <section className={styles.listContainer}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2>{`Existing Schedules (${props.schedules.length})`}</h2>
        <Button size="field" renderIcon={Add16} onClick={() => props.setIsCreatorOpen(true)} kind="ghost">
          Create a Schedule
        </Button>
      </div>
      <div style={{ display: "flex", alignItems: "end", gap: "0.5rem", width: "100%" }}>
        <div style={{ width: "50%" }}>
          <Search
            light
            id="schedules-filter"
            labelText="Filter schedules"
            placeHolderText="Search schedules"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterQuery(e.target.value)}
          />
        </div>
        <div style={{ width: "50%" }}>
          <MultiSelect
            light
            id="actions-statuses-select"
            label="Choose status(es)"
            placeholder="Choose status(es)"
            invalid={false}
            onChange={({ selectedItems }: any) => setSelectedStatuses(selectedItems.map((item: any) => item.value))}
            items={scheduleStatusOptions}
            selectedItem={selectedStatuses}
            titleText="Filter by status"
          />
        </div>
      </div>
      <ul>{renderLists()}</ul>
    </section>
  );
}

interface ScheduledListItemProps {
  setActiveSchedule: React.Dispatch<React.SetStateAction<ScheduleUnion | undefined>>;
  setIsEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  schedule: ScheduleUnion;
  workflowScheduleUrl: string;
  workflowCalendarUrl: string;
  workflow: WorkflowSummary;
}

function ScheduledListItem(props: ScheduledListItemProps) {
  const [isToggleStatusModalOpen, setIsToggleStatusModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  // Determine some things for rendering
  const isActive = props.schedule.status === "active";
  const labels = [];
  for (const entry of props.schedule?.labels || []) {
    labels.push(
      <Tag key={entry.key} style={{ marginLeft: 0 }} type="teal">
        {entry.key}:{entry.value}
      </Tag>
    );
  }
  const nextScheduledText = props.schedule.type === "runOnce" ? "Scheduled" : "Next Execution";
  const nextScheduleData = moment(props.schedule.nextScheduleDate).format("MMM DD, YYYY HH:mm");

  /**
   * Delete schedule
   */
  const [deleteScheduleMutator, deleteScheduleMutation] = useMutation(resolver.deleteSchedule, {});

  const handleDeleteSchedule = async () => {
    try {
      await deleteScheduleMutator({ scheduleId: props.schedule.id });
      notify(
        <ToastNotification
          kind="success"
          title={`Delete Schedule`}
          subtitle={`Successfully deleted schedule ${props.schedule.name}`}
        />
      );
      queryCache.invalidateQueries(props.workflowScheduleUrl);
      queryCache.invalidateQueries(props.workflowCalendarUrl);
    } catch (e) {
      notify(
        <ToastNotification
          kind="error"
          title="Something's Wrong"
          subtitle={`Request to delete schedule ${props.schedule.name} failed`}
        />
      );
      return;
    }
  };

  /**
   * Disable schedule
   */
  const [toggleScheduleStatusMutator, toggleStatusMutation] = useMutation(resolver.patchSchedule, {});

  const handleToggleStatus = async () => {
    const body = { ...props.schedule, status: isActive ? "inactive" : "active" };
    try {
      await toggleScheduleStatusMutator({ scheduleId: props.schedule.id, body });
      notify(
        <ToastNotification
          kind="success"
          title={`${isActive ? "Disable" : "Enable"} Schedule`}
          subtitle={`Successfully ${isActive ? "disabled" : "enabled"} schedule ${props.schedule.name} `}
        />
      );
      queryCache.invalidateQueries(props.workflowScheduleUrl);
      queryCache.invalidateQueries(props.workflowCalendarUrl);
    } catch (e) {
      notify(
        <ToastNotification
          kind="error"
          title="Something's Wrong"
          subtitle={`Request to ${isActive ? "disable" : "enable"} schedule ${props.schedule.name} failed`}
        />
      );
      return;
    }
  };

  // Set up the Oveflow menu options
  let menuOptions = [
    {
      itemText: "Edit",
      onClick: () => {
        props.setActiveSchedule(props.schedule);
        props.setIsEditorOpen(true);
      },
    },
    {
      itemText: isActive ? "Disable" : "Enable",
      onClick: () => setIsToggleStatusModalOpen(true),
    },
    {
      hasDivider: true,
      itemText: "Delete",
      isDelete: true,
      onClick: () => setIsDeleteModalOpen(true),
    },
  ];

  return (
    <li key={props.schedule.id}>
      <Tile className={styles.listItem}>
        <div className={styles.listItemTitle}>
          <h3 title={props.schedule.name}>{props.schedule.name}</h3>
          <TooltipHover direction="top" tooltipText={props.schedule.type === "runOnce" ? "Once" : "Recurring"}>
            {props.schedule.type === "runOnce" ? <RepeatOne16 /> : <Repeat16 />}
          </TooltipHover>
          <TooltipHover direction="top" tooltipText={statusLabelMap[props.schedule.status]}>
            {props.schedule.status === "inactive" ? (
              <RadioButton16 className={styles.statusCircle} data-status={props.schedule.status} />
            ) : (
              <CircleFilled16 className={styles.statusCircle} data-status={props.schedule.status} />
            )}
          </TooltipHover>
        </div>
        <p className={styles.listItemDescription}>{props.schedule?.description ?? "---"}</p>
        <dl style={{ display: "flex" }}>
          <div style={{ width: "50%" }}>
            <dt>{nextScheduledText}</dt>
            <dd>{nextScheduleData}</dd>
          </div>
          <div style={{ width: "50%" }}>
            <dt>Time Zone</dt>
            <dd>{props.schedule.timezone}</dd>
          </div>
        </dl>
        <dl style={{ display: "flex" }}>
          <div>
            <dt>Frequency </dt>
            <dd>{props.schedule.type === "runOnce" ? "Once" : cronstrue.toString(props.schedule.cronSchedule)}</dd>
          </div>
        </dl>
        <dl>
          <dt>Labels</dt>
          <dd>{labels.length > 0 ? labels : "---"}</dd>
        </dl>
        <OverflowMenu
          flipped
          ariaLabel="Schedule card menu"
          iconDescription="Schedule menu icon"
          style={{ position: "absolute", right: "0", top: "0" }}
        >
          {menuOptions.map(({ onClick, itemText, ...rest }, index) => (
            <OverflowMenuItem onClick={onClick} itemText={itemText} key={`${itemText}-${index}`} {...rest} />
          ))}
        </OverflowMenu>
      </Tile>
      {isToggleStatusModalOpen && (
        <ConfirmModal
          affirmativeAction={handleToggleStatus}
          affirmativeButtonProps={{ disabled: toggleStatusMutation.isLoading }}
          affirmativeText={isActive ? "Disable" : "Enable"}
          isOpen={isToggleStatusModalOpen}
          negativeAction={() => {
            setIsToggleStatusModalOpen(false);
          }}
          negativeText="Cancel"
          onCloseModal={() => {
            setIsToggleStatusModalOpen(false);
          }}
          title={`${isActive ? "Disable" : "Enable"} Schedule?`}
        >
          {`Are you sure you want to ${isActive ? "disable" : "enable"} schedule ${
            props.schedule.name
          }? Don't worry, you can change it in the future.`}
        </ConfirmModal>
      )}
      {isDeleteModalOpen && (
        <ConfirmModal
          affirmativeAction={handleDeleteSchedule}
          affirmativeButtonProps={{ kind: "danger", disabled: deleteScheduleMutation.isLoading }}
          affirmativeText="Delete"
          isOpen={isDeleteModalOpen}
          negativeAction={() => {
            setIsDeleteModalOpen(false);
          }}
          negativeText="Cancel"
          onCloseModal={() => {
            setIsDeleteModalOpen(false);
          }}
          title={`Delete Schedule?`}
        >
          {`Are you sure you want to delete schedule ${props.schedule.name}? There's no going back from this decision.`}
        </ConfirmModal>
      )}
    </li>
  );
}

interface PanelProps {
  event?: ScheduleUnion;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditorPanel(props: PanelProps) {
  const schedule = props.event;

  function renderSchedule() {
    if (!schedule) {
      return null;
    }

    const nextScheduleData = moment(schedule.nextScheduleDate).format(DATE_TIME_LOCAL_INPUT_FORMAT);
    const labels = [];
    for (const entry of schedule?.labels || []) {
      labels.push(
        <Tag key={entry.key} style={{ marginLeft: 0 }} type="teal">
          {entry.key}:{entry.value}
        </Tag>
      );
    }

    return (
      <>
        <div className={styles.detailsSection}>
          <section className={styles.detailsInfo}>
            <div className={styles.detailsTitle}>
              <h2 title={schedule.name}>{schedule.name}</h2>
              <Button
                size="sm"
                kind="ghost"
                onClick={props.setIsEditorOpen}
                renderIcon={SettingsAdjust16}
                style={{ marginLeft: "auto" }}
              >
                Edit
              </Button>
            </div>
            <p className={styles.listItemDescription}>{schedule?.description ?? "---"}</p>
            <dl>
              <dt>Status</dt>
              <dd style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
                {statusLabelMap[schedule.status]}
                {schedule.status === "inactive" ? (
                  <RadioButton16 className={styles.statusCircle} data-status={schedule.status} />
                ) : (
                  <CircleFilled16 className={styles.statusCircle} data-status={schedule.status} />
                )}
              </dd>
            </dl>
            <dl>
              <dt>Type</dt>
              <dd style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
                {schedule.type === "runOnce" ? "Once" : "Recurring"}
                {schedule.type === "runOnce" ? <RepeatOne16 /> : <Repeat16 />}
              </dd>
            </dl>
            <dl>
              <dt>Scheduled</dt>
              <dd>{nextScheduleData}</dd>
            </dl>
            <dl>
              <dt>Time Zone </dt>
              <dd>{schedule.timezone}</dd>
            </dl>
            <dl>
              <dt>Frequency </dt>
              <dd>{schedule.type === "runOnce" ? "Once" : cronstrue.toString(schedule.cronSchedule)}</dd>
            </dl>
            <dl>
              <dt>Labels</dt>
              <dd>{labels.length > 0 ? labels : "---"}</dd>
            </dl>
          </section>
          <section>
            <h2>Workflow Parameters</h2>
            <p style={{ marginBottom: "1rem" }}>Values for your workflow</p>
            <CodeSnippet hideCopyButton type="multi">
              {JSON.stringify(schedule?.parameters)}
            </CodeSnippet>
          </section>
          <hr />
        </div>
      </>
    );
  }
  return (
    <SlidingPane
      hideHeader
      className={styles.editorContainer}
      onRequestClose={() => props.setIsOpen(false)}
      isOpen={props.isOpen}
      width="32rem"
    >
      {renderSchedule()}
    </SlidingPane>
  );
}

/**
 * Start the beast of a create schedule form
 */
interface CreateScheduleProps {
  isModalOpen: boolean;
  onCloseModal: () => void;
  workflow: WorkflowSummary;
  workflowScheduleUrl: string;
  workflowCalendarUrl: string;
}

interface CreateScheduleForm {
  id: string;
  name: string;
  description: string;
  cronSchedule: string;
  dateTime: string;
  labels: Array<string>;
  type: ScheduleType;
  days: Array<string>;
  timezone: { label: string; value: string };
  time: string;
  advancedCron: boolean;
  parameters: { [key: string]: any };
}

function CreateSchedule(props: CreateScheduleProps) {
  /**
   * Create schedule
   */
  const [createScheduleMutator, createScheduleMutation] = useMutation(resolver.postSchedule, {});

  const handleCreateSchedule = async (schedule: ScheduleUnion) => {
    try {
      await createScheduleMutator({ body: schedule });
      notify(
        <ToastNotification
          kind="success"
          title={`Created Schedule`}
          subtitle={`Successfully created schedule ${schedule.name} `}
        />
      );
      queryCache.invalidateQueries(props.workflowScheduleUrl);
      queryCache.invalidateQueries(props.workflowCalendarUrl);
    } catch (e) {
      notify(
        <ToastNotification
          kind="error"
          title="Something's Wrong"
          subtitle={`Request to create schedule ${schedule.name} failed`}
        />
      );
      return;
    }
  };

  const handleSubmit = async (values: CreateScheduleForm) => {
    const { name, description, cronSchedule, dateTime, labels, timezone, type, days, time, ...parameters } = values;

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
      workflowId: props.workflow.id,
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

    await handleCreateSchedule(schedule as ScheduleUnion);
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
        <CreateEditForm
          modalProps={modalProps}
          isLoading={createScheduleMutation.isLoading}
          handleSubmit={handleSubmit}
          //@ts-ignore
          parameters={props.workflow.properties}
          type="create"
        />
      )}
    </ComposedModal>
  );
}

interface EditScheduleProps {
  isModalOpen: boolean;
  onCloseModal: () => void;
  schedule?: ScheduleUnion;
  workflowScheduleUrl: string;
  workflowCalendarUrl: string;
  workflow: WorkflowSummary;
}

function EditSchedule(props: EditScheduleProps) {
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

  const handleSubmit = async (values: CreateScheduleForm) => {
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
        <CreateEditForm
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

interface CreateEditFormProps {
  handleSubmit: (args: CreateScheduleForm) => void;
  isLoading: boolean;
  modalProps: ComposedModalChildProps;
  parameters?: { [k: string]: any };
  type: "create" | "edit";
  schedule?: ScheduleUnion;
}

function CreateEditForm(props: CreateEditFormProps) {
  let initFormValues: Partial<CreateScheduleForm> = {
    id: props.schedule?.name,
    name: props.schedule?.name ?? "",
    description: props.schedule?.description ?? "",
    type: props.schedule?.type || "runOnce",
    timezone: transformTimeZone(defaultTimeZone),
    days: [],
    labels: [],
    ...props.schedule?.parameters,
  };

  /**
   * Lots of manipulating of data for the inputs based on type
   */
  if (props.type === "edit" && props.schedule) {
    initFormValues["timezone"] = transformTimeZone(props.schedule.timezone);

    if (props.schedule.type === "runOnce") {
      initFormValues["dateTime"] = moment(props.schedule.dateSchedule).format("YYYY-MM-DDThh:mm");
    }

    if (props.schedule.type === "advancedCron") {
      initFormValues["cronSchedule"] = props.schedule.cronSchedule;
    }

    if (props.schedule.type === "cron") {
      const cronSchedule = props.schedule.cronSchedule;
      const cronToData = cronToDateTime(Boolean(cronSchedule), cronSchedule);
      const { cronTime, selectedDays } = cronToData;

      let activeDays: string[] = [];
      Object.entries(selectedDays).forEach(([key, value]) => {
        if (value) {
          activeDays.push(key);
        }
      });

      initFormValues["time"] = cronTime;
      initFormValues["days"] = activeDays;
    }

    let scheduleLabels: Array<string> = [];
    if (props.schedule.labels?.length) {
      for (let labelObj of props.schedule.labels) {
        const scheduleLabel = `${labelObj.key}:${labelObj.value}`;
        scheduleLabels.push(scheduleLabel);
      }
      initFormValues["labels"] = scheduleLabels;
    }
  }

  return (
    <DynamicFormik
      validateOnMount
      initialValues={initFormValues}
      inputs={props.parameters}
      onSubmit={async (args: CreateScheduleForm) => {
        await props.handleSubmit(args);
        props.modalProps.closeModal();
      }}
      validationSchemaExtension={Yup.object().shape({
        name: Yup.string().required("Name is required"),
        description: Yup.string(),
        type: Yup.string().required("Enter a type"),
        dateTime: Yup.string().when("type", {
          is: "runOnce",
          then: Yup.string().required("Date and Time is required"),
        }),
        labels: Yup.array(),
        cronSchedule: Yup.string().when("type", {
          is: "advancedCron",
          then: Yup.string().required("Expression required"),
        }),
        days: Yup.array().when("type", {
          is: "cron",
          then: Yup.array().min(1, "Enter at least one day"),
        }),
        time: Yup.string().when("type", { is: "cron", then: (time: any) => time.required("Enter a time") }),
        timezone: Yup.object().shape({ label: Yup.string(), value: Yup.string() }),
      })}
    >
      {({ inputs, formikProps }: any) => (
        <ModalForm noValidate onSubmit={formikProps.handleSubmit}>
          <ModalBody>
            <p>
              <b>About</b>
            </p>
            <TextInput
              labelText="Name"
              id="name"
              onBlur={formikProps.handleBlur}
              onChange={formikProps.handleChange}
              invalid={formikProps.errors.name && formikProps.touched.name}
              invalidText={formikProps.errors.name}
              placeholder="e.g. Daily task"
              value={formikProps.values.name}
            />
            <TextArea
              labelText="Description (optional)"
              id="description"
              placeholder="e.g. Runs very important daily task."
              onBlur={formikProps.handleBlur}
              onChange={formikProps.handleChange}
              invalid={formikProps.errors.description && formikProps.touched.description}
              invalidText={formikProps.errors.description}
              value={formikProps.values.description}
            />
            <Creatable
              createKeyValuePair
              keyLabelText="Label key"
              keyPlaceholder="level"
              valueLabelText="Label value"
              valuePlaceholder="important"
              value={formikProps.values.labels}
              onChange={(labels: string) => formikProps.setFieldValue("labels", labels)}
            />
            <p>
              <b>Schedule</b>
            </p>
            <section>
              <p>How many times do you want to execute this Schedule?</p>
              <RadioButtonGroup
                id="type"
                labelPosition="right"
                name="type"
                onChange={(type: string) => formikProps.setFieldValue("type", type)}
                orientation="horizontal"
                valueSelected={formikProps.values["type"]}
              >
                <RadioButton key={"runOnce"} id={"runOnce"} labelText={"Once"} value={"runOnce"} />
                <RadioButton key={"cron"} id={"cron"} labelText={"Repeatedly"} value={"cron"} />
                <RadioButton
                  key={"advanced-cron"}
                  id={"advanced-cron"}
                  labelText={"Repeatedly via cron expression"}
                  value={"advancedCron"}
                />
              </RadioButtonGroup>
            </section>
            {formikProps.values["type"] === "runOnce" ? (
              <>
                <TextInput
                  type="datetime-local"
                  labelText="Date and Time"
                  id="dateTime"
                  name="dateTime"
                  onBlur={formikProps.handleBlur}
                  onChange={formikProps.handleChange}
                  invalid={formikProps.errors.dateTime && formikProps.touched.dateTime}
                  invalidText={formikProps.errors.dateTime}
                  value={formikProps.values.dateTime}
                  min={moment().format("YYYY-MM-DDThh:mm")}
                  style={{ width: "23.5rem" }}
                />
                <div style={{ width: "23.5rem" }}>
                  <ComboBox
                    id="timezone"
                    initialSelectedItem={formikProps.values.timezone}
                    //@ts-ignore
                    items={timezoneOptions}
                    onChange={({ selectedItem }: { selectedItem: { label: string; value: string } }) => {
                      const item = selectedItem ?? { label: "", value: "" };
                      formikProps.setFieldValue("timezone", item);
                    }}
                    placeholder="e.g. US/Central (UTC -06:00)"
                    titleText="Time Zone"
                  />
                </div>
              </>
            ) : (
              <CronJobConfig formikProps={formikProps} timezoneOptions={timezoneOptions} />
            )}
            {inputs.length ? (
              <>
                <p>
                  <b>Workflow Parameters</b>
                </p>
                {inputs}
              </>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button kind="secondary" onClick={props.modalProps.closeModal}>
              Cancel
            </Button>
            <Button disabled={!formikProps.isValid || props.isLoading} type="submit">
              {props.type === "create" ? "Create" : "Update"}
            </Button>
          </ModalFooter>
        </ModalForm>
      )}
    </DynamicFormik>
  );
}
