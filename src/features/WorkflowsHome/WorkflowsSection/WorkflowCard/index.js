import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { OverflowMenu, OverflowMenuItem } from "carbon-components-react";
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import AlertModal from "@boomerang/boomerang-components/lib/AlertModal";
import ConfirmModal from "@boomerang/boomerang-components/lib/ConfirmModal";
import Modal from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import WorkflowInputModalContent from "./WorkflowInputModalContent";
import imgs from "Assets/icons";
import deployIcon from "Assets/icons/deploy.svg";
import playButton from "./img/playButton.svg";
import "./styles.scss";

class WorkflowCard extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    workflow: PropTypes.object.isRequired,
    executeWorkflow: PropTypes.func.isRequired,
    deleteWorkflow: PropTypes.func.isRequired,
    teamId: PropTypes.string.isRequired
  };

  state = {
    deleteModalIsOpen: false
  };

  executeWorkflow = ({ redirect, properties }) => {
    this.props.executeWorkflow({ workflowId: this.props.workflow.id, redirect, properties });
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
        onClick: () => this.setState({ deleteModalIsOpen: true }),
        primaryFocus: false,
        isDelete: true
      }
    ];

    return (
      <div className="c-workflow-card">
        <div className="c-workflow-card__header">
          {/* <div className="c-workflow-card__status">
            <div className={`b-workflow-card__circle --${workflow.status}`} />
            <label className="b-workflow-card__status">{workflow.status}</label>
          </div> */}
          <OverflowMenu className="b-workflow-card__menu" ariaLabel="card menu" iconDescription="overflow menu icon ">
            {menuOptions.map(option => (
              <OverflowMenuItem
                className="b-workflow-card__option"
                requireTitle={false}
                closeMenu={() => {}}
                onClick={option.onClick}
                itemText={option.itemText}
                primaryFocus={option.primaryFocus}
                key={option.itemText}
              />
            ))}
          </OverflowMenu>
        </div>
        {this.state.deleteModalIsOpen && (
          <AlertModal
            isOpen
            modalProps={{ shouldCloseOnOverlayClick: false }}
            handleCloseModal={() => this.setState({ deleteModalIsOpen: false })}
            ModalTrigger={null}
            modalContent={closeModal => (
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
        )}
        <div className="c-workflow-card__info">
          <div className="c-workflow-card__icon">
            <img className="b-workflow-card__icon" src={imgs[workflow.icon ? workflow.icon : "docs"]} alt="icon" />
          </div>
          <div className="c-workflow-card__description">
            <Link to={`/editor/${workflow.id}/designer`}>
              <h2 className="b-workflow-card__name">{workflow.name}</h2>
            </Link>
            <p className="b-workflow-card__description">{workflow.shortDescription}</p>
            <span data-tip data-for={workflow.id} className="b-workflow-card-launch">
              {workflow.properties && workflow.properties.length > 0 ? (
                <Modal
                  ModalTrigger={() => (
                    <img src={playButton} className="b-workflow-card-launch__icon" alt="Execute workflow" />
                  )}
                  modalContent={(closeModal, rest) => (
                    <ModalFlow
                      headerTitle="Workflow Inputs"
                      headerSubtitle="Supply some values"
                      closeModal={closeModal}
                      confirmModalProps={{ affirmativeAction: closeModal, theme: "bmrg-white" }}
                      theme="bmrg-white"
                      {...rest}
                    >
                      <WorkflowInputModalContent
                        closeModal={closeModal}
                        executeWorkflow={this.executeWorkflow}
                        inputs={workflow.properties}
                      />
                    </ModalFlow>
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
                      img={deployIcon}
                      closeModal={closeModal}
                      affirmativeAction={() => this.executeWorkflow({ redirect: false })}
                      affirmativeText="Run"
                      theme="bmrg-white"
                    >
                      <button
                        className="bmrg--b-confirm-modal__button --affirmative --children"
                        onClick={() => this.executeWorkflow({ redirect: true })}
                      >
                        Run and View
                      </button>
                    </ConfirmModal>
                  )}
                />
              )}
            </span>
            <Tooltip id={workflow.id} place="bottom">
              Execute workflow
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(WorkflowCard);
