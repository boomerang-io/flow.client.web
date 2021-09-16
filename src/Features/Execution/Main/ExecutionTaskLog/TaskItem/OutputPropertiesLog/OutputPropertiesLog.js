import React from "react";
import PropTypes from "prop-types";
import { Button, ComposedModal, ModalForm } from "@boomerang-io/carbon-addons-boomerang-react";
import { ModalBody } from "@boomerang-io/carbon-addons-boomerang-react";
import PropertiesTable from "./PropertiesTable";
import styles from "./outputPropertisLog.module.scss";

function OutputPropertiesLog({ flowTaskName, flowTaskOutputs, isOutput }) {
  let arrayProps = [];
  Object.keys(flowTaskOutputs).forEach(
    (val, index) =>
      (arrayProps = arrayProps.concat({
        id: `${val}-${index}`,
        key: val,
        value: JSON.stringify(flowTaskOutputs[val], null, 2),
      }))
  );

  return (
    <ComposedModal
      composedModalProps={{ containerClassName: styles.container, shouldCloseOnOverlayClick: true }}
      confirmModalProps={{
        title: "Are you sure?",
        children: "Your changes will not be saved",
      }}
      modalHeaderProps={{
        title: "Output Parameters",
        label: `${flowTaskName}`,
      }}
      modalTrigger={({ openModal }) => (
        <Button kind="ghost" size="small" onClick={openModal}>
          View Parameters
        </Button>
      )}
    >
      {() => (
        <ModalForm>
          <ModalBody>
            <PropertiesTable hasJsonValues={!isOutput} data={isOutput ? flowTaskOutputs : arrayProps} />
          </ModalBody>
        </ModalForm>
      )}
    </ComposedModal>
  );
}

OutputPropertiesLog.propTypes = {
  flowTaskName: PropTypes.string.isRequired,
  flowTaskOutputs: PropTypes.object.isRequired,
};

export default OutputPropertiesLog;
