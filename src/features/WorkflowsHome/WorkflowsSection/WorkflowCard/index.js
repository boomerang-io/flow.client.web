import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { withRouter } from "react-router-dom";
import fileDownload from "js-file-download";
import { Button, OverflowMenu, OverflowMenuItem } from "carbon-components-react";
import { notify, ToastNotification, ModalFlow, ConfirmModal } from "@boomerang/carbon-addons-boomerang-react";
import WorkflowInputModalContent from "./WorkflowInputModalContent";
import WorkflowRunModalContent from "./WorkflowRunModalContent";
import imgs from "Assets/icons";
import { Run20 } from "@carbon/icons-react";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import "./styles.scss";

class WorkflowCard extends Component {
  static propTypes = {
    deleteWorkflow: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    setActiveTeam: PropTypes.func.isRequired,
    teamId: PropTypes.string.isRequired,
    workflow: PropTypes.object.isRequired
  };

  state = {
    deleteModalIsOpen: false
  };

  componentWillUnmount() {
    this.handleOverflowMenuClose();
  }

  executeWorkflow = ({ redirect, properties }) => {
    this.props.executeWorkflow({ workflowId: this.props.workflow.id, redirect, properties });
  };

  handleExportWorkflow = workflow => {
    notify(<ToastNotification kind="info" title="Export Workflow" subtitle="Your download will start soon." />);
    axios
      .get(`${BASE_SERVICE_URL}/workflow/export/${workflow.id}`)
      .then(res => {
        const status = res.status.toString();
        if (status.startsWith("4") || status.startsWith("5"))
          notify(<ToastNotification kind="error" title="Export Workflow" subtitle="Something went wrong." />);
        else fileDownload(JSON.stringify(res.data, null, 4), `${workflow.name}.json`);
      })
      .catch(error => {
        notify(<ToastNotification kind="error" title="Export Workflow" subtitle="Something went wrong." />);
      });
  };

  setActiveTeamAndRedirect = () => {
    const { history, setActiveTeam, teamId, workflow } = this.props;
    setActiveTeam(teamId);
    history.push(`/editor/${workflow.id}/designer`);
  };

  /* prevent page scroll when up or down arrows are pressed **/
  preventKeyScrolling = e => {
    if ([38, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  };

  handleOverflowMenuOpen = () => {
    window.addEventListener("keydown", this.preventKeyScrolling, false);
  };

  handleOverflowMenuClose = () => {
    window.removeEventListener("keydown", this.preventKeyScrolling, false);
  };

  render() {
    const { workflow, history, teamId, deleteWorkflow } = this.props;
    const menuOptions = [
      {
        itemText: "Edit",
        onClick: this.setActiveTeamAndRedirect,
        primaryFocus: true
      },
      {
        itemText: "Activity",
        onClick: () => history.push(`/activity?page=0&size=10&workflowIds=${workflow.id}`)
      },
      {
        itemText: "Export",
        onClick: () => this.handleExportWorkflow(workflow),
        isDelete: false
      },
      {
        itemText: "Delete",
        hasDivider: true,
        isDelete: true,
        onClick: () => this.setState({ deleteModalIsOpen: true })
      }
    ];

    return (
      <div className="c-workflow-card">
        <OverflowMenu
          ariaLabel="Overflow card menu"
          iconDescription="Overflow menu icon"
          onOpen={this.handleOverflowMenuOpen}
          onClose={this.handleOverflowMenuClose}
          style={{ position: "absolute", right: "0" }}
        >
          {menuOptions.map(({ onClick, itemText, ...rest }, index) => (
            <OverflowMenuItem onClick={onClick} itemText={itemText} key={`${itemText}-${index}`} {...rest} />
          ))}
        </OverflowMenu>
        {this.state.deleteModalIsOpen && (
          <ConfirmModal
            affirmativeAction={() => {
              deleteWorkflow({ teamId, workflowId: workflow.id });
            }}
            affirmativeText="Delete"
            isOpen={this.state.deleteModalIsOpen}
            negativeAction={() => {
              this.setState({ deleteModalIsOpen: false });
            }}
            negativeText="No"
            onCloseModal={() => {
              this.setState({ deleteModalIsOpen: false });
            }}
            title="Delete this workflow?"
          >
            It will be gone. Forever.
          </ConfirmModal>
        )}
        <div className="c-workflow-card-info">
          <div className="c-workflow-card__icon">
            <img className="b-workflow-card__icon" src={imgs[workflow.icon ? workflow.icon : "docs"]} alt="icon" />
          </div>
          <button onClick={this.setActiveTeamAndRedirect} className="c-workflow-card__description">
            <h2 className="b-workflow-card__name">{workflow.name}</h2>
            <p className="b-workflow-card__description">{workflow.shortDescription}</p>
          </button>
        </div>
        <div className="b-workflow-card-launch">
          {workflow.properties && workflow.properties.length !== 0 ? (
            <ModalFlow
              modalHeaderProps={{
                title: "Workflow Inputs",
                subTitle: "Provide input values for your workflow"
              }}
              modalTrigger={({ openModal }) => (
                <Button iconDecscription="Run Workflow" renderIcon={Run20} size="small" onClick={openModal}>
                  Execute Workflow
                </Button>
              )}
            >
              <WorkflowInputModalContent executeWorkflow={this.executeWorkflow} inputs={workflow.properties} />
            </ModalFlow>
          ) : (
            <ModalFlow
              composedModalProps={{ containerClassName: "c-execute-workflow-modal" }}
              modalHeaderProps={{
                title: "Execute workflow?",
                subTitle: '"Run and View" will navigate you to the workflow exeuction view.'
              }}
              modalTrigger={({ openModal }) => (
                <Button iconDescription="Run Workflow" renderIcon={Run20} size="small" onClick={openModal}>
                  Execute Workflow
                </Button>
              )}
            >
              <WorkflowRunModalContent executeWorkflow={this.executeWorkflow} />
            </ModalFlow>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(WorkflowCard);
