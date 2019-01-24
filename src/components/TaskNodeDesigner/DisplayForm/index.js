import React, { Component } from "react";
import PropTypes from "prop-types";
import ModalContentBody from "@boomerang/boomerang-components/lib/ModalContentBody";
import ModalContentFooter from "@boomerang/boomerang-components/lib/ModalContentFooter";
import ModalConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import ValueList from "./ValueList";

class DisplayForm extends Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    nodeConfig: PropTypes.object.isRequired,
    task: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    taskNames: PropTypes.array.isRequired,
    shouldConfirmExit: PropTypes.func.isRequired,
    isModalOpen: PropTypes.func.isRequired
  };

  state = {};

  componentDidMount() {
    this.props.isModalOpen({ modalOpen: true });
  }
  componentWillUnmount() {
    this.props.isModalOpen({ modalOpen: false });
  }

  handleAppsDropdownChange = items => {
    this.setState(() => ({
      items
    }));
  };

  handleSelectTextInputChange = (value, errors, field) => {
    if (field !== undefined && field !== "undefined") {
      this.setState(
        () => ({
          [field]: { value, errors: Object.values(errors).filter(error => error) } //filter out undefined errors
        }),
        this.props.shouldConfirmExit(true)
      );
    }
  };

  handleToggleChange = event => {
    const { name: field } = event.target;
    const { checked } = event.target;
    if (checked !== undefined && checked !== "undefined") {
      this.setState(() => ({ [field]: { value: checked } }), this.props.shouldConfirmExit(true));
    }
  };

  updateNodeTaskName = (value, errors, field) => {
    if (field !== undefined && field !== "undefined") {
      this.setState(
        () => ({
          [field]: { value, errors: Object.values(errors).filter(error => error) } //filter out undefined errors
        }),
        this.props.shouldConfirmExit(true)
      );
    }
  };

  handleOnSave = e => {
    e.preventDefault();
    if (this.state["taskName"]) {
      this.props.node.taskName = this.state["taskName"].value;
    }
    this.props.onSave(this.createConfigToSave());
    this.props.closeModal();
  };

  createConfigToSave() {
    const stateKeys = Object.keys(this.state);
    const configToSave = {};
    stateKeys.forEach(key => {
      configToSave[key] = this.state[key].value;
    });

    return configToSave;
  }

  determineIsValidForm = () => {
    const stateKeys = Object.keys(this.state);
    if (!stateKeys.length) return false;
    let errorCount = 0;
    stateKeys.forEach(key => {
      const errors = this.state[key].errors;
      errorCount += errors ? errors.length : 0;
    });
    if (errorCount) return false;
    return true;
  };

  render() {
    const { nodeConfig, task } = this.props;
    return (
      <form onSubmit={this.handleOnSave}>
        <ModalContentBody
          style={{
            maxWidth: "35rem",
            height: "30rem",
            width: "100%",
            margin: "auto",
            overflow: "scroll",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start"
          }}
        >
          <ValueList
            updateNodeTaskName={this.updateNodeTaskName}
            taskNames={this.props.taskNames}
            node={this.props.node}
            task={task}
            nodeConfig={nodeConfig}
            form={this.state}
            onSelectTextInputChange={this.handleSelectTextInputChange}
            onToggleChange={this.handleToggleChange}
          />
        </ModalContentBody>
        <ModalContentFooter>
          <ModalConfirmButton theme="bmrg-white" text="Apply" disabled={!this.determineIsValidForm()} type="submit">
            Apply
          </ModalConfirmButton>
        </ModalContentFooter>
      </form>
    );
  }
}

export default DisplayForm;
