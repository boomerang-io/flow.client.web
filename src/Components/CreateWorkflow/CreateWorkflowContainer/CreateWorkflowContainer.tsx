import React from "react";
import { ModalForm, RadioGroup } from "@boomerang-io/carbon-addons-boomerang-react";
import CreateWorkflowContent from "../CreateWorkflowContent";
import ImportWorkflowContent from "../ImportWorkflowContent";
import { FlowTeam, CreateWorkflowSummary, WorkflowExport, WorkflowSummary } from "Types";
import styles from "./createWorkflowContainer.module.scss";

const NEW_WORKFLOW = "Start from scratch";
const IMPORT_WORKFLOW = (type: string) => `Import a ${type}`;
interface CreateWorkflowContainerProps {
  closeModal: () => void;
  createError: any;
  createWorkflow: (workflowData: CreateWorkflowSummary) => Promise<void>;
  isLoading: boolean;
  importError: any;
  importWorkflow: (workflowData: WorkflowExport, closeModal: () => void, team: FlowTeam) => Promise<void>;
  team: FlowTeam | null;
  type: string;
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
  team,
  type,
  workflows,
  workflowQuotasEnabled,
}) => {
  const [selectedOption, setSelectedOption] = React.useState(NEW_WORKFLOW);
  const radioWorkflowOptions = [
    {
      id: "create-workflow-radio-id",
      labelText: NEW_WORKFLOW,
      value: NEW_WORKFLOW,
    },
    {
      id: "import-workflow-radio-id",
      labelText: IMPORT_WORKFLOW(type),
      value: IMPORT_WORKFLOW(type),
    },
  ];
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
          team={team}
          workflowQuotasEnabled={workflowQuotasEnabled}
        />
      ) : (
        <ImportWorkflowContent
          closeModal={closeModal}
          existingWorkflowNames={existingWorkflowNames}
          importError={importError}
          importWorkflow={importWorkflow}
          isLoading={isLoading}
          team={team}
          type={type}
        />
      )}
    </ModalForm>
  );
};

export default CreateWorkflowContainer;
