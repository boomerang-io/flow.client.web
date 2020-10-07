//@ts-nocheck
import React, { useState } from "react";
import { Dropdown, ModalBody, ModalForm, TooltipIcon } from "@boomerang-io/carbon-addons-boomerang-react";
import CopyToClipboard from "react-copy-to-clipboard";
import { CopyFile16 } from "@carbon/icons-react";
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
  const [activeToken, setactiveToken] = useState(null);
  const [activeType, setActiveType] = useState({ label: "generic" });
  const [copyTokenText, setCopyTokenText] = useState("Copy URL");

  const webhookURL = `/webhook?workflowId=${workflowId}&type=${activeType.label}&access_token=${activeToken?.token}`;

  const handleChangeToken = (token) => {
    console.log(token);
    const tokenlabel = token.selectedItem?.label;
    const newSelectedToken = values.tokens.find((tok) => tok.label === tokenlabel);
    setactiveToken(newSelectedToken);
  };

  const handleChangeType = (type) => {
    const typeLabel = type.selectedItem?.label;
    const newSelectedType = webhookOptions.find((tok) => tok.label === typeLabel);
    setActiveType(newSelectedType);
  };

  const handleMouseClick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setCopyTokenText("Copied URL");
  };

  const handleMouseLeave = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setCopyTokenText("Copy URL");
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

          {activeToken && activeType && (
            <div className={styles.webhookurlContainer}>
              <h3 className={styles.webhookURL}>{webhookURL}</h3>
              <TooltipIcon direction="top" tooltipText={copyTokenText}>
                <CopyToClipboard text={webhookURL}>
                  <button
                    className={styles.actionButton}
                    onClick={handleMouseClick}
                    onMouseLeave={handleMouseLeave}
                    type="button"
                  >
                    <CopyFile16 fill={"#0072C3"} className={styles.actionIcon} alt="Copy URL" />
                  </button>
                </CopyToClipboard>
              </TooltipIcon>
            </div>
          )}
        </div>
      </ModalBody>
    </ModalForm>
  );
};

export default BuildWebhookModalContent;
