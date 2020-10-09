//@ts-nocheck
import React, { useState } from "react";
import { CodeSnippet, Dropdown, ModalBody, ModalForm } from "@boomerang-io/carbon-addons-boomerang-react";
import copy from "copy-to-clipboard";
import { BASE_URL } from "Config/servicesConfig";
import styles from "./BuildWebhookModalContent.module.scss";

interface FormProps {
  description: string;
  enableACCIntegration: boolean;
  enablePersistentStorage: boolean;
  icon: string;
  name: string;
  shortDescription: string;
  triggers: {
    manual: {
      enable: boolean;
    };
    custom: {
      enable: boolean;
      topic: string;
    };
    scheduler: {
      enable: boolean;
      schedule: string;
      timezone: string | boolean;
      advancedCron: boolean;
    };
    webhook: {
      enable: boolean;
      token: string;
    };
  };
  selectedTeam: { id: string };
  tokens: [
    {
      token: string;
      label: string;
    }
  ];
}

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
];

interface BuildWebhookModalContentProps {
  values: FormProps;
  closeModal: Function;
  workflowId: string;
}

const BuildWebhookModalContent: React.FC<BuildWebhookModalContentProps> = ({ workflowId, closeModal, values }) => {
  const [activeToken, setactiveToken] = useState(values.tokens.length > 0 ? values.tokens[0] : null);
  const [activeType, setActiveType] = useState({ label: "generic" });

  const webhookURL = `/webhook?workflowId=${workflowId}&type=${activeType.label}&access_token=${activeToken?.token}`;

  const handleChangeToken = (token) => {
    const tokenlabel = token.selectedItem?.label;
    const newSelectedToken = values.tokens.find((tok) => tok.label === tokenlabel);
    setactiveToken(newSelectedToken);
  };

  const handleChangeType = (type) => {
    const typeLabel = type.selectedItem?.label;
    const newSelectedType = webhookOptions.find((tok) => tok.label === typeLabel);
    setActiveType(newSelectedType);
  };

  return (
    <ModalForm>
      <ModalBody>
        <div className={styles.container}>
          <Dropdown
            id="Tokens"
            items={values.tokens}
            initialSelectedItem={activeToken}
            onChange={handleChangeToken}
            titleText="Select a Token"
            itemToString={(token) => (token ? token.label : "")}
            label=""
            placeholder=""
          />
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
            <p className={styles.sectionDetail}> {`${BASE_URL}/listener/webhook`} </p>
          </section>

          <section className={styles.sectionContainer}>
            <span className={styles.sectionHeader}>Token</span>
            <p className={styles.sectionDetail}> {activeToken?.token ?? "---"} </p>
          </section>

          <section className={styles.sectionContainer}>
            <span className={styles.sectionHeader}>Type</span>
            <p className={styles.sectionDetail}> {activeType?.label ?? "---"} </p>
          </section>

          {activeToken && activeType && (
            <>
              <span className={styles.sectionHeader}>Webhook URL</span>
              <div className={styles.webhookurlContainer}>
                <CodeSnippet
                  type="multi"
                  copyButtonDescription="test"
                  feedback="Copied to clipboard"
                  onClick={() => copy(webhookURL)}
                  light
                >
                  {`${BASE_URL}/
                  listener/webhook?workflowId=${workflowId}
                &type=${activeType.label}
                &access_token=${encodeURI(activeToken?.token)}`}
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
