//@ts-nocheck
import React from "react";
import { CodeSnippet, Button, ModalBody, ModalFooter } from "@carbon/react";
import { ModalForm } from "@boomerang-io/carbon-addons-boomerang-react";
import copy from "copy-to-clipboard";
import { serviceUrl } from "Config/servicesConfig";
import styles from "./BuildWebhookModalContent.module.scss";

interface BuildWebhookModalContentProps {
  closeModal: Function;
  workflowId: string;
}

const BuildWebhookModalContent: React.FC<BuildWebhookModalContentProps> = ({ workflowId, closeModal }) => {
  const resourceUrl = serviceUrl.resourceTrigger();
  const webhookURL = `${resourceUrl}/webhook?workflow=${workflowId}`;

  return (
    <ModalForm>
      <ModalBody>
        <div className={styles.container}>
          <>
            <p>
              Webhooks are used to receive data as it happens, as opposed to polling an API (calling an API
              intermittently) to see if data is available. When you create a webhook, you specify a URL and subscribe to
              events that occur. When an event that your webhook is subscribed to occurs a HTTP request with data about
              the event to the URL that you specified.
            </p>
            <h2 className={styles.sectionHeader}>Configuring Webhooks</h2>
            <p>
              Configure an external service to push events that execute this workflow with the following URL. Add a
              token to the URL using{" "}
              <CodeSnippet type="inline" hideCopyButton className={styles.codeSnippetInline}>
                &access_token=TOKEN
              </CodeSnippet>
              . Actual tokens are only shown at token creation time.
            </p>
            <CodeSnippet
              type="single"
              copyButtonDescription="Copy URL"
              feedback="Copied to clipboard"
              onClick={() => copy(webhookURL)}
              className={styles.codeSnippet}
            >
              POST{"  "}
              {`${resourceUrl}/webhook?workflow=${workflowId}
                &access_token=TOKEN`}
            </CodeSnippet>
          </>

          <h2 className={styles.sectionHeader}>Authentication</h2>
          <p className={styles.sectionDetail}>
            There are two main ways to add authentication: Authorization header or by adding{" "}
            <CodeSnippet type="inline" hideCopyButton className={styles.codeSnippetInline}>
              &access_token=TOKEN
            </CodeSnippet>{" "}
            to the URL. The actual token is only shown at creation time.
          </p>
        </div>
      </ModalBody>
      <ModalFooter style={{ bottom: "0", position: "absolute", width: "100%" }}>
        <Button kind="secondary" type="button" onClick={closeModal}>
          Cancel
        </Button>
      </ModalFooter>
    </ModalForm>
  );
};

export default BuildWebhookModalContent;
