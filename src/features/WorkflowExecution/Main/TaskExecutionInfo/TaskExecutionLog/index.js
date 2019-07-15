import React from "react";
import PropTypes from "prop-types";
import Modal from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
// eslint-disable-next-line
import ReactLazyLog from "react-lazylog"; //TODO: remove need for this. imported to get the styles but not used. es5 doesn't import styles for whatever reason
import { LazyLog, ScrollFollow } from "react-lazylog/es5";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import "./styles.scss";

class TaskExecutionLog extends React.Component {
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
}

export default TaskExecutionLog;
