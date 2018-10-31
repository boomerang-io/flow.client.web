import React, { Component } from "react";
import axios from "axios";
import { notify, Notification } from "@boomerang/boomerang-components/lib/Notifications";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { OverflowMenu, OverflowMenuItem } from "carbon-components-react";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import AlertModal from "@boomerang/boomerang-components/lib/AlertModal";
import ConfirmModal from "@boomerang/boomerang-components/lib/ConfirmModal";
import imgs from "Assets/icons";
import "./styles.scss";
import playButton from "./img/playButton.svg";

class WorkflowCard extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    workflow: PropTypes.object.isRequired,
    updateWorkflows: PropTypes.func.isRequired
  };

  handleExecute = () => {
    return axios
      .post(`${BASE_SERVICE_URL}/execute/${this.props.workflow.id}`)
      .then(response => {
        notify(<Notification type="success" title="Run Workflow" message="Succssfully ran workflow" />);
      })
      .catch(error => {
        notify(<Notification type="error" title="Something's wrong" message="Failed to run workflow" />);
      });
  };

  handleOnDelete = () => {
    // axios
    //   .delete(`${BASE_SERVICE_URL}/workflow/${this.props.workflow.id}`)
    //   .then(() => {
    //     notify(<Notification type="remove" title="SUCCESS" message="Workflow successfully deleted" />);
    //     this.props.updateWorkflows({workflowId:this.props.workflow.id, teamId:this.props.teamId});
    //     return;
    //   })
    //   .catch(() => {
    //     notify(<Notification type="error" title="SOMETHING'S WRONG" message="Your delete request has failed" />);
    //     return;
    //   });
    //this.props.updateWorkflows({ workflowId: this.props.workflow.id, teamId: this.props.teamId });
  };

  render() {
    const { workflow, history } = this.props;
    const menuOptions = [
      {
        itemText: "View Activity",
        onClick: () => history.push(`/activity/dfb6302b-62e0-4574-9062-727e4a37fc32`),
        primaryFocus: true
      },
      {
        itemText: "Edit Workflow",
        onClick: () => history.push(`/editor/${workflow.id}/designer`),
        primaryFocus: false
      },
      { itemText: "Delete", onClick: () => this.handleOnDelete(), primaryFocus: false }
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
              return (
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
            <img className="b-workflow-card__icon" src={imgs[workflow.icon]} alt="icon" />
          </div>
          <div className="c-workflow-card__description">
            <h2 className="b-workflow-card__name">{workflow.name}</h2>
            <p className="b-workflow-card__description">{workflow.description}</p>
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
                    affirmativeAction={this.handleExecute}
                    affirmativeText="Run"
                    theme="bmrg-white"
                  />
                )}
              />
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
