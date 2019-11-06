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
import styles from "./workflowCard.module.scss";

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
        itemText: "View Activity",
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
      <div className={styles.container}>
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
        <div className={styles.cardInfo}>
          <div className={styles.cardIconContainer}>
            <img className={styles.cardIcon} src={imgs[workflow.icon ? workflow.icon : "docs"]} alt="icon" />
          </div>
          <button onClick={this.setActiveTeamAndRedirect} className={styles.cardDescriptionContainer}>
            <h2 className={styles.cardName}>{workflow.name}</h2>
            <p className={styles.cardDescription}>{workflow.shortDescription}</p>
          </button>
        </div>
        <div className={styles.cardLaunch}>
          {workflow.properties && workflow.properties.length !== 0 ? (
            <ModalFlow
              modalHeaderProps={{
                title: "Workflow Inputs",
                subtitle: "Provide input values for your workflow"
              }}
              modalTrigger={({ openModal }) => (
                <Button iconDescription="Run Workflow" renderIcon={Run20} size="small" onClick={openModal}>
                  Run it
                </Button>
              )}
            >
              <WorkflowInputModalContent executeWorkflow={this.executeWorkflow} inputs={workflow.properties} />
            </ModalFlow>
          ) : (
            <ModalFlow
              composedModalProps={{ containerClassName: `${styles.executeWorkflow}` }}
              modalHeaderProps={{
                title: "Execute workflow?",
                subtitle: '"Run and View" will navigate you to the workflow exeuction view.'
              }}
              modalTrigger={({ openModal }) => (
                <Button iconDescription="Run Workflow" renderIcon={Run20} size="small" onClick={openModal}>
                  Run it
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
