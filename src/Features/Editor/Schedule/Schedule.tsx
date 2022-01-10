/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
//import { useHistory } from "react-router";
import {
  Button,
  ConfirmModal,
  ComposedModal,
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
import { Add16, CircleFilled16, SettingsAdjust16 } from "@carbon/icons-react";
import { useQuery, useMutation, queryCache } from "react-query";
import CronJobConfig from "./CronJobConfig";
import RunOnceConfig from "./RunOnceConfig";
import Calendar from "Components/Calendar";
import capitalize from "lodash/capitalize";
import matchSorter from "match-sorter";
import moment from "moment-timezone";
import SlidingPane from "react-sliding-pane";
import queryString from "query-string";
import { queryStringOptions } from "Config/appConfig";
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
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [activeEvent, setActiveSchedule] = React.useState<ScheduleUnion | null>(null);
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
          setActiveSchedule={setActiveSchedule}
          setIsCreatorOpen={setIsCreatorOpen}
          setIsEditorOpen={setIsEditorOpen}
          schedules={schedules}
          workflow={props.summaryData}
          workflowScheduleUrl={workflowScheduleUrl}
          workflowCalendarUrl={workflowCalendarUrl}
        />
        <CalendarView
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
          setActiveSchedule={setActiveSchedule}
          setIsCreatorOpen={setIsCreatorOpen}
          setIsEditorOpen={setIsEditorOpen}
          workflowCalendarUrl={workflowCalendarUrl}
          workflowSchedules={workflowSchedulesQuery.data}
        />
      </div>
      <EditorPanel event={activeEvent} isOpen={isEditorOpen} setIsOpen={setIsEditorOpen} />
      <CreatorPanel event={activeEvent} isOpen={isCreatorOpen} setIsOpen={setIsCreatorOpen} />
    </>
  );
}

interface CalendarViewProps {
  fromDate: number;
  toDate: number;
  setFromDate: React.Dispatch<React.SetStateAction<number>>;
  setToDate: React.Dispatch<React.SetStateAction<number>>;
  setActiveSchedule: (event: ScheduleUnion) => void;
  setIsCreatorOpen: (isOpen: boolean) => void;
  setIsEditorOpen: (isOpen: boolean) => void;
  workflowSchedules: Array<ScheduleUnion>;
  workflowCalendarUrl: string;
}

function CalendarView(props: CalendarViewProps) {
  const workflowCalendarQuery = useQuery<Array<ScheduleCalendar>, string>({
    queryKey: props.workflowCalendarUrl,
    queryFn: resolver.query(props.workflowCalendarUrl),
  });

  const handleDateRangeChange = (dateInfo: any) => {
    const fromDate = moment(dateInfo.start).unix();
    const toDate = moment(dateInfo.end).unix();
    props.setFromDate(fromDate);
    props.setToDate(toDate);
  };

  const calendarEvents: Array<CalendarEvent> = [];
  if (workflowCalendarQuery.data && props.workflowSchedules) {
    for (let calendarEntry of workflowCalendarQuery.data) {
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
          props.setIsEditorOpen(true);
          props.setActiveSchedule(data.resource);
        }}
        onRangeChange={handleDateRangeChange}
        dateClick={() => props.setIsCreatorOpen(true)}
        events={calendarEvents}
      />
    </section>
  );
}

interface ScheduleListProps {
  schedules: Array<ScheduleUnion>;
  setActiveSchedule: (event: ScheduleUnion) => void;
  setIsCreatorOpen: (isOpen: boolean) => void;
  setIsEditorOpen: (isOpen: boolean) => void;
  workflow: WorkflowSummary;
  workflowScheduleUrl: string;
  workflowCalendarUrl: string;
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
        workflowId={props.workflow.id}
        workflowScheduleUrl={props.workflowScheduleUrl}
        workflowCalendarUrl={props.workflowCalendarUrl}
        workflow={props.workflow}
      />
    ));
  }

  return (
    <section className={styles.listContainer}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2>{`Existing Schedules (${props.schedules.length})`}</h2>
        <CreateSchedule
          workflow={props.workflow}
          workflowScheduleUrl={props.workflowScheduleUrl}
          workflowCalendarUrl={props.workflowCalendarUrl}
        />
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
  schedule: ScheduleUnion;
  setActiveSchedule: (event: ScheduleUnion) => void;
  setIsEditorOpen: (isOpen: boolean) => void;
  workflowId: string;
  workflowScheduleUrl: string;
  workflowCalendarUrl: string;
  workflow: WorkflowSummary;
}

function ScheduledListItem(props: ScheduledListItemProps) {
  //const history = useHistory();
  const [isToggleStatusModalOpen, setIsToggleStatusModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  // Determine some things for rendering
  const isActive = props.schedule.status === "active";

  const labels = [];
  for (const entry of props.schedule?.labels || []) {
    labels.push(
      <Tag key={entry.key}>
        {entry.key}:{entry.value}
      </Tag>
    );
  }

  const nextScheduledText = props.schedule.type === "runOnce" ? "Scheduled" : "Next Execution";
  const nextScheduleData =
    props.schedule.type === "runOnce"
      ? moment(props.schedule.dateSchedule).format("MMMM DD, YYYY HH:mm")
      : moment(props.schedule.nextScheduleDate).format("MMMM DD, YYYY HH:mm");

  /**
   * Delete schedule
   */

  const [deleteScheduleMutator, { isLoading: isDeletingSchedule }] = useMutation(resolver.deleteSchedule, {});

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
  const [toggleScheduleStatusMutator, ...disableScheduleMutation] = useMutation(resolver.patchSchedule, {});

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
        props.setIsEditorOpen(true);
        props.setActiveSchedule(props.schedule);
      },
    },
    // {
    //   itemText: "View Activity",
    //   onClick: () => history.push(appLink.workflowActivity({ workflowId: props.workflowId })),
    // },
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
          <TooltipHover direction="top" tooltipText={statusLabelMap[props.schedule.status] ?? "---"}>
            <CircleFilled16 className={styles.statusCircle} data-status={props.schedule.status} />
          </TooltipHover>
        </div>
        <p className={styles.listItemDescription}>{props.schedule?.description ?? "---"}</p>
        <div style={{ display: "flex", gap: "2rem" }}>
          <div>
            <dt>Executes</dt>
            <dd>{props.schedule.type === "runOnce" ? "Once" : "Repeatedly"}</dd>
          </div>
          <div>
            <dt>{nextScheduledText}</dt>
            <dd>{nextScheduleData}</dd>
          </div>
        </div>
        <div className={styles.listItemLabels}>{labels}</div>
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
        <EditSchedule
          schedule={props.schedule}
          workflowScheduleUrl={props.workflowScheduleUrl}
          workflowCalendarUrl={props.workflowCalendarUrl}
          workflow={props.workflow}
        />
      </Tile>
      {isToggleStatusModalOpen && (
        <ConfirmModal
          affirmativeAction={handleToggleStatus}
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
          affirmativeButtonProps={{ kind: "danger" }}
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
  event: ScheduleUnion | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function EditorPanel(props: PanelProps) {
  const nextScheduledText = props.event?.type === "runOnce" ? "Scheduled" : "Next Execution";
  const nextScheduleData =
    props.event?.type === "runOnce"
      ? moment(props.event?.dateSchedule).format("MMMM DD, YYYY HH:mm")
      : moment(props.event?.nextScheduleDate).format("MMMM DD, YYYY HH:mm");
  return (
    <SlidingPane
      hideHeader
      className={styles.editorContainer}
      onRequestClose={() => props.setIsOpen(false)}
      isOpen={props.isOpen}
      width="32rem"
    >
      <div className={styles.detailsSection}>
        <div className={styles.detailsInfo}>
          <div className={styles.detailsTitle}>
            <h2 title={props.event?.name}>{props.event?.name}</h2>
            <TooltipHover direction="top" tooltipText={capitalize(props.event?.status)}>
              <CircleFilled16 className={styles.statusCircle} data-status={props.event?.status} />
            </TooltipHover>
          </div>
          <p className={styles.detailDescription}>{props.event?.description ?? "---"}</p>
          <div style={{ display: "flex", gap: "2rem" }}>
            <div>
              <dt>Executes</dt>
              <dd>{props.event?.type === "runOnce" ? "Once" : "Repeatedly"}</dd>
            </div>
            <div>
              <dt>{nextScheduledText}</dt>
              <dd>{nextScheduleData}</dd>
            </div>
          </div>
        </div>
        <hr />
        {props.event && (
          <>
            <section>
              {props?.event?.type === "advancedCron" || props?.event?.type === "cron" ? (
                <div>Cron job</div>
              ) : (
                <RunOnceConfig event={props.event} />
              )}
            </section>
            <hr />
            <section>
              <h2>Workflow parameters</h2>
              <p>Provide parameter values for your workflow</p>
            </section>
            <hr />
            <footer>
              <Button kind="secondary" onClick={() => props.setIsOpen(false)}>
                Cancel
              </Button>
              <Button>Save</Button>
            </footer>
          </>
        )}
      </div>
    </SlidingPane>
  );
}

function CreatorPanel(props: PanelProps) {
  return (
    <SlidingPane
      hideHeader
      className={styles.editorContainer}
      onRequestClose={() => props.setIsOpen(false)}
      isOpen={props.isOpen}
      width="32rem"
    >
      <div className={styles.detailsSection}>
        <section>
          <h2>Create a Schedule</h2>
          <TextInput id="name" labelText="Name" placeholder="e.g. Daily reporting" />
          <TextArea id="description" labelText="Description" placeholder="e.g. Gather and submit daily reports" />
        </section>
        <section>
          <h2>Change schedule</h2>
          {
            //<CronJobConfig />
          }
        </section>
        <hr />
        <section>
          <h2>Workflow parameters</h2>
          <p>Provide parameter values for your workflow</p>
        </section>
        <footer>
          <Button kind="secondary" onClick={() => props.setIsOpen(false)}>
            Cancel
          </Button>
          <Button>Save</Button>
        </footer>
      </div>
    </SlidingPane>
  );
}

/**
 * Start the beast of a create schedule form
 */
const exludedTimezones = ["GMT+0", "GMT-0", "ROC"];

const INIT_CRON = "0 18 * * *";
const INIT_HOUR = "18:00";

function transformTimeZone(timezone: string) {
  return { label: `${timezone} (UTC ${moment.tz(timezone).format("Z")})`, value: timezone };
}

const timezoneOptions = moment.tz
  .names()
  .filter((tz) => !exludedTimezones.includes(tz))
  .map((element) => transformTimeZone(element));

const defaultTimeZone = moment.tz.guess();

interface CreateScheduleProps {
  workflow: WorkflowSummary;
  workflowScheduleUrl: string;
  workflowCalendarUrl: string;
}

interface CreateScheduleForm {
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
  const [createScheduleMutator, { isLoading: createScheduleIsLoading }] = useMutation(resolver.postSchedule, {});

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

    if (schedule.type === "cron" || schedule.type === "advancedCron") {
      schedule["cronSchedule"] = cronSchedule;
    }

    await handleCreateSchedule(schedule as ScheduleUnion);
  };

  return (
    <ComposedModal
      composedModalProps={{
        containerClassName: styles.modalContainer,
      }}
      modalHeaderProps={{
        title: "Create a Schedule",
      }}
      modalTrigger={({ openModal }: { openModal: () => void }) => (
        <Button size="field" renderIcon={Add16} onClick={openModal} kind="ghost">
          Create a Schedule
        </Button>
      )}
    >
      {(modalProps: ComposedModalChildProps) => (
        <CreateEditForm
          modalProps={modalProps}
          isLoading={createScheduleIsLoading}
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
  schedule: ScheduleUnion;
  workflowScheduleUrl: string;
  workflowCalendarUrl: string;
  workflow: WorkflowSummary;
}

function EditSchedule(props: EditScheduleProps) {
  /**
   * Update schedule
   */
  const [updateScheduleMutator, { isLoading: updateScheduleIsLoading }] = useMutation(resolver.patchSchedule, {});

  const handleUpdateSchedule = async (schedule: ScheduleUnion) => {
    try {
      await updateScheduleMutator({ body: schedule, scheduleId: schedule.id });
      notify(
        <ToastNotification
          kind="success"
          title={`Updated Schedule`}
          subtitle={`Successfully updated schedule ${schedule.name} `}
        />
      );
      queryCache.invalidateQueries(props.workflowScheduleUrl);
      queryCache.invalidateQueries(props.workflowCalendarUrl);
    } catch (e) {
      notify(
        <ToastNotification
          kind="error"
          title="Something's Wrong"
          subtitle={`Request to update schedule ${schedule.name} failed`}
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
    };

    if (schedule.type === "runOnce") {
      schedule["dateSchedule"] = new Date(dateTime).toISOString();
    }

    if (schedule.type === "cron" || schedule.type === "advancedCron") {
      schedule["cronSchedule"] = cronSchedule;
    }

    await handleUpdateSchedule(schedule as ScheduleUnion);
  };

  return (
    <ComposedModal
      composedModalProps={{
        containerClassName: styles.modalContainer,
      }}
      modalHeaderProps={{
        title: "Edit a Schedule",
      }}
      modalTrigger={({ openModal }: { openModal: () => void }) => (
        <Button size="field" renderIcon={SettingsAdjust16} onClick={openModal} kind="ghost">
          Edit Schedule
        </Button>
      )}
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
  let initValues: any = {};
  if (props.schedule?.type === "runOnce") {
    initValues["dateTime"] = moment(props.schedule?.dateSchedule).format("YYYY-MM-DDThh:mm");
  }

  if (props.schedule?.type === "cron" || props.schedule?.type === "advancedCron") {
    initValues["cronSchedule"] = props.schedule?.cronSchedule;
  }

  return (
    <DynamicFormik
      initialValues={{
        type: "runOnce",
        cronSchedule: INIT_CRON,
        days: [],
        time: INIT_HOUR,
        timezone: transformTimeZone(defaultTimeZone),
        labels: [],
        ...props.schedule,
        ...initValues,
      }}
      inputs={props.parameters}
      onSubmit={async (args: CreateScheduleForm) => {
        await props.handleSubmit(args);
        props.modalProps.closeModal();
      }}
      validationSchemaExtension={Yup.object().shape({
        name: Yup.string().required("Name is required"),
        description: Yup.string(),
        type: Yup.string(),
        dateTime: Yup.string().when("type", {
          is: "runOnce",
          then: Yup.string().required("Date and Time is required"),
        }),
        labels: Yup.array(),
        cronSchedule: Yup.string().when("advancedCron", {
          is: true,
          then: (cron: any) => cron.required("Expression required"),
        }),
        days: Yup.array(),
        time: Yup.string().when("advancedCron", { is: false, then: (time: any) => time.required("Enter a time") }),
        timezone: Yup.object().shape({ label: Yup.string(), value: Yup.string() }),
      })}
    >
      {({ inputs, formikProps }: any) =>
        void console.log(formikProps.values) || (
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
                    labelText={"Repeatedly via cron schedule"}
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
                    <b>Parameters</b>
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
                Create
              </Button>
            </ModalFooter>
          </ModalForm>
        )
      }
    </DynamicFormik>
  );
}
