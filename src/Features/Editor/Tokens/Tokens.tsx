import React from "react";
import { Helmet } from "react-helmet";
import { Workflow } from "Types";
import TokenSection from "./TokenSection";
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
      <TokenSection
        workflowId={workflow.id}
        paragraph="Workflow access tokens allow other apps to access the APIs as if they were this Workflow. Be careful how you
            distribute these tokens!"
      />
    </div>
  );
}

export default Tokens;
