import React from "react";
import { Helmet } from "react-helmet";
import { Workflow } from "Types";
import TokenSection from "Components/TokenSection";
import styles from "./Tokens.module.scss";

interface TokensProps {
  workflow: Workflow;
}

function Tokens({ workflow }: TokensProps) {
  return (
    <div aria-label="Tokens" className={styles.container} role="region">
      <Helmet>
        <title>{`Tokens - ${workflow.name}`}</title>
      </Helmet>
      <dl className={styles.detailedListContainer}>
        <p className={styles.detailedListParagraph}>
          Workflow tokens allow other apps to access the APIs as if they were this Workflow. Be careful how you
          distribute these tokens!
        </p>
        <TokenSection type="workflow" principal={workflow.id} />
      </dl>
    </div>
  );
}

export default Tokens;
