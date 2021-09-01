import React from "react";
import { ModalForm, RadioGroup } from "@boomerang-io/carbon-addons-boomerang-react";
import CreateWorkflowContent from "../CreateWorkflowContent";
import ImportWorkflowContent from "../ImportWorkflowContent";
import { FlowTeam, CreateWorkflowSummary, WorkflowExport, WorkflowSummary } from "Types";
import styles from "./createWorkflowContainer.module.scss";

const NEW_WORKFLOW = "Start from scratch";
const IMPORT_WORKFLOW = "Import a Workflow";

export const radioWorkflowOptions = [
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

interface CreateWorkflowContainerProps {
  closeModal: () => void;
  createError: any;
  createWorkflow: (workflowData: CreateWorkflowSummary) => Promise<void>;
  isLoading: boolean;
  scope: string;
  importError: any;
  importWorkflow: (workflowData: WorkflowExport, closeModal: () => void, team: FlowTeam) => Promise<void>;
  team?: FlowTeam | null;
  teams?: FlowTeam[] | null;
  workflows?: WorkflowSummary[];
  workflowQuotasEnabled: boolean;
}

const CreateWorkflowContainer: React.FC<CreateWorkflowContainerProps> = ({
  closeModal,
  createError,
  createWorkflow,
  importError,
  importWorkflow,
  isLoading,
  scope,
  team,
  teams,
  workflows,
  workflowQuotasEnabled,
}) => {
  const [selectedOption, setSelectedOption] = React.useState(NEW_WORKFLOW);

  const existingWorkflowNames = workflows?.map((workflow) => workflow.name) ?? [];

  return (
    <ModalForm>
      <div className={styles.typeRadio}>
        <RadioGroup
          name="workflow-options"
          options={radioWorkflowOptions}
          onChange={setSelectedOption}
          value={selectedOption}
        />
      </div>
      {selectedOption === NEW_WORKFLOW ? (
        <CreateWorkflowContent
          closeModal={closeModal}
          createWorkflow={createWorkflow}
          createError={createError}
          isLoading={isLoading}
          scope={scope}
          team={team}
          teams={teams}
          workflowQuotasEnabled={workflowQuotasEnabled}
        />
      ) : (
        <ImportWorkflowContent
          closeModal={closeModal}
          existingWorkflowNames={existingWorkflowNames}
          importError={importError}
          importWorkflow={importWorkflow}
          isLoading={isLoading}
          scope={scope}
          team={team}
          teams={teams}
        />
      )}
    </ModalForm>
  );
};

export default CreateWorkflowContainer;
