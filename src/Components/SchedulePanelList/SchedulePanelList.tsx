import React from "react";
import { useMutation, queryCache, QueryResult } from "react-query";
import {
  Button,
  ConfirmModal,
  MultiSelect,
  OverflowMenu,
  OverflowMenuItem,
  SkeletonPlaceholder,
  Search,
  Tag,
  Tile,
  TooltipHover,
  ToastNotification,
  notify,
} from "@boomerang-io/carbon-addons-boomerang-react";
import cronstrue from "cronstrue";
import matchSorter from "match-sorter";
import moment from "moment-timezone";
import { DATETIME_LOCAL_DISPLAY_FORMAT } from "Utils/dateHelper";
import { scheduleStatusOptions, statusLabelMap, typeLabelMap } from "Features/Schedule";
import { resolver } from "Config/servicesConfig";
import { Add16, CircleFilled16, RadioButton16, Repeat16, RepeatOne16 } from "@carbon/icons-react";
import { ScheduleUnion } from "Types";
import styles from "./SchedulePanelList.module.scss";

interface SchedulePanelListProps {
  getCalendarUrl: string;
  getSchedulesUrl: string;
  includeStatusFilter: boolean;
  setActiveSchedule:
    | React.Dispatch<React.SetStateAction<ScheduleUnion | undefined>>
    | ((schedule: ScheduleUnion) => void);
  setIsEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreatorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  schedulesQuery: QueryResult<ScheduleUnion[], Error>;
}

export default function SchedulePanelList(props: SchedulePanelListProps) {
  const [filterQuery, setFilterQuery] = React.useState("");
  const [selectedStatuses, setSelectedStatuses] = React.useState<Array<string>>([]);

  function renderLists() {
    if (props.schedulesQuery.isLoading) {
      return (
        <div>
          <SkeletonPlaceholder className={styles.listItemSkeleton} />
          <SkeletonPlaceholder className={styles.listItemSkeleton} />
          <SkeletonPlaceholder className={styles.listItemSkeleton} />
          <SkeletonPlaceholder className={styles.listItemSkeleton} />
        </div>
      );
    }

    if (props.schedulesQuery.data && props.schedulesQuery.data.length === 0) {
      return <div>No schedules found</div>;
    }

    const schedules = props.schedulesQuery.data;
    if (schedules) {
      const filteredSchedules = Boolean(filterQuery)
        ? matchSorter(schedules, filterQuery, {
            keys: ["name", "description", "type", "status", "labels.0.key", "labels.0.value"],
            threshold: matchSorter.rankings.CONTAINS,
          })
        : schedules;

      const sortedSchedules = filteredSchedules.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

      let selectedSchedules = sortedSchedules;
      if (selectedStatuses.length && props.includeStatusFilter) {
        selectedSchedules = sortedSchedules.filter((schedule) => {
          return selectedStatuses.includes(schedule.status);
        });
      }

      if (selectedSchedules.length === 0) {
        return <div style={{ marginTop: "1rem" }}>No matching schedules found</div>;
      }

      return (
        <ul>
          {selectedSchedules.map((schedule) => (
            <ScheduledListItem
              key={schedule.id}
              getCalendarUrl={props.getCalendarUrl}
              getSchedulesUrl={props.getSchedulesUrl}
              schedule={schedule}
              setActiveSchedule={props.setActiveSchedule}
              setIsEditorOpen={props.setIsEditorOpen}
            />
          ))}
        </ul>
      );
    } else {
      return null;
    }
  }

  const schedules = props.schedulesQuery.data;

  return (
    <section className={styles.listContainer}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2>
          {!props.schedulesQuery.isLoading ? `Existing Schedules (${schedules?.length ?? 0})` : "Loading Schedules"}
        </h2>
        <Button size="field" renderIcon={Add16} onClick={() => props.setIsCreatorOpen(true)} kind="ghost">
          Create a Schedule
        </Button>
      </div>
      <div style={{ display: "flex", alignItems: "end", gap: "0.5rem", width: "100%" }}>
        <div style={{ width: props.includeStatusFilter ? "50%" : "100%" }}>
          <Search
            light
            id="schedules-filter"
            labelText="Filter Schedules"
            placeHolderText="Search Schedules"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterQuery(e.target.value)}
          />
        </div>
        {props.includeStatusFilter && (
          <div style={{ width: "50%" }}>
            <MultiSelect
              light
              id="actions-statuses-select"
              label="Choose status(es)"
              placeholder="Choose status(es)"
              invalid={false}
              onChange={({ selectedItems }: { selectedItems: Array<{ key: string; value: string }> }) =>
                setSelectedStatuses(selectedItems.map((item: { key: string; value: string }) => item.value))
              }
              items={scheduleStatusOptions}
              selectedItem={selectedStatuses}
              titleText="Filter by status"
            />
          </div>
        )}
      </div>
      {renderLists()}
    </section>
  );
}

interface ScheduledListItemProps {
  schedule: ScheduleUnion;
  setActiveSchedule:
    | React.Dispatch<React.SetStateAction<ScheduleUnion | undefined>>
    | ((schedule: ScheduleUnion) => void);
  setIsEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getSchedulesUrl: string;
  getCalendarUrl: string;
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
  const nextScheduleData = moment(props.schedule.nextScheduleDate).format(DATETIME_LOCAL_DISPLAY_FORMAT);
  const scheduleDescription = props.schedule?.description ?? "---";

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
      queryCache.invalidateQueries(props.getSchedulesUrl);
      queryCache.invalidateQueries(props.getCalendarUrl);
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
      queryCache.invalidateQueries(props.getSchedulesUrl);
      queryCache.invalidateQueries(props.getCalendarUrl);
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
      disabled: props.schedule.status === "trigger_disabled",
      itemText: props.schedule.status === "inactive" ? "Enable" : "Disable",
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
    <li>
      <Tile className={styles.listItem}>
        <div className={styles.listItemTitle}>
          <h3 title={props.schedule.name}>{props.schedule.name}</h3>
          <TooltipHover direction="top" tooltipText={typeLabelMap[props.schedule.type] ?? "---"}>
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
        <p title={scheduleDescription} className={styles.listItemDescription}>
          {scheduleDescription}
        </p>
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
            <dd>{props.schedule.type === "runOnce" ? "Run Once" : cronstrue.toString(props.schedule.cronSchedule)}</dd>
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
