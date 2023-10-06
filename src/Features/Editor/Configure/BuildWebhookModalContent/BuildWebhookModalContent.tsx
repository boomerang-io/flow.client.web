//@ts-nocheck
import React, { useState } from "react";
import { CodeSnippet, Dropdown, ModalBody } from "@carbon/react";
import { ModalForm } from "@boomerang-io/carbon-addons-boomerang-react";
import copy from "copy-to-clipboard";
import { serviceUrl } from "Config/servicesConfig";
import { ConfigureWorkflowFormValues } from "Types";
import styles from "./BuildWebhookModalContent.module.scss";

const webhookOptions = [
  {
    label: "generic",
  },
  {
    label: "slack",
  },
  {
    label: "dockerhub",
  },
  {
    label: "github",
  },
];

interface BuildWebhookModalContentProps {
  values: ConfigureWorkflowFormValues;
  closeModal: Function;
  workflowId: string;
}

const BuildWebhookModalContent: React.FC<BuildWebhookModalContentProps> = ({ workflowId, closeModal, values }) => {
  const [activeType, setActiveType] = useState({ label: "generic" });

  const resourceUrl = serviceUrl.resourceTriggers();
  const webhookURL = `${resourceUrl}/webhook?workflow=${workflowId}&type=${activeType.label}`;

  const handleChangeType = (type) => {
    const newSelectedType = webhookOptions.find((tok) => tok.label === type.selectedItem?.label);
    setActiveType(newSelectedType);
  };

  return (
    <ModalForm>
      <ModalBody>
        <div className={styles.container}>
          <Dropdown
            id="Type"
            items={webhookOptions}
            initialSelectedItem={activeType}
            onChange={handleChangeType}
            titleText="Select a Type"
            itemToString={(wh) => wh.label}
            label="Type"
            placeholder="Type"
          />
          <section className={styles.sectionContainer}>
            <span className={styles.sectionHeader}>Webhook Prefix</span>
            <p className={styles.sectionDetail}> {`${resourceUrl}/webhook`} </p>
          </section>
          <section className={styles.sectionContainer}>
            <span className={styles.sectionHeader}>Type</span>
            <p className={styles.sectionDetail}> {activeType?.label ?? "---"} </p>
          </section>
          <section className={styles.sectionContainer}>
            <span className={styles.sectionHeader}>Token</span>
            <p className={styles.sectionDetail}>
              There are two main ways to add authentication: Authorization header or by adding '&access_token=' to the
              URL. The actual token is only shown at creation time.
            </p>
          </section>
          {activeType && (
            <>
              <span className={styles.sectionHeader}>Webhook URL</span>
              <div className={styles.webhookurlContainer}>
                <CodeSnippet
                  type="multi"
                  copyButtonDescription="test"
                  feedback="Copied to clipboard"
                  onClick={() => copy(webhookURL)}
                  className={styles.codeSnippet}
                >
                  {`${resourceUrl}/webhook?workflow=${workflowId}
                &type=${activeType.label}&access_token=TOKEN`}
                </CodeSnippet>
              </div>
            </>
          )}
        </div>
      </ModalBody>
    </ModalForm>
  );
};

export default BuildWebhookModalContent;
