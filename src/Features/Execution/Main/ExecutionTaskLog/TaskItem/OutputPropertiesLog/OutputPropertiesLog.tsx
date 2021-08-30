import React from "react";
import ReactJson from "react-json-view";
import { Button, ComposedModal, ModalForm } from "@boomerang-io/carbon-addons-boomerang-react";
import { ModalBody, Tabs, Tab } from "@boomerang-io/carbon-addons-boomerang-react";
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
  let arrayProps: {id: string; key: string; value: string;}[] = [];
  Object.keys(flowTaskOutputs).forEach(
    (val: string, index: number) =>
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
      modalTrigger={({ openModal }: { openModal: () => void }) => (
        <Button kind="ghost" size="small" onClick={openModal}>
          View Parameters
        </Button>
      )}
    >
      {() => (
        <ModalForm>
          <ModalBody>
            <Tabs>
              <Tab label="Table">
                <PropertiesTable hasJsonValues={!isOutput} data={isOutput ? flowTaskOutputs : arrayProps} />
              </Tab>
              <Tab label="JSON">
                <div className={styles.propertiesJson}>
                  <ReactJson
                    name={false}
                    src={flowTaskOutputs}
                    displayDataTypes={false}
                    //@ts-ignore
                    enableDelete={false}
                    displayObjectSize={false}
                    enableEdit={false}
                    enableAdd={false}
                  />
                </div>
              </Tab>
            </Tabs>
          </ModalBody>
        </ModalForm>
      )}
    </ComposedModal>
  );
}

export default OutputPropertiesLog;
