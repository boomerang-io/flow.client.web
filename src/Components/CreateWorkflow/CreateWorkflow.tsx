import React from "react";
import { useFeature } from "flagged";
import { useAppContext } from "Hooks";
import { useMutation, queryCache } from "react-query";
import { useHistory } from "react-router-dom";
import { ComposedModal, notify, ToastNotification, TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import CreateWorkflowContainer from "./CreateWorkflowContainer";
import WorkflowDagEngine, { createWorkflowRevisionBody } from "Utils/dag/WorkflowDagEngine";
import { appLink } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import queryString from "query-string";
import { formatErrorMessage } from "@boomerang-io/utils";
import { Add32 } from "@carbon/icons-react";
import {
  FlowTeam,
  ComposedModalChildProps,
  ModalTriggerProps,
  WorkflowExport,
  CreateWorkflowSummary,
  WorkflowSummary,
} from "Types";
import { WorkflowScope } from "Constants";
import { FeatureFlag } from "Config/appConfig";
import styles from "./createWorkflow.module.scss";

const workflowDagEngine = new WorkflowDagEngine({ dag: null });

interface CreateWorkflowProps {
  scope: string;
  team?: FlowTeam | null;
  teams?: FlowTeam[] | null;
  hasReachedWorkflowLimit: boolean;
  workflows?: WorkflowSummary[];
}

const CreateWorkflow: React.FC<CreateWorkflowProps> = ({ scope, team, teams, hasReachedWorkflowLimit, workflows }) => {
  const { teams: teamState } = useAppContext();
  const history = useHistory();
  const workflowQuotasEnabled = useFeature(FeatureFlag.WorkflowQuotasEnabled);

  const [createWorkflowMutator, { error: workflowError, isLoading: workflowIsLoading }] = useMutation(
    resolver.postCreateWorkflow
  );

  const [
    createWorkflowRevisionMutator,
    { error: workflowRevisionError, isLoading: workflowRevisionIsLoading },
  ] = useMutation(resolver.postCreateWorkflowRevision);

  const [importWorkflowMutator, { error: importError, isLoading: importIsLoading }] = useMutation(
    resolver.postImportWorkflow
  );

  const handleCreateWorkflow = async (workflowSummary: CreateWorkflowSummary) => {
    try {
      const { data: newWorkflow } = await createWorkflowMutator({ body: workflowSummary });
      const workflowId = newWorkflow.id;
      const dagProps = createWorkflowRevisionBody(workflowDagEngine, "Create workflow");
      const workflowRevision = {
        ...dagProps,
        workflowId,
      };

      await createWorkflowRevisionMutator({ workflowId, body: workflowRevision });
      queryCache.removeQueries(serviceUrl.getWorkflowRevision({ workflowId, revisionNumber: null }));
      history.push(appLink.editorDesigner({ workflowId }));
      notify(<ToastNotification kind="success" title="Create Workflow" subtitle="Successfully created workflow" />);
      if (scope === WorkflowScope.System) {
        queryCache.invalidateQueries(serviceUrl.getSystemWorkflows());
      } else if (scope === WorkflowScope.Team) {
        queryCache.invalidateQueries(serviceUrl.getTeams());
      } else {
        queryCache.invalidateQueries(serviceUrl.getUserWorkflows());
      }

      return;
    } catch (e) {
      console.log(e);
      return;
      //no-op
    }
  };

  const handleImportWorkflow = async (workflowExport: WorkflowExport, closeModal: () => void, team: FlowTeam) => {
    let query;
    if (scope === WorkflowScope.Team) {
      query = queryString.stringify({ update: false, flowTeamId: team.id, scope: "team" });
    } else query = queryString.stringify({ update: false, scope });
    try {
      await importWorkflowMutator({ query, body: workflowExport });
      notify(<ToastNotification kind="success" title="Update Workflow" subtitle="Workflow successfully updated" />);
      if (scope === WorkflowScope.System) {
        queryCache.invalidateQueries(serviceUrl.getSystemWorkflows());
      } else if (scope === WorkflowScope.Team) {
        //todo: fix refresh
        teamState.find((t) => t.id === team.id)?.workflows.push(workflowExport);
        queryCache.setQueryData(serviceUrl.getTeams(), teamState);
        queryCache.invalidateQueries(serviceUrl.getTeams());
      } else {
        queryCache.invalidateQueries(serviceUrl.getUserWorkflows());
      }
      closeModal();
    } catch (err) {
      const errorMessages = formatErrorMessage({
        error: err,
        defaultMessage: "Import Workflow Failed",
      });
      notify(<ToastNotification kind="error" title={errorMessages.title} subtitle={errorMessages.message} />);
    }
  };

  const isLoading = workflowIsLoading || workflowRevisionIsLoading || importIsLoading;

  return (
    <ComposedModal
      composedModalProps={{ containerClassName: styles.modalContainer }}
      modalTrigger={({ openModal }: ModalTriggerProps) =>
        workflowQuotasEnabled && hasReachedWorkflowLimit ? (
          <TooltipHover
            direction="top"
            tooltipText={
              "This team has reached the maximum number of Workflows allowed - delete a Workflow to create a new one, or contact your Team administrator/owner to increase the quota."
            }
          >
            <div className={styles.disabledCreate} data-testid="workflows-create-workflow-button">
              <Add32 className={styles.addIcon} />
              <p className={styles.text}>Create a new workflow</p>
            </div>
          </TooltipHover>
        ) : (
          <button className={styles.container} onClick={openModal} data-testid="workflows-create-workflow-button">
            <Add32 className={styles.addIcon} />
            <p className={styles.text}>Create a new workflow</p>
          </button>
        )
      }
      confirmModalProps={{
        title: "Close this?",
        children: "Your request will not be saved",
      }}
      modalHeaderProps={{
        title: "Create a new Workflow",
        subtitle: "Get started with these basics, then proceed to designing it out.",
      }}
    >
      {({ closeModal }: ComposedModalChildProps) => (
        <CreateWorkflowContainer
          closeModal={closeModal}
          createError={workflowError || workflowRevisionError}
          createWorkflow={handleCreateWorkflow}
          importError={importError}
          importWorkflow={handleImportWorkflow}
          isLoading={isLoading}
          scope={scope}
          team={team}
          teams={teams}
          workflows={workflows}
        />
      )}
    </ComposedModal>
  );
};

export default CreateWorkflow;
