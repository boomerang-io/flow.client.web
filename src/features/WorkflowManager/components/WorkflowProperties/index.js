import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowActions } from "State/workflow";
import { ConfirmModal } from "@boomerang/carbon-addons-boomerang-react";
import WorkflowPropertiesModal from "./WorkflowPropertiesModal";
import { Close32 } from "@carbon/icons-react";
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
      <dd className={styles.fieldValue}>{value}</dd>
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
            <WorkflowPropertyRow title="Label" value={input.label} />
            <WorkflowPropertyRow title="Key" value={input.key} />
            <WorkflowPropertyRow title="Description" value={input.description} />
            <WorkflowPropertyRow title="Type" value={input.type} />
            <WorkflowPropertyRow title="Required" value={input.required.toString()} />
            {formatDefaultValue(input.defaultValue) && (
              <WorkflowPropertyRow title="Default value" value={formatDefaultValue(input.defaultValue)} />
            )}
            {input.validValues && (
              <WorkflowPropertyRow title="Valid values" value={formatDefaultValue(input.validValues.join(", "))} />
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
                    <button className={styles.deleteContainer} onClick={openModal}>
                      <Close32 className={styles.deleteIcon} />
                    </button>
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
