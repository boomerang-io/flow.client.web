import React from "react";
import PropTypes from "prop-types";
import { ConfirmModal } from "@boomerang/carbon-addons-boomerang-react";
import WorkflowPropertiesModal from "./WorkflowPropertiesModal";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import WORKFLOW_PROPERTY_UPDATE_TYPES from "Constants/workflowPropertyUpdateTypes";
import styles from "./WorkflowProperties.module.scss";

WorkflowProperties.propTypes = {
  loading: PropTypes.bool.isRequired,
  properties: PropTypes.array.isRequired,
  updateWorkflowProperties: PropTypes.func.isRequired,
};

function WorkflowPropertyRow({ title, value }) {
  return (
    <dl className={styles.fieldContainer}>
      <dt className={styles.fieldKey}>{title}</dt>
      <dd className={styles.fieldValue}>{value}</dd>
    </dl>
  );
}

function WorkflowProperties(props) {
  function formatDefaultValue(value) {
    if (!value) {
      return "---";
    } else {
      return value;
    }
  }

  function WorkflowPropertyHeader({ label, description }) {
    return (
      <div className={styles.headerContainer}>
        <h1 className={styles.label}>{label}</h1>
        <p className={styles.description}>{formatDefaultValue(description)}</p>
      </div>
    );
  }

  function deleteProperty(property) {
    props
      .updateWorkflowProperties({
        property,
        type: WORKFLOW_PROPERTY_UPDATE_TYPES.DELETE,
      })
      .catch((error) => {
        //no-op
      });
  }

  const { properties } = props;
  const propertyKeys = properties.map((input) => input.key);
  return (
    <main className={styles.container}>
      {properties.length > 0 &&
        properties.map((property, index) => (
          <section key={`${property.id}-${index}`} className={styles.property}>
            <WorkflowPropertyHeader label={property.label} description={property.description} />
            <WorkflowPropertyRow title="Key" value={property.key} />
            <WorkflowPropertyRow title="Type" value={property.type} />
            <WorkflowPropertyRow title="Default value" value={formatDefaultValue(property.type==="password" && property.defaultValue ? property.defaultValue.toString().replace(/./g, "*") : property.defaultValue)} />
            <WorkflowPropertyRow
              title="Options"
              value={formatDefaultValue(property.options?.map((option) => option.key).join(", "))}
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
                  loading={props.loading}
                  propertyKeys={propertyKeys.filter((propertyName) => propertyName !== property.key)}
                  property={property}
                  updateWorkflowProperties={props.updateWorkflowProperties}
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
                  modalTrigger={({ openModal }) => (
                    <WorkflowCloseButton className={styles.deleteProperty} onClick={openModal} />
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
        propertyKeys={propertyKeys}
        updateWorkflowProperties={props.updateWorkflowProperties}
        loading={props.loading}
      />
    </main>
  );
}

export default WorkflowProperties;
