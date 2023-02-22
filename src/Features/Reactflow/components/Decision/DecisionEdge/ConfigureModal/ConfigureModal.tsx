//@ts-nocheck
import React from "react";
import PropTypes from "prop-types";
import { Button, CodeSnippet, ModalBody, ModalFooter } from "@carbon/react";
import { ModalFlowForm, TextArea, Toggle } from "@boomerang-io/carbon-addons-boomerang-react";
import "./styles.scss";

class ConfigureDecisionModal extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    defaultState: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    switchCondition: PropTypes.string,
    updateDefaultState: PropTypes.func.isRequired,
    updateSwitchState: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      switchCondition: props.switchCondition || "",
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.updateSwitchState(this.state.switchCondition, this.props.onSubmit);
  };

  render() {
    const { defaultState, updateDefaultState } = this.props;

    const { switchCondition } = this.state;

    return (
      <ModalFlowForm onSubmit={this.handleSubmit}>
        <ModalBody>
          <Toggle
            aria-labelledby="toggle-default"
            id="default"
            name="default"
            orientation="vertical"
            toggled={defaultState}
            labelText="Default"
            helperText="This path will be taken when no other switch path is matched."
            onToggle={updateDefaultState}
            style={{ padding: "1rem 0rem 1rem 0rem" }}
          />

          <div className="b-switch-customvalue">
            {!defaultState && (
              <>
                <TextArea
                  id="parameter"
                  invalid={!switchCondition}
                  invalidText="Value is required"
                  labelText="Switch Parameter Value"
                  name="parameter"
                  placeholder="Enter a value"
                  onChange={(e) => this.setState({ switchCondition: e.target.value })}
                  style={{ resize: "none" }}
                  value={switchCondition}
                />
                <div className="s-switch-customvalue-desc">
                  Enter the value(s) to match to take this path. Multiple values can be entered, one per line. Only one
                  must match for this connection to be valid.
                </div>
                <section>
                  <p className="s-switch-customvalue-tips-header">Tips:</p>
                  <div className="s-switch-customvalue-wildcard-section">
                    <CodeSnippet type="inline" hideCopyButton>
                      .*
                    </CodeSnippet>
                    <p className="s-switch-customvalue-wildcard">can be used as a wildcard.</p>
                  </div>
                  <div className="s-switch-customvalue-wildcard-section">
                    <CodeSnippet type="inline" hideCopyButton>
                      \w
                    </CodeSnippet>
                    <p className="s-switch-customvalue-wildcard">can be used as a wildcard of any word character.</p>
                  </div>
                </section>
              </>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" type="button" onClick={this.props.closeModal}>
            Cancel
          </Button>
          <Button disabled={!defaultState && !switchCondition} type="submit">
            Save
          </Button>
        </ModalFooter>
      </ModalFlowForm>
    );
  }
}

export default ConfigureDecisionModal;
