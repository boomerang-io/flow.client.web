import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { OverflowMenu, OverflowMenuItem } from "carbon-components-react";
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import AlertModal from "@boomerang/boomerang-components/lib/AlertModal";
import ConfirmModal from "@boomerang/boomerang-components/lib/ConfirmModal";
import imgs from "Assets/icons";
import "./styles.scss";
import playButton from "./img/playButton.svg";
import forwardButton from "./img/forwardButton.svg";

class WorkflowCard extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    workflow: PropTypes.object.isRequired,
    updateWorkflows: PropTypes.func.isRequired
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
        onClick: () => history.push(`/activity`),
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
              <AlertModal
                ModalTrigger={() => (
                  <img src={playButton} className="b-workflow-card-launch__icon" alt="Execute workflow" />
                )}
                modalContent={closeModal => (
                  <ConfirmModal
                    title="Execute workflow?"
                    subTitleTop="It will run"
                    closeModal={closeModal}
                    affirmativeAction={() => this.props.executeWorkflow(workflow.id, false)}
                    affirmativeText="Run"
                    theme="bmrg-white"
                  />
                )}
              />
            </span>
            <span data-tip data-for={`${workflow.id}-activity`} className="b-workflow-card-activity">
              <AlertModal
                ModalTrigger={() => (
                  <img src={forwardButton} className="b-workflow-card-activity__icon" alt="Run and View Activity" />
                )}
                modalContent={closeModal => (
                  <ConfirmModal
                    title="Run and View Activity?"
                    subTitleTop="You will be redirected to activity details"
                    closeModal={closeModal}
                    affirmativeAction={() => this.props.executeWorkflow(workflow.id, true)}
                    affirmativeText="Run"
                    theme="bmrg-white"
                  />
                )}
              />
            </span>
            <Tooltip id={workflow.id} place="bottom" theme="bmrg-white">
              Execute workflow
            </Tooltip>
            <Tooltip id={`${workflow.id}-activity`} place="bottom" theme="bmrg-white">
              Run and View Activity
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(WorkflowCard);
