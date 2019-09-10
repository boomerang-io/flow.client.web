import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import CreateWorkflow from "./CreateWorkflow";
import ImportWorkflow from "./ImportWorkflow";
import WorkflowCard from "./WorkflowCard";
import "./styles.scss";

class WorkflowSection extends Component {
  static propTypes = {
    team: PropTypes.object.isRequired,
    teams: PropTypes.array.isRequired,
    searchQuery: PropTypes.string.isRequired,
    setActiveTeamAndRedirect: PropTypes.func.isRequired,
    fetchTeams: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired,
    deleteWorkflow: PropTypes.func.isRequired,
    setActiveTeam: PropTypes.func.isRequired
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
      <section className="c-workflow-section">
        <div className="c-workflow-section__header">
          <h1 className="b-workflow-section__team">{team.name}</h1>
          <ImportWorkflow fetchTeams={fetchTeams} teamId={team.name} />
          <Tooltip id={team.name}>Import Workflow</Tooltip>
        </div>
        <div className="c-workflow-section__workflows">
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
