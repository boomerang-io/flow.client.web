import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { ModalFlow } from "@boomerang/carbon-addons-boomerang-react";
import { Toggle } from "@boomerang/carbon-addons-boomerang-react";
import { ModalBody } from "carbon-components-react";
import { LazyLog, ScrollFollow } from "react-lazylog";
import { BASE_SERVICE_URL, PRODUCT_SERVICE_ENV_URL } from "Config/servicesConfig";
import "./styles.scss";

const DEV_STREAM_URL =
  "https://gist.githubusercontent.com/helfi92/96d4444aa0ed46c5f9060a789d316100/raw/ba0d30a9877ea5cc23c7afcd44505dbc2bab1538/typical-live_backing.log";

TaskExecutionLog.propTypes = {
  flowActivityId: PropTypes.string.isRequired,
  flowTaskId: PropTypes.string.isRequired,
  flowTaskName: PropTypes.string.isRequired
};

export default function TaskExecutionLog({ flowActivityId, flowTaskId, flowTaskName }) {
  const [follow, setFollow] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <ModalFlow
      composedModalProps={{
        containerClassName: "c-modal-task-log"
      }}
      modalHeaderProps={{
        title: "Execution Log",
        label: `${flowTaskName}`
      }}
      modalTrigger={({ openModal }) => (
        <button className="s-task-log-trigger" onClick={openModal}>
          View Log
        </button>
      )}
    >
      <ModalBody>
        <ScrollFollow
          startFollowing={true}
          render={({ onScroll }) => (
            <>
              <div className="b-task-log-toggle">
                <label className={cx("b-task-log-toggle__text", { "--disabled": !!error })} htmlFor="task-log-toggle">
                  Follow log
                </label>
                <Toggle
                  defaultValue={follow}
                  disabled={!!error}
                  id="task-log-toggle"
                  onChange={() => setFollow(!follow)}
                  toggled={follow}
                />
              </div>
              <LazyLog
                enableSearch={true}
                fetchOptions={
                  PRODUCT_SERVICE_ENV_URL.includes("localhost") ? { credentials: "omit" } : { credentials: "include" }
                }
                follow={follow}
                onScroll={onScroll}
                onError={err => setError(err)}
                selectableLines={true}
                stream={true}
                url={
                  PRODUCT_SERVICE_ENV_URL.includes("localhost")
                    ? DEV_STREAM_URL
                    : `${BASE_SERVICE_URL}/activity/${flowActivityId}/log/${flowTaskId}`
                }
              />
            </>
          )}
        />
      </ModalBody>
    </ModalFlow>
  );
}
