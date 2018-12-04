import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { OverflowMenu, OverflowMenuItem } from "carbon-components-react";
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import AlertModal from "@boomerang/boomerang-components/lib/AlertModal";
import ConfirmModal from "@boomerang/boomerang-components/lib/ConfirmModal";
import Modal from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import WorkflowInputModalContent from "./WorkflowInputModalContent";
import imgs from "Assets/icons";
import "./styles.scss";
import playButton from "./img/playButton.svg";

class WorkflowCard extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    workflow: PropTypes.object.isRequired,
    updateWorkflows: PropTypes.func.isRequired,
    executeWorkflows: PropTypes.func.isRequired
  };

  executeWorkflow = redirect => {
    this.props.executeWorkflow({ workflowId: this.props.workflow.id, redirect });
  };

  render() {
    const { workflow, history, teamId, deleteWorkflow } = this.props;
    const menuOptions = [
      {
        itemText: "Edit",
        onClick: () => history.push(`/editor/${workflow.id}/designer`),
        primaryFocus: false
      },
      {
        itemText: "Activity",
        onClick: () => history.push(`/activity/${workflow.id}`),
        primaryFocus: false
      },
      {
        itemText: "Delete",
        primaryFocus: false,
        isDelete: true
      }
    ];

    return (
      <div className="c-workflow-card">
        <div className="c-workflow-card__header">
          <div className="c-workflow-card__status">
            <div className={`b-workflow-card__circle --${workflow.status}`} />
            <label className="b-workflow-card__status">{workflow.status}</label>
          </div>
          <OverflowMenu className="b-workflow-card__menu" ariaLabel="" iconDescription="">
            {menuOptions.map(option => {
              return option.isDelete ? (
                <AlertModal
                  ModalTrigger={() => (
                    <OverflowMenuItem
                      className="b-workflow-card__option"
                      requireTitle={false}
                      onClick={option.onClick}
                      itemText={option.itemText}
                      primaryFocus={option.primaryFocus}
                      key={option.itemText}
                    />
                  )}
                  modalContent={(closeModal, rest) => (
                    <ConfirmModal
                      closeModal={closeModal}
                      affirmativeAction={() => {
                        deleteWorkflow({ teamId, workflowId: workflow.id });
                      }}
                      title="DELETE THIS WORKFLOW?"
                      subTitleTop="It will be gone. Forever."
                      negativeText="NO"
                      affirmativeText="DELETE"
                      theme="bmrg-white"
                    />
                  )}
                />
              ) : (
                <OverflowMenuItem
                  className="b-workflow-card__option"
                  requireTitle={false}
                  onClick={option.onClick}
                  itemText={option.itemText}
                  primaryFocus={option.primaryFocus}
                  key={option.itemText}
                />
              );
            })}
          </OverflowMenu>
        </div>
        <div className="c-workflow-card__info">
          <div className="c-workflow-card__icon">
            <img className="b-workflow-card__icon" src={imgs[workflow.icon ? workflow.icon : "docs"]} alt="icon" />
          </div>
          <div className="c-workflow-card__description">
            <h2 className="b-workflow-card__name">{workflow.name}</h2>
            <p className="b-workflow-card__description">{workflow.shortDescription}</p>
            <span data-tip data-for={workflow.id} className="b-workflow-card-launch">
              {workflow.inputs && workflow.inputs.length > 0 ? (
                <Modal
                  ModalTrigger={() => (
                    <img src={playButton} className="b-workflow-card-launch__icon" alt="Execute workflow" />
                  )}
                  modalContent={(closeModal, rest) => (
                    <ModalFlow
                      headerTitle="Workflow Inputs"
                      headerSubtitle="Supply some values"
                      components={[{ step: 0, component: WorkflowInputModalContent }]}
                      closeModal={closeModal}
                      confirmModalProps={{ affirmativeAction: closeModal }}
                      inputs={workflow.inputs}
                      executeWorkflow={this.executeWorkflow}
                      theme="bmrg-white"
                      {...rest}
                    />
                  )}
                />
              ) : (
                <AlertModal
                  className="bmrg--c-alert-modal --execute-workflow"
                  ModalTrigger={() => (
                    <img src={playButton} className="b-workflow-card-launch__icon" alt="Execute workflow" />
                  )}
                  modalContent={closeModal => (
                    <ConfirmModal
                      style={{ width: "32rem", height: "28rem" }}
                      title="Execute workflow?"
                      subTitleTop="It will run"
                      closeModal={closeModal}
                      affirmativeAction={() => this.executeWorkflow(false)}
                      affirmativeText="Run"
                      theme="bmrg-white"
                    >
                      <button
                        className="bmrg--b-confirm-modal__button --affirmative --children"
                        onClick={() => this.executeWorkflow(true)}
                      >
                        Run and View
                      </button>
                    </ConfirmModal>
                  )}
                />
              )}
            </span>
            <Tooltip id={workflow.id} place="bottom" theme="bmrg-white">
              Execute workflow
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(WorkflowCard);
