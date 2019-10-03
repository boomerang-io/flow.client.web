import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowActions } from "State/workflow";
import classnames from "classnames";
import { ConfirmModal } from "@boomerang/carbon-addons-boomerang-react";
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import InputsModal from "./InputsModal";
import { Close32 } from "@carbon/icons-react";
import INPUT_TYPES from "Constants/workflowInputTypes";
import "./styles.scss";

class Inputs extends Component {
  static propTypes = {
    inputs: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    updateInputs: PropTypes.func.isRequired,
    workflowActions: PropTypes.object.isRequired
  };

  formatDefaultValue = value => {
    switch (value) {
      case INPUT_TYPES.BOOLEAN:
        return value.toString();
      default:
        return value;
    }
  };

  deleteInput = key => {
    new Promise(resolve => {
      resolve(this.props.workflowActions.deleteWorkflowInput({ key }));
    }).then(() =>
      this.props.updateInputs({ title: "Delete Input", message: "Successfully deleted input", type: "delete" })
    );
  };

  render() {
    const { inputs } = this.props;
    const inputsKeys = inputs.map(input => input.key);
    return (
      <div className="c-workflow-inputs">
        {inputs.length > 0 &&
          inputs.map((input, index) => (
            <div
              key={`${input.id}-${index}`}
              className={classnames("b-workflow-input", `--${input.type}`, `--${input.readOnly}`)}
            >
              <h1 className="b-workflow-input__name">{input.label}</h1>
              <dl className="b-workflow-input-field">
                <dt className="b-workflow-input-field__key">Key</dt>
                <dd className="b-workflow-input-field__value">{input.key}</dd>
              </dl>
              <dl className="b-workflow-input-field">
                <dt className="b-workflow-input-field__key">Description</dt>
                <dd className="b-workflow-input-field__value">{input.description}</dd>
              </dl>
              <dl className="b-workflow-input-field">
                <dt className="b-workflow-input-field__key">Type</dt>
                <dd className="b-workflow-input-field__value">{input.type}</dd>
              </dl>
              <dl className="b-workflow-input-field">
                <dt className="b-workflow-input-field__key">Required</dt>
                <dd className="b-workflow-input-field__value">{input.required.toString()}</dd>
              </dl>
              <dl className="b-workflow-input-field">
                <dt className="b-workflow-input-field__key">Default value</dt>
                <dd className="b-workflow-input-field__value">{this.formatDefaultValue(input.defaultValue)}</dd>
              </dl>
              {input.validValues && (
                <dl className="b-workflow-input-field">
                  <dt className="b-workflow-input-field__key">Valid values</dt>
                  <dd className="b-workflow-input-field__value">
                    {this.formatDefaultValue(input.validValues.join(", "))}
                  </dd>
                </dl>
              )}
              {!input.readOnly ? (
                <ConfirmModal
                  affirmativeAction={() => {
                    this.deleteInput(input.key);
                  }}
                  label="It will be gone. Forever."
                  title="DELETE THIS PROPERTY?"
                  modalTrigger={({ openModal }) => (
                    <button className="b-workflow-input__delete" onClick={openModal}>
                      <Close32 data-tip data-for={`${input.id}`} className="b-workflow-input__delete-icon" />
                      <Tooltip id={`${input.id}`} place="top">
                        Delete Input
                      </Tooltip>
                    </button>
                  )}
                />
              ) : null}
              {!input.readOnly ? (
                <InputsModal
                  isEdit
                  inputsKeys={inputsKeys.filter(inputName => inputName !== input.key)}
                  input={input}
                  updateInputs={this.props.updateInputs}
                  loading={this.props.loading}
                />
              ) : null}
            </div>
          ))}
        <InputsModal
          isEdit={false}
          inputsKeys={inputsKeys}
          updateInputs={this.props.updateInputs}
          loading={this.props.loading}
        />
      </div>
    );
  }
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
)(Inputs);
