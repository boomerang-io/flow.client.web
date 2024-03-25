//@ts-nocheck
import React from "react";
import { ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import { useQuery } from "react-query";
import TaskUpdateModal from "Components/TaskUpdateModal";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import WorkflowEditButton from "Components/WorkflowEditButton";
import WorkflowNode from "Components/WorkflowNode";
import WorkflowTaskForm from "Components/WorkflowTaskForm";
import WorkflowWarningButton from "Components/WorkflowWarningButton";
import { useEditorContext } from "Hooks";
import { RevisionActionTypes } from "State/reducers/workflowRevision";
import { serviceUrl, resolver } from "Config/servicesConfig";
import styles from "./ManualApprovalNodeDesigner.module.scss";

const ManualApprovalNodeDesigner = React.memo(function ManualApprovalNodeDesigner({
  diagramEngine,
  node: designerNode,
}) {
  const { availableParametersQueryData, revisionDispatch, revisionState, summaryData, tasksData } = useEditorContext();
  const { flowTeamId } = summaryData;

  /**
   * Pull data off of context
   */
  const inputProperties = availableParametersQueryData;
  const isTeamScope = summaryData?.scope === "Team";

  const nodeDag = revisionState.dag?.nodes?.find((revisionNode) => revisionNode.nodeId === designerNode.id) ?? {};
  const nodeConfig = revisionState.config[designerNode.id] ?? {};
  const task = tasksData.find((taskTemplate) => taskTemplate.id === designerNode.taskId);

  /**
   * Get approver groups
   */
  const ApproverGroupsUrl = serviceUrl.resourceApproverGroups({ teamId: flowTeamId, groupId: undefined });
  const { data: approverGroupsData } = useQuery({
    queryKey: ApproverGroupsUrl,
    queryFn: resolver.query(ApproverGroupsUrl),
    enabled: Boolean(flowTeamId && isTeamScope),
  });

  // Get the taskNames names from the nodes on the model
  const taskNames = Object.values(diagramEngine.getDiagramModel().getNodes())
    .map((node) => {
      return node?.taskName;
    })
    .filter((name) => Boolean(name));

  /**
   * Event handlers
   */
  const handleOnUpdateTaskVersion = ({ version, inputs }) => {
    revisionDispatch({
      type: RevisionActionTypes.UpdateNodeTaskVersion,
      data: { nodeId: designerNode.id, inputs, version },
    });
  };

  const handleOnSaveTaskConfig = (inputs) => {
    const outputs = inputs.outputs;
    delete inputs.outputs;
    revisionDispatch({
      type: RevisionActionTypes.UpdateNodeConfigWithResult,
      data: { nodeId: designerNode.id, inputs, outputs },
    });
  };

  // Delete the node in state and then remove it from the diagram
  const handleOnDelete = () => {
    //deleteNode
    revisionDispatch({
      type: RevisionActionTypes.DeleteNode,
      data: { nodeId: designerNode.id },
    });
    designerNode.remove();
  };

  const additionalConfig =
    isTeamScope && approverGroupsData
      ? [
          {
            placeholder: "",
            description: "",
            value: "1",
            required: true,
            min: 1,
            key: "numberOfApprovals",
            label: "Number of Approvals",
            type: "number",
            helperText: "Number of approvals needed in order to approve",
          },
          {
            placeholder: "",
            description: "",
            required: false,
            key: "approverGroupId",
            label: "Approver Group (optional)",
            type: "select",
            helperText: "Choose an Approver Group to handle this approval",
            options: approverGroupsData.map((approverGroup) => ({
              key: approverGroup.groupId,
              value: approverGroup.groupName,
            })),
          },
        ]
      : [
          {
            disabled: true,
            placeholder:
              "This will be assigned to you as the approver to Action. Approver Groups and multiple approvers are a Team Workflows concept.",
            description: "",
            required: false,
            key: "message",
            label: "Nothing to configure",
            type: "textarea",
            helperText: "",
          },
        ];

  const renderConfigureTask = () => {
    return (
      <ComposedModal
        confirmModalProps={{
          title: "Are you sure?",
          children: "Your changes will not be saved",
        }}
        modalHeaderProps={{
          title: `Edit ${task?.name}`,
          subtitle: task?.description || "Configure the inputs",
        }}
        modalTrigger={({ openModal }) => <WorkflowEditButton className={styles.editButton} onClick={openModal} />}
      >
        {({ closeModal }) => (
          <WorkflowTaskForm
            additionalConfig={additionalConfig}
            inputProperties={inputProperties}
            closeModal={closeModal}
            node={designerNode}
            nodeConfig={nodeConfig}
            onSave={handleOnSaveTaskConfig}
            taskNames={taskNames}
            task={task}
          />
        )}
      </ComposedModal>
    );
  };

  const renderUpdateTaskVersion = () => {
    return (
      <ComposedModal
        composedModalProps={{
          containerClassName: styles.updateTaskModalContainer,
          shouldCloseOnOverlayClick: false,
        }}
        modalHeaderProps={{
          title: `New version available`,
          subtitle:
            "The managers of this task have made some changes that were significant enough for a new version. You can still use the current version, but it’s usually a good idea to update when available. The details of the change are outlined below. If you’d like to update, review the changes below and make adjustments if needed. This process will only update the task in this Workflow - not any other workflows where this task appears.",
        }}
        modalTrigger={({ openModal }) =>
          nodeDag?.templateUpgradeAvailable ? (
            <WorkflowWarningButton className={styles.updateButton} onClick={openModal} />
          ) : null
        }
      >
        {({ closeModal }) => (
          <TaskUpdateModal
            closeModal={closeModal}
            inputProperties={inputProperties}
            // node={designerNode}
            nodeConfig={nodeConfig}
            onSave={handleOnUpdateTaskVersion}
            // taskNames={taskNames}
            task={task}
          />
        )}
      </ComposedModal>
    );
  };

  if (nodeConfig && nodeDag && task) {
    return (
      <WorkflowNode
        category={task.category}
        className={styles.node}
        icon={task.icon}
        isExecution={false}
        name={task.name}
        node={designerNode}
        subtitle={designerNode?.taskName}
        title={task.name}
      >
        <div className={styles.badgeContainer}>
          <p className={styles.badgeText}>System</p>
        </div>
        {renderUpdateTaskVersion()}
        {renderConfigureTask()}
        <WorkflowCloseButton className={styles.closeButton} onClick={handleOnDelete} />
      </WorkflowNode>
    );
  }
  return null;
});

export default ManualApprovalNodeDesigner;
