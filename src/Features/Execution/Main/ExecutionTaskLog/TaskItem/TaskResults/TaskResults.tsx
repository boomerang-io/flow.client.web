import React from "react";
import ReactJson from "react-json-view";
import { Button, ComposedModal, ModalForm } from "@boomerang-io/carbon-addons-boomerang-react";
import { ModalBody, Tabs, Tab } from "@boomerang-io/carbon-addons-boomerang-react";
import ResultsTable from "./ResultsTable";
import styles from "./taskResults.module.scss";

type Props = {
  flowTaskName: string;
  flowTaskResults: {
    name: string;
    description: string;
    value: string;
  }[];
};

function TaskResults({ flowTaskName, flowTaskResults }: Props) {
  return (
    <ComposedModal
      composedModalProps={{ containerClassName: styles.container, shouldCloseOnOverlayClick: true }}
      confirmModalProps={{
        title: "Are you sure?",
        children: "Your changes will not be saved",
      }}
      modalHeaderProps={{
        title: "Task Results",
        label: `${flowTaskName}`,
      }}
      modalTrigger={({ openModal }: { openModal: () => void }) => (
        <Button kind="ghost" size="small" onClick={openModal}>
          View Results
        </Button>
      )}
    >
      {() => (
        <ModalForm>
          <ModalBody>
            <Tabs>
              <Tab label="Table">
                <ResultsTable data={flowTaskResults} />
              </Tab>
              <Tab label="JSON">
                <div className={styles.propertiesJson}>
                  <ReactJson
                    name={false}
                    src={flowTaskResults}
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

export default TaskResults;
