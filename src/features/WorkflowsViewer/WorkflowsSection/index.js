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
    updateWorkflows: PropTypes.func.isRequired
  };

  render() {
    const { team, history } = this.props;
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
            team.workflows.map(workflow=>{
              return <WorkflowCard workflow={workflow} updateWorkflows={this.props.updateWorkflows} teamId={team.id}/>
            })
          }
        </div>
      </div>
    );
  }
}

export default withRouter(WorkflowSection);
