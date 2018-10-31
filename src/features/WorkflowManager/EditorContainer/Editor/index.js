import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import { DiagramWidget } from "@boomerang/boomerang-dag";
import ActionBar from "Features/WorkflowManager/components/ActionBar";
import Navigation from "Features/WorkflowManager/components/Navigation";
import Overview from "Features/WorkflowManager/components/Overview";
import TasksSidenav from "Features/WorkflowManager/components/TasksSidenav";
import DiagramApplication from "Utilities/DiagramApplication";
import "./styles.scss";

class WorkflowEditor extends Component {
  static propTypes = {
    createNode: PropTypes.func.isRequired,
    diagramApp: PropTypes.object.isRequired,
    createWorkflowRevision: PropTypes.func.isRequired,
    handleOnOverviewChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.diagramApp = new DiagramApplication({ dag: props.workflowRevision.dag, isLocked: false });
  }

  render() {
    const { createNode, createWorkflowRevision, handleOnOverviewChange, match, workflow } = this.props;

    return (
      <>
        <Navigation />
        <Switch>
          <Route
            path={`${match.path}/overview`}
            component={props => (
              <>
                <ActionBar
                  actionButtonText="Update"
                  onClick={() => createWorkflowRevision(this.diagramApp)}
                  diagramApp={this.diagramApp}
                  {...props}
                />
                <Overview handleOnChange={handleOnOverviewChange} workflow={workflow} />
              </>
            )}
          />
          <Route
            path={`${match.path}/designer`}
            render={props => (
              <>
                <ActionBar
                  actionButtonText="Update"
                  onClick={() => createWorkflowRevision(this.diagramApp)}
                  diagramApp={this.diagramApp}
                  includeZoom
                  {...props}
                />
                <TasksSidenav />
                <div className="content">
                  <div
                    className="diagram-layer"
                    onDrop={event => createNode(this.diagramApp, event)}
                    onDragOver={event => {
                      event.preventDefault();
                    }}
                  >
                    <DiagramWidget
                      className="srd-demo-canvas"
                      diagramEngine={this.diagramApp.getDiagramEngine()}
                      maxNumberPointsPerLink={0}
                      smartRouting={true}
                      deleteKeys={[]}
                    />
                  </div>
                </div>
              </>
            )}
          />
        </Switch>
      </>
    );
  }
}

const mapStateToProps = state => ({
  workflowRevision: state.workflowRevision
});

const mapDispatchToProps = dispatch => ({
  workflowRevisionActions: bindActionCreators(workflowRevisionActions, dispatch)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(WorkflowEditor)
);
