import React, { useState } from "react";
import axios from "axios";
import CopyToClipboard from "react-copy-to-clipboard";
import { ConfirmModal, notify, ToastNotification, TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import { serviceUrl } from "Config/servicesConfig";
import { CopyFile16, TrashCan16, ViewFilled16 } from "@carbon/icons-react";
import { ModalTriggerProps } from "Types";
import styles from "./Token.module.scss";

interface TokenProps {
  token: {
    token: string;
    label: string;
  };
  tokenData: [TokenProps["token"]];
  workflowId: string;
  formikPropsSetFieldValue: Function;
  canEditWorkflow: boolean;
}

const Token: React.FC<TokenProps> = ({ workflowId, token, tokenData, formikPropsSetFieldValue, canEditWorkflow }) => {
  const [isDisplayingPassword, setIsDisplayingPassword] = useState(false);
  const [copyTokenText, setCopyTokenText] = useState("Copy Token");

  const tokenToDisplay = isDisplayingPassword ? token.token : token.token.toString().replace(/./g, "*");

  const deleteToken = async () => {
    axios
      .delete(serviceUrl.postCreateWorkflowToken({ workflowId, label: encodeURI(token.label) }))
      .then(() => {
        let newTokens = tokenData.filter((tok) => tok.label !== token.label);

        formikPropsSetFieldValue(`tokens`, newTokens);

        notify(<ToastNotification kind="success" title="Delete Token" subtitle={`Successfully deleted token`} />);
      })
      .catch(() => {
        notify(<ToastNotification kind="error" title="Something's wrong" subtitle={`Failed to delete token`} />);
      });
  };

  return (
    <dl className={styles.detailedListContainer}>
      <dt className={styles.detailedListTitle}>{tokenToDisplay}</dt>
      <dd className={styles.actionableNameContainer}>
        <span className={styles.detailedListDescription}>{token.label}</span>
        <div className={styles.actionContainer}>
          <TooltipHover direction="top" content={isDisplayingPassword ? "Hide Token" : "Show Token"}>
            <button
              className={styles.actionButton}
              onClick={() => setIsDisplayingPassword(!isDisplayingPassword)}
              type="button"
              disabled={!canEditWorkflow}
            >
              <ViewFilled16 fill={"#0072C3"} className={styles.actionIcon} alt="Show/Hide token" />
            </button>
          </TooltipHover>
          <TooltipHover direction="top" content={copyTokenText} hideOnClick={false}>
            <div>
              <CopyToClipboard text={token.token}>
                <button
                  className={styles.actionButton}
                  onClick={() => setCopyTokenText("Copied Token")}
                  onMouseLeave={() => setCopyTokenText("Copy Token")}
                  type="button"
                  disabled={!canEditWorkflow}
                >
                  <CopyFile16 fill={"#0072C3"} className={styles.actionIcon} alt="Copy token" />
                </button>
              </CopyToClipboard>
            </div>
          </TooltipHover>
          <div>
            <ConfirmModal
              affirmativeAction={deleteToken}
              children="The token will be invalidated"
              title="Delete token"
              affirmativeButtonProps={{ kind: "danger" }}
              affirmativeText="Delete"
              negativeText="Cancel"
              modalTrigger={({ openModal }: ModalTriggerProps) => (
                <TooltipHover direction="top" content={"Delete"}>
                  <button className={styles.actionButton} type="button" onClick={openModal} disabled={!canEditWorkflow}>
                    <TrashCan16 fill={"#da1e28"} className={styles.actionIcon} alt="Delete token" />
                  </button>
                </TooltipHover>
              )}
            />
          </div>
        </div>
      </dd>
    </dl>
  );
};

export default Token;
