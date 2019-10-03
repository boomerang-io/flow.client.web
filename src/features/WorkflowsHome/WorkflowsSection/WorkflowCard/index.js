import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Button, OverflowMenu, OverflowMenuItem } from "carbon-components-react";
import { notify, ToastNotification, ModalFlow, ConfirmModal } from "@boomerang/carbon-addons-boomerang-react";
import fileDownload from "js-file-download";
import WorkflowInputModalContent from "./WorkflowInputModalContent";
import WorkflowRunModalContent from "./WorkflowRunModalContent";
import imgs from "Assets/icons";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import { Run20 } from "@carbon/icons-react";
import "./styles.scss";

class WorkflowCard extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    workflow: PropTypes.object.isRequired,
    executeWorkflow: PropTypes.func.isRequired,
    deleteWorkflow: PropTypes.func.isRequired,
    setActiveTeam: PropTypes.func.isRequired,
    teamId: PropTypes.string.isRequired
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
            negativeText="NO"
            affirmativeText="DELETE"
            title="DELETE THIS WORKFLOW?"
            isOpen={this.state.deleteModalIsOpen}
            negativeAction={() => {
              this.setState({ deleteModalIsOpen: false });
            }}
            onCloseModal={() => {
              this.setState({ deleteModalIsOpen: false });
            }}
          >
            <div>It will be gone. Forever. </div>
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
          {workflow.properties && workflow.properties.length === 0 ? (
            <ModalFlow
              composedModalProps={{ containerClassName: "" }}
              confirmModalProps={{
                title: "Close this?",
                children: <div>Your request will not be saved</div>
              }}
              ModalTrigger={({ openModal }) => (
                <Button iconDecscription="Run Workflow" renderIcon={Run20} size="small" onClick={openModal}>
                  Execute Workflow
                </Button>
              )}
              modalHeaderProps={{
                title: "Workflow Inputs",
                subTitle: "Supply some values"
              }}
            >
              <WorkflowInputModalContent executeWorkflow={this.executeWorkflow} inputs={workflow.properties} />
            </ModalFlow>
          ) : (
            <ModalFlow
              composedModalProps={{ containerClassName: "run-modal" }}
              confirmModalProps={{
                title: "Close this?",
                children: <div>Your request will not be saved</div>
              }}
              modalTrigger={({ openModal }) => (
                <Button iconDescription="Run Workflow" renderIcon={Run20} size="small" onClick={openModal}>
                  Execute Workflow
                </Button>
              )}
              modalHeaderProps={{
                title: "Execute workflow?",
                subTitle: "It will run"
              }}
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
