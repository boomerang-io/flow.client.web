import React from "react";
import PropTypes from "prop-types";
import ReactJson from "react-json-view";
import Modal from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import ModalContentBody from "@boomerang/boomerang-components/lib/ModalContentBody";
import "./styles.scss";

class OutputPropertiesLog extends React.Component {
  static propTypes = {
    flowTaskName: PropTypes.string.isRequired,
    flowTaskOutputs: PropTypes.object.isRequired
  };

  state = {
    log: "",
    error: undefined
  };

  render() {
    const { flowTaskName, flowTaskOutputs } = this.props;
    return (
      <Modal
        ModalTrigger={() => <div className="s-task-log-trigger">Output Properties</div>}
        modalContent={(closeModal, rest) => (
          <ModalFlow
            headerTitle="Output Properties"
            headerSubtitle={flowTaskName}
            closeModal={closeModal}
            theme="bmrg-white"
            {...rest}
          >
            <ModalContentBody style={{ width: "20rem", display: "block" }}>
              <ReactJson
                name={false}
                src={flowTaskOutputs}
                displayDataTypes={false}
                enableDelete={false}
                displayObjectSize={false}
                enableEdit={false}
                enableAdd={false}
              />
            </ModalContentBody>
          </ModalFlow>
        )}
      />
    );
  }
}

export default OutputPropertiesLog;
