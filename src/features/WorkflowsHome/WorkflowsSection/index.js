import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Button from "@boomerang/boomerang-components/lib/Button";
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import ImportWorkflow from "./ImportWorkflow";
import WorkflowCard from "./WorkflowCard";
import "./styles.scss";

class WorkflowSection extends Component {
  static propTypes = {
    team: PropTypes.object.isRequired,
    importWorkflow: PropTypes.object.isRequired,
    searchQuery: PropTypes.string.isRequired,
    setActiveTeamAndRedirect: PropTypes.func.isRequired,
    fetchTeams: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired,
    deleteWorkflow: PropTypes.func.isRequired,
    handleImportWorkflow: PropTypes.func.isRequired,
    setActiveTeam: PropTypes.func.isRequired
  };

  render() {
    const {
      deleteWorkflow,
      executeWorkflow,
      fetchTeams,
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
      <div className="c-workflow-section">
        <div className="c-workflow-section__header">
          <label className="b-workflow-section__team">{team.name}</label>
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
          <Button className="b-workflow-placeholder" onClick={() => setActiveTeamAndRedirect(team.id)}>
            <div className="b-workflow-placeholder__box">
              <div data-tip data-for={team.id} className="b-workflow-placeholder__text">
                +
              </div>
            </div>
            <Tooltip id={team.id}>Create Workflow</Tooltip>
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(WorkflowSection);
