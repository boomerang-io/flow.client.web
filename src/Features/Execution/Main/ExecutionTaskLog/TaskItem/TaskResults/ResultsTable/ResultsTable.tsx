import React from "react";
import {
  StructuredListCell,
  StructuredListBody,
  StructuredListHead,
  StructuredListRow,
  StructuredListWrapper,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { NoDisplay } from "@boomerang-io/carbon-addons-boomerang-react";
import styles from "./resultsTable.module.scss";

type Props = {
  data: {
    name: string;
    description: string;
    value: string;
  }[];
};

function ResultsTable({ data: results }: Props) {
  return (
    <div className={styles.tableContainer}>
      {results && results.length > 0 ? (
        <StructuredListWrapper selection>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head>Name</StructuredListCell>
              <StructuredListCell head>Description</StructuredListCell>
              <StructuredListCell head>Value</StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {results.map((result, i) => (
              <StructuredListRow key={`row-${i}`}>
                <StructuredListCell>{result.name}</StructuredListCell>
                <StructuredListCell>{result.description}</StructuredListCell>
                <StructuredListCell>
                  {<code className={styles.code}>{JSON.stringify(result.value, null, 2)}</code>}
                </StructuredListCell>
              </StructuredListRow>
            ))}
          </StructuredListBody>
        </StructuredListWrapper>
      ) : (
        <NoDisplay text="No results to display" />
      )}
    </div>
  );
}

export default ResultsTable;
