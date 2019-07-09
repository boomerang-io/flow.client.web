import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import Modal from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import Toggle from "@boomerang/boomerang-components/lib/Toggle";
import ViewIcon from "@carbon/icons-react/lib/view/16";
import { LazyLog, ScrollFollow } from "react-lazylog";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import "./styles.scss";

TaskExecutionLog.propTypes = {
  flowActivityId: PropTypes.string.isRequired,
  flowTaskId: PropTypes.string.isRequired,
  flowTaskName: PropTypes.string.isRequired
};

function LogViewerTrigger() {
  return (
    <div className="b-activity__section">
      <ViewIcon className="b-activity-actions__icon" alt="View Log" />
      <div className="b-activity-actions__text">VIEW LOG</div>
    </div>
  );
}

/*class TaskExecutionLog extends React.Component {
  static propTypes = {
    flowActivityId: PropTypes.string.isRequired,
    flowTaskId: PropTypes.string.isRequired,
    flowTaskName: PropTypes.string.isRequired
  };

  render() {
    const { flowActivityId, flowTaskId } = this.props;
    return (
      <Modal
        modalProps={{ shouldCloseOnOverlayClick: false }}
        className="bmrg--c-modal c-modal-task-log"
        ModalTrigger={() => <div className="s-task-log-trigger">View Log</div>}
        modalContent={(closeModal, rest) => (
          <ModalFlow
            headerTitle="Execution Log"
            headerSubtitle={this.props.flowTaskName}
            closeModal={closeModal}
            theme="bmrg-white"
            {...rest}
          >
            <ScrollFollow
              startFollowing={true}
              render={({ follow, onScroll }) => (
                <LazyLog
                  url={`${BASE_SERVICE_URL}/activity/${flowActivityId}/log/${flowTaskId}`}
                  follow={follow}
                  onScroll={onScroll}
                  fetchOptions={{
                    credentials: "include"
                  }}
                  onError={err => console.log(err)}
                  selectableLines={true}
                />
              )}
            />
          </ModalFlow>
        )}
      />
    );
  }
}*/

export default function TaskExecutionLog({ flowActivityId, flowTaskId, flowTaskName }) {
  const [follow, setFollow] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <Modal
      className={cx("bmrg--c-modal", "c-modal-task-log")}
      modalProps={{ shouldCloseOnOverlayClick: false }}
      modalTriggerProps={{ tabIndex: "0" }}
      ModalTrigger={LogViewerTrigger}
      modalContent={(closeModal, rest) => (
        <ModalFlow
          headerTitle="Execution Log"
          headerSubtitle={flowTaskName}
          closeModal={closeModal}
          theme="bmrg-white"
          {...rest}
        >
          <ScrollFollow
            startFollowing={true}
            render={({ onScroll }) => (
              <>
                <div className="b-task-log-toggle">
                  <label className={cx("b-task-log-toggle__text", { "--disabled": !!error })} htmlFor="task-log-toggle">
                    Follow log
                  </label>
                  <Toggle
                    id="task-log-toggle"
                    checked={follow}
                    onChange={() => setFollow(!follow)}
                    defaultValue={follow}
                    disabled={!!error}
                    theme="bmrg-white"
                  />
                </div>

                <LazyLog
                  enableSearch={true}
                  fetchOptions={{
                    credentials: "include"
                  }}
                  follow={follow}
                  onScroll={onScroll}
                  onError={err => setError(err)}
                  selectableLines={true}
                  stream={true}
                  url={`${BASE_SERVICE_URL}/activity/${flowActivityId}/log/${flowTaskId}`}
                  //fetchOptions={{ credentials: "same-origin" }}
                />
              </>
            )}
          />
        </ModalFlow>
      )}
    />
  );
}
