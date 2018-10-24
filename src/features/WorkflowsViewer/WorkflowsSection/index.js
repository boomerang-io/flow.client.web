import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Button from "@boomerang/boomerang-components/lib/Button";
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
    if(searchQuery) {
      workflows = team.workflows.filter(workflow => workflow.name.toLowerCase().includes(searchQuery.toLowerCase()));
    } else {
      workflows = team.workflows;
    }

    if(workflows.length > 0) {
      return(
        <div className="c-workflow-section">
          <div className="c-workflow-section__header">
            <label className="b-workflow-section__team">{team.name}</label>
            <Button onClick={()=> history.push(`/editor`)} theme="bmrg-black">
              Create Workflow
            </Button>
          </div>
          <div className="c-workflow-section__workflows">
            {
              workflows.map(workflow=>{
                return <WorkflowCard workflow={workflow} updateWorkflows={this.props.updateWorkflows} teamId={team.id}/>
              })
            }
          </div>
        </div>
      );
    }

    return null;
  }
}

export default withRouter(WorkflowSection);
