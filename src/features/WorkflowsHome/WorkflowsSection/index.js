import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Button from "@boomerang/boomerang-components/lib/Button";
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import WorkflowCard from "./WorkflowCard";
import "./styles.scss";

class WorkflowSection extends Component {
  static propTypes = {
    team: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    searchQuery: PropTypes.string.isRequired,
    updateWorkflows: PropTypes.func.isRequired
  };

  render() {
    const { team, history, searchQuery } = this.props;
    let workflows = [];
    if (searchQuery) {
      workflows = team.workflows.filter(workflow => workflow.name.toLowerCase().includes(searchQuery.toLowerCase()));
    } else {
      workflows = team.workflows;
    }

    if (workflows.length > 0) {
      return (
        <div className="c-workflow-section">
          <div className="c-workflow-section__header">
            <label className="b-workflow-section__team">{team.name}</label>
          </div>
          <div className="c-workflow-section__workflows">
            {workflows.map(workflow => (
              <WorkflowCard
                workflow={workflow}
                updateWorkflows={this.props.updateWorkflows}
                teamId={team.id}
                key={workflow.id}
              />
            ))}
            <Button className="b-workflow-placeholder" onClick={() => history.push(`/creator/overview`)}>
              <div className="b-workflow-placeholder__box">
                <div data-tip data-for={team.id} className="b-workflow-placeholder__text">
                  +
                </div>
              </div>
              <Tooltip theme="bmrg-white" id={team.id}>
                Create Workflow
              </Tooltip>
            </Button>
          </div>
        </div>
      );
    }

    return null;
  }
}

export default withRouter(WorkflowSection);
