import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { Button, ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import { Toggle } from "@boomerang-io/carbon-addons-boomerang-react";
import { ModalBody } from "@boomerang-io/carbon-addons-boomerang-react";
import { LazyLog, ScrollFollow } from "react-lazylog";
import { serviceUrl } from "Config/servicesConfig";
import { PRODUCT_SERVICE_ENV_URL } from "Config/servicesConfig";
import styles from "./taskExecutionLog.module.scss";

const DEV_STREAM_URL =
  "https://gist.githubusercontent.com/helfi92/96d4444aa0ed46c5f9060a789d316100/raw/ba0d30a9877ea5cc23c7afcd44505dbc2bab1538/typical-live_backing.log";

TaskExecutionLog.propTypes = {
  flowActivityId: PropTypes.string.isRequired,
  flowTaskId: PropTypes.string.isRequired,
  flowTaskName: PropTypes.string.isRequired,
};

export default function TaskExecutionLog({ flowActivityId, flowTaskId, flowTaskName }) {
  const [follow, setFollow] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <ComposedModal
      composedModalProps={{
        containerClassName: styles.container,
        shouldCloseOnOverlayClick: true,
      }}
      modalHeaderProps={{
        title: "Execution Log",
        label: `${flowTaskName}`,
      }}
      modalTrigger={({ openModal }) => (
        <Button className={styles.trigger} kind="ghost" size="small" onClick={openModal}>
          View Log
        </Button>
      )}
    >
      {() => (
        <ModalBody>
          <ScrollFollow
            startFollowing={true}
            render={({ onScroll }) => (
              <>
                <div className={styles.followToggle}>
                  <label
                    className={cx(styles.followToggleText, { [styles.disabled]: Boolean(error) })}
                    htmlFor="task-log-toggle"
                  >
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
                  onError={(err) => setError(err)}
                  selectableLines={true}
                  stream={true}
                  url={
                    PRODUCT_SERVICE_ENV_URL.includes("localhost")
                      ? DEV_STREAM_URL
                      : serviceUrl.getWorkflowExecutionLog({ flowActivityId, flowTaskId })
                  }
                />
              </>
            )}
          />
        </ModalBody>
      )}
    </ComposedModal>
  );
}
