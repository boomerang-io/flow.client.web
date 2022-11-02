import React from "react";
import ReactMarkdown from "react-markdown";
import { ModalBody } from "@carbon/react";
import { ModalForm } from "@boomerang-io/carbon-addons-boomerang-react";
import styles from "./errorModal.module.scss";
import "Styles/markdown.css";

interface ErrorModalProps {
  errorCode: string;
  errorMessage: string;
}

function ErrorModal({ errorCode, errorMessage }: ErrorModalProps) {
  return (
    <ModalForm>
      <ModalBody>
        <section className={styles.detailedSection}>
          <span className={styles.sectionHeader}>Error Code</span>
          <p className={styles.sectionDetail}>{errorCode}</p>
        </section>
        <section className={styles.detailedSection}>
          <span className={styles.sectionHeader}>Error Message</span>
          <ReactMarkdown className="markdown-body" source={errorMessage} />
        </section>
      </ModalBody>
    </ModalForm>
  );
}

export default ErrorModal;
