import React from "react";
import { Button, ComposedModal, ModalForm } from "@boomerang-io/carbon-addons-boomerang-react";
import { ModalBody } from "@boomerang-io/carbon-addons-boomerang-react";
import PropertiesTable from "./PropertiesTable";
import styles from "./outputPropertisLog.module.scss";

type Props = {
  flowTaskName: string;
  flowTaskOutputs: {
    [key: string]: string;
  };
  isOutput?: boolean;
};

function OutputPropertiesLog({ flowTaskName, flowTaskOutputs, isOutput }: Props) {
  let arrayProps: { id: string; key: string; value: string; description?: string }[] = [];
  if (Array.isArray(flowTaskOutputs)) {
    flowTaskOutputs.forEach(
      (val: { name: string; description: string; value: string }, index: number) =>
        (arrayProps = arrayProps.concat({
          id: `${val.name}-${index}`,
          key: val.name,
          description: val.description ? val.description : "---",
          value: val.value ? val.value : "---",
        }))
    );
  } else {
    Object.keys(flowTaskOutputs).forEach(
      (val: string, index: number) =>
        (arrayProps = arrayProps.concat({
          id: `${val}-${index}`,
          key: val,
          value: JSON.stringify(flowTaskOutputs[val], null, 2),
        }))
    );
  }

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
      modalTrigger={({ openModal }: { openModal: () => void }) => (
        <Button kind="ghost" size="small" onClick={openModal}>
          View Parameters
        </Button>
      )}
    >
      {() => (
        <ModalForm>
          <ModalBody>
            <PropertiesTable
              hasJsonValues={!isOutput && !Array.isArray(flowTaskOutputs)}
              data={isOutput ? flowTaskOutputs : arrayProps}
            />
          </ModalBody>
        </ModalForm>
      )}
    </ComposedModal>
  );
}

export default OutputPropertiesLog;
