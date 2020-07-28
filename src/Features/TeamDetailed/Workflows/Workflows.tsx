import React from "react";
import { Link } from "react-router-dom";
import {
  Error404,
  Search,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
} from "@boomerang-io/carbon-addons-boomerang-react";

import ms from "match-sorter";
import sortBy from "lodash/sortBy";
import { appLink } from "Config/appConfig";
import { FlowTeam } from "Types";
import styles from "./Workflows.module.scss";

function Workflows({ team }: { team: FlowTeam }) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const { workflows } = team;
  const filteredWorkflowsList = searchQuery ? ms(workflows, searchQuery, { keys: ["name", "description"] }) : workflows;

  return (
    <section aria-label={`${team.name} Team Workflows`} className={styles.container}>
      <section className={styles.actionsContainer}>
        <div className={styles.leftActions}>
          <p className={styles.featureDescription}>These are the workflows for this Team.</p>
          <p className={styles.workflowCountText}>
            Showing {filteredWorkflowsList.length} workflow{filteredWorkflowsList.length !== 1 ? "s" : ""}
          </p>
          <Search
            labelText="workflow search"
            id="workflow-search"
            placeHolderText="Search for a workflow"
            onChange={(e: React.FormEvent<HTMLInputElement>) => setSearchQuery(e.currentTarget.value)}
          />
        </div>
      </section>
      {filteredWorkflowsList.length > 0 ? (
        <StructuredListWrapper>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head>Name</StructuredListCell>
              <StructuredListCell head>Summary</StructuredListCell>
              <StructuredListCell head>Revision Count</StructuredListCell>
              <StructuredListCell head />
              <StructuredListCell head />
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {sortBy(filteredWorkflowsList, "name").map((workflow) => {
              return (
                <StructuredListRow key={workflow.id}>
                  <StructuredListCell>
                    <div className={styles.workflowNameContainer}>
                      <p>{workflow.name}</p>
                    </div>
                  </StructuredListCell>
                  <StructuredListCell>
                    {workflow.shortDescription !== "" ? workflow.shortDescription : "---"}
                  </StructuredListCell>
                  <StructuredListCell>{workflow.revisionCount}</StructuredListCell>
                  <StructuredListCell>
                    <Link
                      className={styles.viewWorkflowLink}
                      to={{
                        pathname: appLink.editorDesigner({ teamId: team.id, workflowId: workflow.id }),
                        state: { fromTeam: { id: team.id, name: team.name } },
                      }}
                    >
                      View/edit
                    </Link>
                  </StructuredListCell>
                  <StructuredListCell>
                    <Link
                      className={styles.viewWorkflowLink}
                      to={{
                        pathname: appLink.workflowActivity({ workflowId: workflow.id }),
                        state: { fromTeam: { id: team.id, name: team.name } },
                      }}
                    >
                      Activity
                    </Link>
                  </StructuredListCell>
                </StructuredListRow>
              );
            })}
          </StructuredListBody>
        </StructuredListWrapper>
      ) : (
        <Error404 title="Nothing to see here" header={null} message={null} />
      )}
    </section>
  );
}

export default Workflows;
