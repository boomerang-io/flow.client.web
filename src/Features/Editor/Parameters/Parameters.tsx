import React from "react";
import { Helmet } from "react-helmet";
import { ConfirmModal } from "@boomerang-io/carbon-addons-boomerang-react";
import WorkflowCloseButton from "./WorkflowCloseButton";
import WorkflowPropertiesModal from "./PropertiesModal";
import { InputType, WorkflowPropertyAction } from "Constants";
import { DataDrivenInput, ModalTriggerProps, WorkflowCanvas, WorkflowPropertyActionType } from "Types";
import { stringToPassword } from "Utils/stringHelper";
import styles from "./Parameters.module.scss";

const formatDefaultValue = ({ type, value }: { type?: string; value?: string }) => {
  if (!value) {
    return "---";
  } else if (type === InputType.Password) {
    return stringToPassword(value);
  } else {
    return value;
  }
};

interface WorkflowPropertyRowProps {
  title: string;
  value: string;
}

const WorkflowPropertyRow: React.FC<WorkflowPropertyRowProps> = ({ title, value }) => {
  return (
    <dl className={styles.fieldContainer}>
      <dt className={styles.fieldKey}>{title}</dt>
      <dd className={styles.fieldValue}>{value}</dd>
    </dl>
  );
};

interface WorkflowPropertyHeaderProps {
  label?: string;
  description?: string;
}

const WorkflowPropertyHeader: React.FC<WorkflowPropertyHeaderProps> = ({ label, description }) => {
  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.label}>{label}</h1>
      <p className={styles.description}>{formatDefaultValue({ value: description })}</p>
    </div>
  );
};

interface ParametersProps {
  workflow: WorkflowCanvas;
  handleUpdateParams: (parameters: Array<DataDrivenInput>) => void;
}

const Parameters: React.FC<ParametersProps> = ({ workflow, handleUpdateParams }) => {
  const handleUpdateProperties = async ({
    param,
    type,
  }: {
    param: DataDrivenInput;
    type: WorkflowPropertyActionType;
  }) => {
    let parameters = [...workflow.config];
    if (type === WorkflowPropertyAction.Update) {
      const parameterToUpdateIndex = parameters.findIndex((p) => p.key === param.key);
      parameters.splice(parameterToUpdateIndex, 1, param);
    }

    if (type === WorkflowPropertyAction.Delete) {
      const parameterToUpdateIndex = parameters.findIndex((p) => p.key === param.key);
      parameters.splice(parameterToUpdateIndex, 1);
    }

    if (type === WorkflowPropertyAction.Create) {
      parameters.push(param);
    }

    handleUpdateParams(parameters);
  };

  const deleteParameter = (param: DataDrivenInput) => {
    handleUpdateProperties({
      param,
      type: WorkflowPropertyAction.Delete,
    });
  };

  const { config } = workflow;
  console.log(config);
  const paramKeys = config && config.length > 0 ? config.map((input: DataDrivenInput) => input.key) : [];

  return (
    <div aria-label="Parameters" className={styles.container} role="region">
      <Helmet>
        <title>{`Parameters - ${workflow.name}`}</title>
      </Helmet>
      {config &&
        config.length > 0 &&
        config.map((configParam: DataDrivenInput, index: number) => (
          <section key={`${configParam.id}-${index}`} className={styles.property}>
            <WorkflowPropertyHeader label={configParam.label} description={configParam.description} />
            <WorkflowPropertyRow title="Key" value={configParam.key} />
            <WorkflowPropertyRow title="Type" value={configParam.type} />
            <WorkflowPropertyRow
              title="Default value"
              value={formatDefaultValue({ type: configParam.type, value: configParam.defaultValue })}
            />
            <WorkflowPropertyRow
              title="Options"
              value={formatDefaultValue({
                value: configParam.options?.map((option: { key: string }) => option.key).join(", "),
              })}
            />
            {configParam.required ? (
              <p className={styles.required}>Required</p>
            ) : (
              <p className={styles.notRequired}>Not required</p>
            )}
            {!configParam.readOnly ? (
              <>
                <WorkflowPropertiesModal
                  isEdit
                  propertyKeys={paramKeys.filter((propertyName: string) => propertyName !== configParam.key)}
                  property={configParam}
                  updateWorkflowProperties={handleUpdateProperties}
                />
                <ConfirmModal
                  affirmativeButtonProps={{ kind: "danger" }}
                  affirmativeAction={() => {
                    deleteParameter(configParam);
                  }}
                  affirmativeText="Delete"
                  negativeText="Cancel"
                  children="It will be gone. Forever."
                  title="Delete Parameter"
                  modalTrigger={({ openModal }: ModalTriggerProps) => (
                    <WorkflowCloseButton
                      className={styles.deleteProperty}
                      onClick={openModal}
                      data-testid="workflow-delete-parameter-button"
                    />
                  )}
                />
              </>
            ) : (
              <p className={styles.readOnlyText}>Read-only</p>
            )}
          </section>
        ))}
      <WorkflowPropertiesModal
        isEdit={false}
        propertyKeys={paramKeys}
        updateWorkflowProperties={handleUpdateProperties}
      />
    </div>
  );
};

export default Parameters;
