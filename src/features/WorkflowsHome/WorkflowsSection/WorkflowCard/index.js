import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";
import { OverflowMenu, OverflowMenuItem } from "carbon-components-react";
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import AlertModal from "@boomerang/boomerang-components/lib/AlertModal";
import ConfirmModal from "@boomerang/boomerang-components/lib/ConfirmModal";
import Modal from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import { notify, Notification } from "@boomerang/boomerang-components/lib/Notifications";
import fileDownload from "js-file-download";
import WorkflowInputModalContent from "./WorkflowInputModalContent";
import imgs from "Assets/icons";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import deployIcon from "Assets/icons/deploy.svg";
import playButton from "./img/playButton.svg";
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

  executeWorkflow = ({ redirect, properties }) => {
    this.props.executeWorkflow({ workflowId: this.props.workflow.id, redirect, properties });
  };

  handleExportWorkflow = workflow => {
    notify(<Notification type="notify" title="Export Workflow" message="Your download will start soon." />);
    axios
      .get(`${BASE_SERVICE_URL}/workflow/export/${workflow.id}`)
      .then(res => {
        const status = res.status.toString();
        if (status.startsWith("4") || status.startsWith("5"))
          notify(<Notification type="error" title="Export Workflow" message="Something went wrong." />);
        else fileDownload(JSON.stringify(res.data, null, 4), `${workflow.name}.json`);
      })
      .catch(error => {
        notify(<Notification type="error" title="Export Workflow" message="Something went wrong." />);
      });
  };

  render() {
    const { workflow, history, teamId, deleteWorkflow, setActiveTeam } = this.props;
    const menuOptions = [
      {
        itemText: "Edit",
        onClick: () => {
          setActiveTeam(teamId);
          history.push(`/editor/${workflow.id}/designer`);
        },
        primaryFocus: false
      },
      {
        itemText: "Activity",
        onClick: () => history.push(`/activity/${workflow.id}`),
        primaryFocus: false
      },
      {
        itemText: "Export",
        onClick: () => this.handleExportWorkflow(workflow),
        primaryFocus: false,
        isDelete: false
      },
      {
        itemText: "Delete",
        hasDivider: true,
        isDelete: true,
        onClick: () => this.setState({ deleteModalIsOpen: true }),
        primaryFocus: false
      }
    ];

    return (
      <div className="c-workflow-card">
        {/* <div className="c-workflow-card__status">
            <div className={`b-workflow-card__circle --${workflow.status}`} />
            <label className="b-workflow-card__status">{workflow.status}</label>
          </div> */}
        <OverflowMenu
          className="b-workflow-card__menu"
          ariaLabel="card menu"
          iconDescription="overflow menu icon"
          style={{ position: "absolute", right: "0" }}
          floatingMenu={true}
        >
          {menuOptions.map(({ onClick, itemText, primaryFocus, ...rest }) => (
            <OverflowMenuItem
              requireTitle={false}
              closeMenu={() => {}}
              onClick={onClick}
              itemText={itemText}
              primaryFocus={primaryFocus}
              key={itemText}
              {...rest}
            />
          ))}
        </OverflowMenu>
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
        <div className="c-workflow-card-info">
          <div className="c-workflow-card__icon">
            <img className="b-workflow-card__icon" src={imgs[workflow.icon ? workflow.icon : "docs"]} alt="icon" />
          </div>
          <Link to={`/editor/${workflow.id}/designer`} className="c-workflow-card__description">
            <h2 className="b-workflow-card__name">{workflow.name}</h2>
            <p className="b-workflow-card__description">{workflow.shortDescription}</p>
          </Link>
          <div data-tip data-for={workflow.id} className="b-workflow-card-launch">
            {workflow.properties && workflow.properties.length > 0 ? (
              <Modal
                modalProps={{ shouldCloseOnOverlayClick: false }}
                ModalTrigger={() => (
                  <button>
                    <img src={playButton} className="b-workflow-card-launch__icon" alt="Execute workflow" />
                  </button>
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
                modalProps={{ shouldCloseOnOverlayClick: false }}
                ModalTrigger={() => (
                  <button>
                    <img src={playButton} className="b-workflow-card-launch__icon" alt="Execute workflow" />
                  </button>
                )}
                modalContent={closeModal => (
                  <ConfirmModal
                    title="Execute workflow?"
                    subTitleTop="It will run"
                    img={deployIcon}
                    closeModal={closeModal}
                    affirmativeAction={() => this.executeWorkflow({ redirect: false })}
                    affirmativeText="RUN"
                    theme="bmrg-white"
                  >
                    <button
                      className="bmrg--b-confirm-modal__button --affirmative --children"
                      onClick={() => this.executeWorkflow({ redirect: true })}
                    >
                      RUN & VIEW
                    </button>
                  </ConfirmModal>
                )}
              />
            )}
          </div>
          <Tooltip id={workflow.id} place="bottom">
            Execute workflow
          </Tooltip>
        </div>
      </div>
    );
  }
}

export default withRouter(WorkflowCard);
