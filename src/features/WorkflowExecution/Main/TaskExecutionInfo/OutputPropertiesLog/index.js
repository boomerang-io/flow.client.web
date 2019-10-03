import React from "react";
import PropTypes from "prop-types";
import ReactJson from "react-json-view";
import { ModalFlow } from "@boomerang/carbon-addons-boomerang-react";
import { ModalBody } from "carbon-components-react";
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
      <ModalFlow
        confirmModalProps={{
          title: "Close Modal Flow?"
        }}
        modalHeaderProps={{
          title: "Output Properties",
          label: `${flowTaskName}`
        }}
        modalTrigger={({ openModal }) => (
          <button className="s-task-log-trigger" onClick={openModal}>
            View
          </button>
        )}
      >
        <ModalBody style={{ width: "40rem", display: "block", alignSelf: "center", height: "30rem" }}>
          <Tabs
            theme="bmrg-flow"
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
        </ModalBody>
      </ModalFlow>
    );
  }
}

export default OutputPropertiesLog;
