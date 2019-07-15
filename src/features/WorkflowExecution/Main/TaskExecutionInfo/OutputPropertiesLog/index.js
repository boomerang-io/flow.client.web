import React from "react";
import PropTypes from "prop-types";
import ReactJson from "react-json-view";
import Modal from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import ModalContentBody from "@boomerang/boomerang-components/lib/ModalContentBody";
import Tab from "@boomerang/boomerang-components/lib/Tab";
import Tabs from "@boomerang/boomerang-components/lib/Tabs";
import PropertiesTable from "./PropertiesTable";
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
    let arrayProps = [];
    Object.keys(flowTaskOutputs).forEach(
      val => (arrayProps = arrayProps.concat({ key: val, value: JSON.stringify(flowTaskOutputs[val]) }))
    );
    return (
      <Modal
        modalProps={{ shouldCloseOnOverlayClick: false }}
        ModalTrigger={() => <button className="s-task-log-trigger">View</button>}
        modalContent={(closeModal, rest) => (
          <ModalFlow
            style={{ display: "flex", flexDirection: "column", height: "auto" }}
            headerTitle="Output Properties"
            headerSubtitle={flowTaskName}
            closeModal={closeModal}
            theme="bmrg-white"
            {...rest}
          >
            <ModalContentBody style={{ width: "40rem", display: "block", alignSelf: "center", height: "30rem" }}>
              <Tabs
                theme="bmrg-white"
                tabsListProps={{ style: { width: "100%", justifyContent: "space-around", marginBottom: "1rem" } }}
              >
                <Tab value="Table" name="table">
                  <PropertiesTable data={arrayProps} />
                </Tab>
                <Tab value="JSON" name="json">
                  <ReactJson
                    name={false}
                    src={flowTaskOutputs}
                    displayDataTypes={false}
                    enableDelete={false}
                    displayObjectSize={false}
                    enableEdit={false}
                    enableAdd={false}
                  />
                </Tab>
              </Tabs>
            </ModalContentBody>
          </ModalFlow>
        )}
      />
    );
  }
}

export default OutputPropertiesLog;
