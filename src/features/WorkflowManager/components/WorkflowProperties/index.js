import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowActions } from "State/workflow";
import { ConfirmModal } from "@boomerang/carbon-addons-boomerang-react";
import WorkflowPropertiesModal from "./WorkflowPropertiesModal";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import INPUT_TYPES from "Constants/workflowInputTypes";
import styles from "./WorkflowProperties.module.scss";

WorkflowProperties.propTypes = {
  inputs: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  updateWorkflowProperties: PropTypes.func.isRequired,
  workflowActions: PropTypes.object.isRequired
};

function WorkflowPropertyRow({ title, value }) {
  return (
    <dl className={styles.fieldContainer}>
      <dt className={styles.fieldKey}>{title}</dt>
      <h1 className={styles.fieldValue}>{value}</h1>
    </dl>
  );
}

function WorkflowPropertyHeader({ label, propertyKey, description }) {
  return (
    <dl className={styles.headerContainer}>
      <dt className={styles.label}>{label}</dt>
      <dd className={styles.propertyKey}>{propertyKey}</dd>
      <dd className={styles.description}>{description}</dd>
    </dl>
  );
}

function WorkflowProperties(props) {
  function formatDefaultValue(value) {
    switch (value) {
      case INPUT_TYPES.BOOLEAN:
        return value.toString();
      default:
        return value;
    }
  }

  async function deleteInput(key) {
    await props.workflowActions
      .deleteWorkflowInput({ key })
      .then(() =>
        props.updateWorkflowProperties({ title: "Delete Input", message: "Successfully deleted input", type: "delete" })
      );
  }

  const { inputs } = props;
  const inputsKeys = inputs.map(input => input.key);
  return (
    <div className={styles.container}>
      {inputs.length > 0 &&
        inputs.map((input, index) => (
          <div key={`${input.id}-${index}`} className={styles.property}>
            <WorkflowPropertyHeader label={input.label} propertyKey={input.key} description={input.description} />
            <WorkflowPropertyRow title="Type" value={input.type} />
            {formatDefaultValue(input.defaultValue) && (
              <WorkflowPropertyRow title="Default value" value={formatDefaultValue(input.defaultValue)} />
            )}
            {input.validValues && (
              <WorkflowPropertyRow title="Valid values" value={formatDefaultValue(input.validValues.join(", "))} />
            )}
            {input.required ? (
              <p className={styles.required}>Required</p>
            ) : (
              <p className={styles.notRequired}>Not required</p>
            )}
            {!input.readOnly ? (
              <>
                <WorkflowPropertiesModal
                  isEdit
                  inputsKeys={inputsKeys.filter(inputName => inputName !== input.key)}
                  input={input}
                  updateWorkflowProperties={props.updateWorkflowProperties}
                  loading={props.loading}
                />
                <ConfirmModal
                  affirmativeAction={() => {
                    deleteInput(input.key);
                  }}
                  children="It will be gone. Forever."
                  title="Delete This Property?"
                  modalTrigger={({ openModal }) => (
                    <WorkflowCloseButton className={styles.deleteProperty} onClick={openModal} />
                  )}
                />
              </>
            ) : (
              <p className={styles.readOnlyText}>Read-only</p>
            )}
          </div>
        ))}
      <WorkflowPropertiesModal
        isEdit={false}
        inputsKeys={inputsKeys}
        updateWorkflowProperties={props.updateWorkflowProperties}
        loading={props.loading}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  inputs: state.workflow.data.properties
});

const mapDispatchToProps = dispatch => ({
  workflowActions: bindActionCreators(workflowActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowProperties);
