// @ts-nocheck
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { Helmet } from "react-helmet";
import capitalize from "lodash/capitalize";
import { ConfirmModal, notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import WorkflowCloseButton from "./WorkflowCloseButton";
import WorkflowPropertiesModal from "./PropertiesModal";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { InputType, WorkflowPropertyUpdateType } from "Constants";
import { DataDrivenInput, ModalTriggerProps, WorkflowSummary } from "Types";
import { stringToPassword } from "Utils/stringHelper";
import styles from "./Properties.module.scss";

const formatDefaultValue = ({ type, value }: { type: string | undefined; value: string | undefined }) => {
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
  label: string;
  description: string | undefined;
}

const WorkflowPropertyHeader: React.FC<WorkflowPropertyHeaderProps> = ({ label, description }) => {
  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.label}>{label}</h1>
      <p className={styles.description}>{formatDefaultValue({ value: description })}</p>
    </div>
  );
};

interface PropertiesProps {
  summaryData: WorkflowSummary;
  canEditWorkflow: boolean;
}

const Properties: React.FC<PropertiesProps> = ({ summaryData, canEditWorkflow }) => {
  const queryClient = useQueryClient();
  const { mutateAsync: mutateProperties, isLoading: mutatePropertiesIsLoading } = useMutation(
    resolver.patchUpdateWorkflowProperties,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(serviceUrl.workflowAvailableParameters({ workflowId: summaryData.id }));
      },
    }
  );

  const handleUpdateProperties = async ({ property, type }: { property: DataDrivenInput; type: string }) => {
    let properties = [...summaryData.properties];
    if (type === WorkflowPropertyUpdateType.Update) {
      const propertyToUpdateIndex = properties.findIndex((currentProp) => currentProp.key === property.key);
      properties.splice(propertyToUpdateIndex, 1, property);
    }

    if (type === WorkflowPropertyUpdateType.Delete) {
      const propertyToUpdateIndex = properties.findIndex((currentProp) => currentProp.key === property.key);
      properties.splice(propertyToUpdateIndex, 1);
    }

    if (type === WorkflowPropertyUpdateType.Create) {
      properties.push(property);
    }

    try {
      const { data } = await mutateProperties({ workflowId: summaryData.id, body: properties });
      notify(
        <ToastNotification
          kind="success"
          title={`${capitalize(type)} parameter`}
          subtitle={`Successfully performed operation`}
        />
      );
      queryClient.setQueryData(serviceUrl.getWorkflowSummary({ workflowId: summaryData.id }), data);
    } catch (e) {
      notify(<ToastNotification kind="error" title="Something's wrong" subtitle={`Failed to ${type} parameter`} />);
    }
  };

  const deleteProperty = (property: DataDrivenInput) => {
    handleUpdateProperties({
      property,
      type: WorkflowPropertyUpdateType.Delete,
    });
  };

  const { properties } = summaryData;
  const propertyKeys = properties.map((input: DataDrivenInput) => input.key);

  return (
    <div aria-label="Parameters" className={styles.container} role="region">
      <Helmet>
        <title>{`Parameters - ${summaryData.name}`}</title>
      </Helmet>
      {properties.length > 0 &&
        properties.map((property: DataDrivenInput, index: number) => (
          <section key={`${property.id}-${index}`} className={styles.property}>
            <WorkflowPropertyHeader label={property.label} description={property.description} />
            <WorkflowPropertyRow title="Key" value={property.key} />
            <WorkflowPropertyRow title="Type" value={property.type} />
            <WorkflowPropertyRow title="Event Payload JsonPath" value={property.jsonPath ?? "---"} />
            <WorkflowPropertyRow
              title="Default value"
              value={formatDefaultValue({ type: property.type, value: property.defaultValue })}
            />
            <WorkflowPropertyRow
              title="Options"
              value={formatDefaultValue({
                value: property.options?.map((option: { key: string }) => option.key).join(", "),
              })}
            />
            {property.required ? (
              <p className={styles.required}>Required</p>
            ) : (
              <p className={styles.notRequired}>Not required</p>
            )}
            {!property.readOnly && canEditWorkflow ? (
              <>
                <WorkflowPropertiesModal
                  isEdit
                  isLoading={mutatePropertiesIsLoading}
                  propertyKeys={propertyKeys.filter((propertyName: string) => propertyName !== property.key)}
                  property={property}
                  updateWorkflowProperties={handleUpdateProperties}
                />
                <ConfirmModal
                  affirmativeButtonProps={{ kind: "danger" }}
                  affirmativeAction={() => {
                    deleteProperty(property);
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
      {canEditWorkflow && (
        <WorkflowPropertiesModal
          isEdit={false}
          isloading={mutatePropertiesIsLoading}
          propertyKeys={propertyKeys}
          updateWorkflowProperties={handleUpdateProperties}
        />
      )}
    </div>
  );
};

export default Properties;
