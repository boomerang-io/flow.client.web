import React from "react";
import { Button, CodeSnippet, Tag } from "@boomerang-io/carbon-addons-boomerang-react";
import SlidingPane from "react-sliding-pane";
import cronstrue from "cronstrue";
import cx from "classnames";
import moment from "moment-timezone";
import { DATETIME_LOCAL_DISPLAY_FORMAT } from "Utils/dateHelper";
import { statusLabelMap, typeLabelMap } from "Constants/schedule";
import { CircleFilled16, SettingsAdjust16, RadioButton16, Repeat16, RepeatOne16 } from "@carbon/icons-react";
import { ScheduleUnion } from "Types";
import "react-sliding-pane/dist/react-sliding-pane.css";
import styles from "./SchedulePanelDetail.module.scss";

interface SchedulePanelDetailProps {
  className: string;
  event?: ScheduleUnion;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SchedulePanelDetail(props: SchedulePanelDetailProps) {
  const schedule = props.event;

  function renderSchedule() {
    if (!schedule || !props.isOpen) {
      return <></>;
    }

    const nextScheduleData = moment(schedule.nextScheduleDate).format(DATETIME_LOCAL_DISPLAY_FORMAT);
    const scheduleDescription = schedule?.description ?? "---";
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
                Edit Schedule
              </Button>
            </div>
            <p title={scheduleDescription} className={styles.detailsDescription}>
              {scheduleDescription}
            </p>
            <dl>
              <dt>Type</dt>
              <dd style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
                {typeLabelMap[schedule.type]}
                {schedule.type === "runOnce" ? <RepeatOne16 /> : <Repeat16 />}
              </dd>
            </dl>
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
            {schedule.workflow && (
              <>
                <dl>
                  <dt>Workflow</dt>
                  <dd>{schedule.workflow.name}</dd>
                </dl>
              </>
            )}
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
              <dd>{schedule.type === "runOnce" ? "Run Once" : cronstrue.toString(schedule.cronSchedule)}</dd>
            </dl>
            <dl>
              <dt>Labels</dt>
              <dd>{labels.length > 0 ? labels : "---"}</dd>
            </dl>
          </section>
          <section>
            <h2>Workflow Parameters</h2>
            <p style={{ marginBottom: "1rem" }}>Values for your workflow</p>
            <CodeSnippet light hideCopyButton type="multi">
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
      className={cx(styles.panelContainer, props.className)}
      isOpen={props.isOpen}
      onRequestClose={() => props.setIsOpen(false)}
      width="32rem"
    >
      {renderSchedule()}
    </SlidingPane>
  );
}
