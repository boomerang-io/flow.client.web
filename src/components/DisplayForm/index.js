import React, { Component } from "react";
import PropTypes from "prop-types";
import ModalContentBody from "@boomerang/boomerang-components/lib/ModalContentBody";
import ModalContentFooter from "@boomerang/boomerang-components/lib/ModalContentFooter";
import ModalConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import ValueList from "Components/ValueList";

class DisplayForm extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
    inputProperties: PropTypes.array,
    node: PropTypes.object.isRequired,
    nodeConfig: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    setIsModalOpen: PropTypes.func.isRequired,
    shouldConfirmExit: PropTypes.func,
    task: PropTypes.object.isRequired,
    taskNames: PropTypes.array.isRequired
  };

  state = {};

  componentDidMount() {
    this.props.setIsModalOpen({ isModalOpen: true });
  }
  componentWillUnmount() {
    this.props.setIsModalOpen({ isModalOpen: false });
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
          [field]: { value, errors } //filter out undefined errors
        }),
        this.props.shouldConfirmExit(true)
      );
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

  handleToggleChange = event => {
    const { name: field } = event.target;
    const { checked } = event.target;
    if (checked !== undefined && checked !== "undefined") {
      this.setState(() => ({ [field]: { value: checked } }), this.props.shouldConfirmExit(true));
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
    return (
      <>
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
            form={this.state}
            inputProperties={this.props.inputProperties}
            node={this.props.node}
            nodeConfig={this.props.nodeConfig}
            onSelectTextInputChange={this.handleSelectTextInputChange}
            onToggleChange={this.handleToggleChange}
            task={this.props.task}
            taskNames={this.props.taskNames}
            updateNodeTaskName={this.updateNodeTaskName}
          />
        </ModalContentBody>
        <ModalContentFooter>
          <ModalConfirmButton
            theme="bmrg-white"
            text="Apply"
            disabled={!this.determineIsValidForm()}
            onClick={this.handleOnSave}
          >
            Apply
          </ModalConfirmButton>
        </ModalContentFooter>
      </>
    );
  }
}

export default DisplayForm;
