import React from "react";
import { Button, Theme } from "@carbon/react";
import { ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import { Toggle } from "@carbon/react";
import { ModalBody } from "@carbon/react";
import { LazyLog, ScrollFollow } from "react-lazylog";
import { serviceUrl } from "Config/servicesConfig";
import { PRODUCT_SERVICE_ENV_URL } from "Config/servicesConfig";
import styles from "./taskExecutionLog.module.scss";

const DEV_STREAM_URL =
  "https://gist.githubusercontent.com/helfi92/96d4444aa0ed46c5f9060a789d316100/raw/ba0d30a9877ea5cc23c7afcd44505dbc2bab1538/typical-live_backing.log";

type Props = {
  flowActivityId: string;
  flowTaskId: string;
  flowTaskName: string;
};

export default function TaskExecutionLog({ flowActivityId, flowTaskId, flowTaskName }: Props) {
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
      modalTrigger={({ openModal }: { openModal: () => void }) => (
        <Button className={styles.trigger} kind="ghost" size="sm" onClick={openModal}>
          View Log
        </Button>
      )}
    >
      {() => (
        <ModalBody>
          <ScrollFollow
            startFollowing={true}
            render={({ onScroll }: { onScroll: () => void }) => (
              <>
                <Theme theme="g100" className={styles.followToggle}>
                  <Toggle
                  hideLabel
                    defaultValue={follow}
                    disabled={Boolean(error)}
                    id="task-log-toggle"
                    labelText="Follow log toggle"
                    labelB="Follow"
                    labelA="Don't Follow"
                    onChange={() => setFollow(!follow)}
                    toggled={follow}
                    size="sm"
                  />
                </Theme>
                <LazyLog
                  enableSearch={true}
                  fetchOptions={
                    PRODUCT_SERVICE_ENV_URL.includes("localhost") ? { credentials: "omit" } : { credentials: "include" }
                  }
                  follow={follow}
                  onScroll={onScroll}
                  onError={(err: boolean) => setError(err)}
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
