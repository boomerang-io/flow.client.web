import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAppContext } from "Hooks";
import { useMutation, queryCache } from "react-query";
import { useHistory } from "react-router-dom";
import { notify, ToastNotification, Error404 } from "@boomerang/carbon-addons-boomerang-react";
import WelcomeBanner from "Components/WelcomeBanner";
import CreateWorkflow from "./CreateWorkflow";
import WorkflowsHeader from "./WorkflowsHeader";
import WorkflowCard from "./WorkflowCard";
import cx from "classnames";
import sortBy from "lodash/sortBy";
import { appLink } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import styles from "./workflowHome.module.scss";

const BANNER_STORAGE_ID = "bmrg-flow-hideWelcomeBanner";

export default function WorkflowsHome() {
  const history = useHistory();

  const { onBoardShow, setOnBoardShow, teams } = useAppContext();
  const [deleteWorkflowMutator, { status: deleteWorkflowStatus }] = useMutation(resolver.deleteWorkflow, {
    onSuccess: () => queryCache.refetchQueries(serviceUrl.getTeams()),
  });

  const [executeWorkflowMutator, { status: executeWorkflowStatus }] = useMutation(resolver.postExecuteWorkflow);

  const [isWelcomeBannerOpen, setIsWelcomeBannerOpen] = useState(true);
  const [isWelcomeBannerShown, setIsWelcomeBannerShown] = useState(
    window.localStorage.getItem(BANNER_STORAGE_ID) !== "true"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [teamsFilter, setTeamsFilter] = useState([]);

  useEffect(() => {
    setIsWelcomeBannerShown(!onBoardShow);
  }, [onBoardShow]);

  useEffect(() => {
    if (!isWelcomeBannerOpen && !isWelcomeBannerShown) {
      window.localStorage.setItem(BANNER_STORAGE_ID, true);
    }
  }, [isWelcomeBannerOpen, isWelcomeBannerShown]);

  const handleSearchFilter = (searchQuery, teams) => {
    setSearchQuery(searchQuery);
    setTeamsFilter(Array.isArray(teams) && teams.length ? teams : []);
  };

  const filterTeams = () => {
    if (teamsFilter.length > 0) {
      return teams.filter((team) => teamsFilter.find((filter) => filter.text === team.name));
    } else {
      return teams;
    }
  };

  const handleDeleteWorkflow = async ({ workflowId, teamId }) => {
    try {
      await deleteWorkflowMutator({ id: workflowId });
      notify(<ToastNotification kind="success" title="Delete Workflow" subtitle="Workflow successfully deleted" />);
    } catch {
      notify(<ToastNotification kind="error" title="Something's Wrong" subtitle="Request to delete workflow failed" />);
    }
  };

  const handleExecuteWorkflow = async ({ workflowId, redirect = false, properties = {} }) => {
    try {
      const { data: execution } = await executeWorkflowMutator({ id: workflowId, properties });
      notify(
        <ToastNotification kind="success" title="Run Workflow" subtitle="Successfully started workflow execution" />
      );
      if (redirect) {
        history.push({
          pathname: appLink.execution({ executionId: execution.id, workflowId }),
          state: { fromUrl: appLink.workflows(), fromText: "Workflows" },
        });
      }
    } catch {
      notify(<ToastNotification kind="error" title="Something's wrong" subtitle="Failed to run workflow" />);
    }
  };

  const handleOpenTutorial = () => {
    setOnBoardShow(true);
  };

  const handleToggleIsWelcomeBannerOpen = () => {
    setIsWelcomeBannerOpen((prevState) => !prevState);
  };

  const handleHideWelcomeBanner = () => {
    setIsWelcomeBannerOpen(false);
    setIsWelcomeBannerShown(false);
  };

  const filteredTeams = filterTeams();
  const sortedTeams = sortBy(filteredTeams, ["name"]);
  const workflowsLength = teams.reduce((acc, team) => team.workflows.length + acc, 0);

  return (
    <>
      {isWelcomeBannerShown && (
        <WelcomeBanner
          hide={handleHideWelcomeBanner}
          isOpen={isWelcomeBannerOpen}
          openTutorial={handleOpenTutorial}
          toggleIsOpen={handleToggleIsWelcomeBannerOpen}
        />
      )}
      <div
        className={cx(styles.container, {
          [styles.bannerClosed]: !isWelcomeBannerOpen || onBoardShow,
          [styles.bannerHidden]: !isWelcomeBannerShown,
        })}
      >
        <WorkflowsHeader handleSearchFilter={handleSearchFilter} workflowsLength={workflowsLength} options={teams} />
        <main className={styles.content}>
          {sortedTeams.length > 0 ? (
            sortedTeams.map((team) => {
              return (
                <TeamWorkflows
                  deleteWorkflow={handleDeleteWorkflow}
                  executeWorkflow={handleExecuteWorkflow}
                  key={team.id}
                  searchQuery={searchQuery}
                  team={team}
                  teams={teams}
                />
              );
            })
          ) : (
            <Error404 header={null} message={"You need to be a member of a team to use Flow"} title="No teams found" />
          )}
        </main>
      </div>
    </>
  );
}

TeamWorkflows.propTypes = {
  deleteWorkflow: PropTypes.func.isRequired,
  executeWorkflow: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  team: PropTypes.object.isRequired,
};

function TeamWorkflows({ children, deleteWorkflow, executeWorkflow, searchQuery, team, teams }) {
  let workflows = [];
  if (searchQuery) {
    workflows = team.workflows.filter((workflow) => workflow.name.toLowerCase().includes(searchQuery.toLowerCase()));
  } else {
    workflows = team.workflows;
  }

  const hasTeamWorkflows = team.workflows.length > 0;

  return (
    <section className={styles.sectionContainer}>
      <div className={styles.header}>
        <h1 className={styles.team}>{`${team.name} (${workflows.length})`}</h1>
        {!hasTeamWorkflows && (
          <p className={styles.noWorkflowsMessage}>
            This team doesn’t have any Workflows - be the first to take the plunge.
          </p>
        )}
      </div>
      <div className={styles.workflows}>
        {workflows.map((workflow) => (
          <WorkflowCard
            deleteWorkflow={deleteWorkflow}
            executeWorkflow={executeWorkflow}
            key={workflow.id}
            teamId={team.id}
            workflow={workflow}
          />
        ))}
        <CreateWorkflow team={team} teams={teams} />
      </div>
    </section>
  );
}
