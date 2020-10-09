// @ts-nocheck
import React from "react";
import { useMutation, queryCache } from "react-query";
import { ConfirmModal, notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import WorkflowPropertiesModal from "./PropertiesModal";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import capitalize from "lodash/capitalize";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { WorkflowPropertyUpdateType } from "Constants";
import { DataDrivenInput, ModalTriggerProps, WorkflowSummary } from "Types";
import styles from "./Properties.module.scss";

const formatDefaultValue = (value: string | undefined) => {
  if (!value) {
    return "---";
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
      <p className={styles.description}>{formatDefaultValue(description)}</p>
    </div>
  );
};

interface PropertiesProps {
  summaryData: WorkflowSummary;
}

const Properties: React.FC<PropertiesProps> = ({ summaryData }) => {
  const [mutateProperties, { isLoading: mutatePropertiesIsLoading }] = useMutation(
    resolver.patchUpdateWorkflowProperties
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
          title={`${capitalize(type)} property`}
          subtitle={`Successfully performed operation`}
        />
      );
      queryCache.setQueryData(serviceUrl.getWorkflowSummary({ workflowId: summaryData.id }), data);
    } catch (e) {
      notify(<ToastNotification kind="error" title="Something's wrong" subtitle={`Failed to ${type} property`} />);
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
    <div aria-label="Properties" className={styles.container} role="region">
      {properties.length > 0 &&
        properties.map((property: DataDrivenInput, index: number) => (
          <section key={`${property.id}-${index}`} className={styles.property}>
            <WorkflowPropertyHeader label={property.label} description={property.description} />
            <WorkflowPropertyRow title="Key" value={property.key} />
            <WorkflowPropertyRow title="Type" value={property.type} />
            <WorkflowPropertyRow title="Event Payload JsonPath" value={property.jsonPath ?? "---"} />
            <WorkflowPropertyRow title="Default value" value={formatDefaultValue(property.defaultValue)} />
            <WorkflowPropertyRow
              title="Options"
              value={formatDefaultValue(property.options?.map((option: { key: string }) => option.key).join(", "))}
            />
            {property.required ? (
              <p className={styles.required}>Required</p>
            ) : (
              <p className={styles.notRequired}>Not required</p>
            )}
            {!property.readOnly ? (
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
                  title="Delete Property"
                  modalTrigger={({ openModal }: ModalTriggerProps) => (
                    <WorkflowCloseButton
                      className={styles.deleteProperty}
                      onClick={openModal}
                      data-testid="workflow-delete-property-button"
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
        isloading={mutatePropertiesIsLoading}
        propertyKeys={propertyKeys}
        updateWorkflowProperties={handleUpdateProperties}
      />
    </div>
  );
};

export default Properties;
