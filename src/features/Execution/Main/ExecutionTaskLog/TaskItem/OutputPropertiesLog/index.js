import React from "react";
import PropTypes from "prop-types";
import ReactJson from "react-json-view";
import { ModalFlow, ModalFlowForm } from "@boomerang/carbon-addons-boomerang-react";
import { ModalBody, Tabs, Tab } from "carbon-components-react";
import PropertiesTable from "./PropertiesTable";
import "./styles.scss";

function OutputPropertiesLog({ flowTaskName, flowTaskOutputs }) {
  let arrayProps = [];
  Object.keys(flowTaskOutputs).forEach(
    (val, index) =>
      (arrayProps = arrayProps.concat({
        id: `${val}-${index}`,
        key: val,
        value: JSON.stringify(flowTaskOutputs[val], null, 2)
      }))
  );

  return (
    <ModalFlow
      composedModalProps={{ containerClassName: "c-output-properties" }}
      confirmModalProps={{
        title: "Are you sure?",
        children: "Your changes will not be saved"
      }}
      modalHeaderProps={{
        title: "Output Properties",
        label: `${flowTaskName}`
      }}
      modalTrigger={({ openModal }) => (
        <button className="s-output-properties-trigger" onClick={openModal}>
          View Properties
        </button>
      )}
    >
      <ModalFlowForm>
        <ModalBody>
          <Tabs>
            <Tab label="Table">
              <PropertiesTable data={arrayProps} />
            </Tab>
            <Tab label="JSON">
              <div className="s-output-properties-json">
                <ReactJson
                  name={false}
                  src={flowTaskOutputs}
                  displayDataTypes={false}
                  enableDelete={false}
                  displayObjectSize={false}
                  enableEdit={false}
                  enableAdd={false}
                />
              </div>
            </Tab>
          </Tabs>
        </ModalBody>
      </ModalFlowForm>
    </ModalFlow>
  );
}

OutputPropertiesLog.propTypes = {
  flowTaskName: PropTypes.string.isRequired,
  flowTaskOutputs: PropTypes.object.isRequired
};

export default OutputPropertiesLog;
