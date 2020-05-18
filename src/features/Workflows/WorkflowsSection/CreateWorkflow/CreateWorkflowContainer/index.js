import React, { Component } from "react";
import PropTypes from "prop-types";
import { RadioGroup } from "@boomerang/carbon-addons-boomerang-react";
import CreateWorkflowContent from "../CreateWorkflowContent";
import ImportWorkflowContent from "../ImportWorkflowContent";
import styles from "./createWorkflowContainer.module.scss";

const NEW_WORKFLOW = "Start from scratch";
const IMPORT_WORKFLOW = "Import a Workflow";

const radioWorkflowOptions = [
  {
    id: "create-workflow-radio-id",
    labelText: NEW_WORKFLOW,
    value: NEW_WORKFLOW
  },
  {
    id: "import-workflow-radio-id",
    labelText: IMPORT_WORKFLOW,
    value: IMPORT_WORKFLOW
  }
];

export class CreateWorkflowContainer extends Component {
  static propTypes = {
    createWorkflow: PropTypes.func.isRequired,
    team: PropTypes.object.isRequired,
    teams: PropTypes.array.isRequired,
    isCreating: PropTypes.bool,
    handleImportWorkflowCreation: PropTypes.func.isRequired
  };

  state = {
    selectedOption: NEW_WORKFLOW
  };

  handleChangeElem = e => {
    this.setState({ selectedOption: e });
  };
  checkNames = team => {
    return team.workflows.map(workflow => workflow.name);
  };

  render() {
    const { team, teams, isCreating, closeModal, createWorkflow, handleImportWorkflowCreation } = this.props;
    return (
      <div className={styles.modalBody}>
        <RadioGroup
          name="workflow-options"
          options={radioWorkflowOptions}
          onChange={e => this.handleChangeElem(e)}
          value={this.state.selectedOption}
        />
        {this.state.selectedOption === NEW_WORKFLOW ? (
          <CreateWorkflowContent
            createWorkflow={createWorkflow}
            team={team}
            teams={teams}
            names={this.checkNames(team)}
            isCreating={isCreating}
            closeModal={closeModal}
          />
        ) : (
          <ImportWorkflowContent
            isLoading={isCreating}
            handleImportWorkflow={handleImportWorkflowCreation}
            closeModal={closeModal}
            title="Add a Workflow - Select the Workflow file you want to upload"
            confirmButtonText={isCreating ? "Creating..." : "Create"}
            team={team}
            teams={teams}
            names={this.checkNames(team)}
          />
        )}
      </div>
    );
  }
}

export default CreateWorkflowContainer;
