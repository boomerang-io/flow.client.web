import React from "react";
import PropTypes from "prop-types";
//import axios from "axios";
import Modal from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import { LazyLog, ScrollFollow } from "react-lazylog";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
//import TextArea from "@boomerang/boomerang-components/lib/TextArea";
// import { EXECUTION_STATUSES } from "Constants/workflowExecutionStatuses";
import "./styles.scss";

class TaskExecutionLog extends React.Component {
  static propTypes = {
    flowActivityId: PropTypes.string.isRequired,
    flowTaskId: PropTypes.string.isRequired,
    flowTaskName: PropTypes.string.isRequired
    // flowTaskStatus: PropTypes.string.isRequired
  };

  state = {
    log: "",
    error: undefined,
    fetchCount: 0
  };

  componentDidMount() {
    //this.fetchLog();
    this.fetchCountInterval = setInterval(() => this.setState(prevState => ({ fetchCount: prevState + 1 })), 3000); //to trick it into fetching multiple times by passing a different url
  }

  //TODO: update code below to check if task has completed and clear interval
  componentDidUpdate() {
    // if (this.props.flowTaskStatus === EXECUTION_STATUSES.COMPLETED) {
    //   clearInterval(this.interval);
    // }
  }

  componentWillUnmount() {
    clearInterval(this.fetchCountInterval);
  }

  /*fetchLog() {
    const { flowActivityId, flowTaskId } = this.props;
    axios
      .get(`${BASE_SERVICE_URL}/activity/${flowActivityId}/log/${flowTaskId}?count=${this.state.fetchCount}`)
      .then(response => {
        this.setState({
          log: response.data.log
        });
      })
      .catch(err => this.setState({ error: err }));
  }*/

  render() {
    const { flowActivityId, flowTaskId } = this.props;
    //this.fetchLog();
    return (
      <Modal
        ModalTrigger={() => <div className="s-task-log-trigger">Log</div>}
        modalContent={(closeModal, rest) => (
          <ModalFlow
            headerTitle="Execution Log"
            headerSubtitle={this.props.flowTaskName}
            closeModal={closeModal}
            theme="bmrg-white"
            {...rest}
          >
            <div className="c-task-log-viewer">
              <ScrollFollow
                startFollowing={true}
                render={({ follow, onScroll }) => (
                  <LazyLog
                    url={`${BASE_SERVICE_URL}/activity/${flowActivityId}/log/${flowTaskId}?count=${
                      this.state.fetchCount
                    }`}
                    follow={follow}
                    onScroll={onScroll}
                    fetchOptions={{
                      credentials: "include"
                    }}
                    onError={err => console.log(err)}
                    stream
                  />
                )}
              />
              {/*<TextArea
                externallyControlled
                value={this.state.log || "No Log to display"}
                placeholder="log"
                name="log"
                theme="bmrg-white"
              />*/}
            </div>
          </ModalFlow>
        )}
      />
    );
  }
}

export default TaskExecutionLog;
