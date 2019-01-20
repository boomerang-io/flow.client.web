import React from "react";
import PropTypes from "prop-types";
import Modal from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import Styles from "react-lazylog"; //TODO: remove need for this. imported to get the styles but not used. es5 doesn't import styles for whatever reason
import { LazyLog, ScrollFollow } from "react-lazylog/es5";
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

  // componentDidMount() {
  //   //this.fetchLog();
  //   // this.fetchCountInterval = setInterval(
  //   //   () => this.setState(prevState => ({ fetchCount: prevState.fetchCount + 1 })),
  //   //   10000
  //   // ); //to trick it into fetching multiple times by passing a different url
  // }

  //TODO: update code below to check if task has completed and clear interval
  // componentDidUpdate() {
  //   // if (this.props.flowTaskStatus === EXECUTION_STATUSES.COMPLETED) {
  //   //   clearInterval(this.interval);
  //   // }
  // }

  // componentWillUnmount() {
  //   clearInterval(this.fetchCountInterval);
  // }

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
    //const { flowActivityId, flowTaskId } = this.props;
    return (
      <Modal
        className="bmrg--c-modal c-modal-task-log"
        ModalTrigger={() => <div className="s-task-log-trigger">Log</div>}
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
                  url={`http://localhost:3000/api/log`}
                  follow={follow}
                  onScroll={onScroll}
                  // fetchOptions={{
                  //   credentials: "include"
                  // }}
                  onError={err => console.log(err)}
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
