import React, { Component } from "react";
import axios from "axios";
import { notify, Notification } from "@boomerang/boomerang-components/lib/Notifications";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { OverflowMenu, OverflowMenuItem } from "carbon-components-react";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import imgs from "./img";
import "./styles.scss";
import "carbon-components/scss/components/overflow-menu/_overflow-menu.scss";

class WorkflowCard extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    workflow: PropTypes.object.isRequired,
    updateWorkflows: PropTypes.func.isRequired
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
      this.props.updateWorkflows({workflowId:this.props.workflow.id, teamId:this.props.teamId});
  };

  render() {
    const { workflow, history } = this.props;

    const menuOptions = [
      {itemText:"View Activity", onClick:()=>history.push(`/activity/${workflow.id}`), primaryFocus:true},
      {itemText:"Edit Workflow", onClick:()=>history.push(`/editor/${workflow.id}`), primaryFocus:false},
      {itemText:"Duplicate", onClick:()=>console.log("duplicate"), primaryFocus:false},
      {itemText:"Export", onClick:()=>console.log("export"), primaryFocus:false},
      {itemText:"Delete", onClick:()=>this.handleOnDelete(), primaryFocus:false}
    ];

    return(
      <div className="c-workflow-card">
        <div className="c-workflow-card__header">
          <div className="c-workflow-card__status">
            <div className={`b-workflow-card__circle --${workflow.status}`}></div>
            <label className="b-workflow-card__status">{workflow.status}</label>            
          </div>
          <OverflowMenu
            className="b-workflow-card__menu"
            ariaLabel=""
            iconDescription=""
          >
          {
            menuOptions.map(option=>{
              return(
                <OverflowMenuItem
                  className="b-workflow-card__option"
                  requireTitle={false}
                  onClick={option.onClick}
                  itemText={option.itemText}
                  primaryFocus={option.primaryFocus}
                />
              );
            })
          }
            
          </OverflowMenu>
        </div>
        <div className="c-workflow-card__info">
          <div className="c-workflow-card__icon">
            <img className="b-workflow-card__icon" src={imgs[workflow.type]} alt="icon"/>
          </div>
          <div className="c-workflow-card__description">
            <div className="b-workflow-card__name">{workflow.name}</div>
            <div className="b-workflow-card__description">{workflow.description}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(WorkflowCard);
