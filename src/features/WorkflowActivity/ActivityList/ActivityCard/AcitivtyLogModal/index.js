import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Modal from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import ModalContentBody from "@boomerang/boomerang-components/lib/ModalContentBody";
import { ACTIVITY_STATUSES } from "Constants/activityStatuses";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";

export default class ActivityLogModal extends Component {
  static propTypes = {
    activityId: PropTypes.string.isRequired,
    activityStatus: PropTypes.string.isRequired,
    taskId: PropTyes.string.isRequired
  };

  state = {
    log: ""
  };
  componentDidMount() {
    if (this.props.activityStatus !== ACTIVITY_STATUSES.COMPLETED) {
      this.interval = setInterval(this.fetchLog, 3000);
    }
  }

  fetchLog = () => {
    axios
      .get(`${BASE_SERVICE_URL}/${activityId}/log/${taskId}`)
      .then(response => this.setState({ log: response.data.message }));
  };

  render() {
    return (
      <Modal
        ModalTrigger={() => <div>View Log</div>}
        modalContent={(closeModal, ...rest) => (
          <ModalFlow closeModal={closeModal} theme="bmrg-white" headerTitle="Activity Log">
            <ModalContentBody>Content</ModalContentBody>
          </ModalFlow>
        )}
      />
    );
  }
}
