import React from "react";
import PropTypes from "prop-types";
import { RadioGroup } from "@boomerang-io/carbon-addons-boomerang-react";
import CreateWorkflowContent from "../CreateWorkflowContent";
import ImportWorkflowContent from "../ImportWorkflowContent";
import styles from "./createWorkflowContainer.module.scss";

const NEW_WORKFLOW = "Start from scratch";
const IMPORT_WORKFLOW = "Import a Workflow";

const radioWorkflowOptions = [
  {
    id: "create-workflow-radio-id",
    labelText: NEW_WORKFLOW,
    value: NEW_WORKFLOW,
  },
  {
    id: "import-workflow-radio-id",
    labelText: IMPORT_WORKFLOW,
    value: IMPORT_WORKFLOW,
  },
];

CreateWorkflowContainer.propTypes = {
  createWorkflow: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  importWorkflow: PropTypes.func.isRequired,
  team: PropTypes.object.isRequired,
  teams: PropTypes.array.isRequired,
};

export function CreateWorkflowContainer({
  closeModal,
  createError,
  createWorkflow,
  importError,
  importWorkflow,
  isLoading,
  team,
  teams,
}) {
  const [selectedOption, setSelectedOption] = React.useState(NEW_WORKFLOW);

  const existingWorkflowNames = team.workflows.map((workflow) => workflow.name);

  return (
    <div className={styles.modalBody}>
      <RadioGroup
        name="workflow-options"
        options={radioWorkflowOptions}
        onChange={setSelectedOption}
        value={selectedOption}
      />
      {selectedOption === NEW_WORKFLOW ? (
        <CreateWorkflowContent
          closeModal={closeModal}
          createWorkflow={createWorkflow}
          createError={createError}
          existingWorkflowNames={existingWorkflowNames}
          isLoading={isLoading}
          team={team}
          teams={teams}
        />
      ) : (
        <ImportWorkflowContent
          closeModal={closeModal}
          existingWorkflowNames={existingWorkflowNames}
          importError={importError}
          importWorkflow={importWorkflow}
          isLoading={isLoading}
          team={team}
          teams={teams}
        />
      )}
    </div>
  );
}

export default CreateWorkflowContainer;
