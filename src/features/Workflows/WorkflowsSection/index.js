import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import CreateWorkflow from "./CreateWorkflow";
import ImportWorkflow from "./ImportWorkflow";
import WorkflowCard from "./WorkflowCard";
import styles from "./workflowsSection.module.scss";

class WorkflowSection extends Component {
  static propTypes = {
    deleteWorkflow: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired,
    fetchTeams: PropTypes.func.isRequired,
    searchQuery: PropTypes.string.isRequired,
    setActiveTeam: PropTypes.func.isRequired,
    setActiveTeamAndRedirect: PropTypes.func.isRequired,
    team: PropTypes.object.isRequired
  };

  render() {
    const {
      deleteWorkflow,
      executeWorkflow,
      fetchTeams,
      history,
      setActiveTeam,
      setActiveTeamAndRedirect,
      searchQuery,
      team
    } = this.props;

    let workflows = [];
    if (searchQuery) {
      workflows = team.workflows.filter(workflow => workflow.name.toLowerCase().includes(searchQuery.toLowerCase()));
    } else {
      workflows = team.workflows;
    }

    return (
      <section className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.team}>{`${team.name} (${workflows.length})`}</h1>
          <ImportWorkflow fetchTeams={fetchTeams} teamId={team.id} />
        </div>
        <div className={styles.workflows}>
          {workflows.map(workflow => (
            <WorkflowCard
              deleteWorkflow={deleteWorkflow}
              executeWorkflow={executeWorkflow}
              key={workflow.id}
              setActiveTeam={setActiveTeam}
              teamId={team.id}
              workflow={workflow}
            />
          ))}
          <CreateWorkflow
            team={team}
            setActiveTeamAndRedirect={setActiveTeamAndRedirect}
            history={history}
            fetchTeams={fetchTeams}
          />
        </div>
      </section>
    );
  }
}

export default withRouter(WorkflowSection);
