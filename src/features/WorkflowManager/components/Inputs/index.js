import React, { Component } from "react";
import classnames from "classnames";
import AlertModalWrapper from "@boomerang/boomerang-components/lib/AlertModal";
import ConfirmModal from "@boomerang/boomerang-components/lib/ConfirmModal";
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import InputsModal from "./InputsModal";
import close from "Assets/svg/close_black.svg";
import pencil from "Assets/svg/pencil.svg";
import plus from "Assets/svg/plus.svg";
import { inputs } from "./constants";
import "./styles.scss";

class Inputs extends Component {
  formatDefaultValue = value => {
    switch (typeof value) {
      case "boolean":
        return value.toString();
      case "object":
        return value.join(", ");
      default:
        return value;
    }
  };

  deleteInput = id => {
    console.log(`Remove input with id ${id}`);
  };

  render() {
    return (
      <div className="c-workflow-inputs">
        <div className="b-workflow-inputs">
          {inputs.length > 0 &&
            inputs.map(input => (
              <div key={input.id} className={classnames("b-workflow-input", `--${input.type}`)}>
                <div className="b-workflow-input__name">{input.name}</div>
                <div className="b-workflow-input-field">
                  <div className="b-workflow-input-field__key">Description </div>
                  <div className="b-workflow-input-field__value">{input.description}</div>
                </div>
                <div className="b-workflow-input-field">
                  <div className="b-workflow-input-field__key">Type </div>
                  <div className="b-workflow-input-field__value">{input.type}</div>
                </div>
                <div className="b-workflow-input-field">
                  <div className="b-workflow-input-field__key">Default value </div>
                  <div className="b-workflow-input-field__value">{this.formatDefaultValue(input.defaultValue)}</div>
                </div>
                <AlertModalWrapper
                  ModalTrigger={() => (
                    <>
                      <img
                        data-tip
                        data-for={`${input.id}`}
                        className="b-workflow-input__delete"
                        src={close}
                        alt="delete"
                      />
                      <Tooltip id={`${input.id}`} place="top" theme="bmrg-white">
                        Delete Input
                      </Tooltip>
                    </>
                  )}
                  modalContent={(closeModal, rest) => (
                    <ConfirmModal
                      closeModal={closeModal}
                      affirmativeAction={() => {
                        closeModal();
                        this.deleteInput(input.id);
                      }}
                      title="REMOVE THIS PROPERTY?"
                      subTitleTop="This input parameter will be deleted"
                      cancelText="NO"
                      affirmativeText="YES"
                      theme="bmrg-white"
                      {...rest}
                    />
                  )}
                />
                <InputsModal
                  isEdit
                  Button={() => (
                    <div className="b-workflow-input-edit">
                      Edit
                      <img className="b-workflow-input-edit__pencil" src={pencil} alt="edit" />
                    </div>
                  )}
                  input={input}
                />
              </div>
            ))}
          <InputsModal
            isEdit={false}
            Button={() => (
              <div className="b-workflow-input-create">
                <img className="b-workflow-input-create__plus" src={plus} alt="create" />
                Create New Property
              </div>
            )}
          />
        </div>
      </div>
    );
  }
}

export default Inputs;
