import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowConfigActions } from "State/workflowConfig/fetch";
import { DiagramWidget } from "@boomerang/boomerang-dag";
import ActionBar from "Features/WorkflowManager/components/ActionBar";
import Overview from "Features/WorkflowManager/components/Overview";
import TaskTray from "Features/WorkflowManager/components/TaskTray";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import DiagramApplication from "Utilities/DiagramApplication";
import "./styles.scss";

class WorkflowEditorContainer extends Component {
  static propTypes = {
    createNode: PropTypes.func.isRequired,
    diagramApp: PropTypes.object.isRequired,
    handleOnUpdate: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { match } = this.props;
    const { workflowId } = match.params;
    this.props.workflowConfigActions.fetch(`${BASE_SERVICE_URL}/taskconfiguration/workflow/${workflowId}`);
  }

  handleOnUpdate = () => {
    this.props.handleOnUpdate({ workflowConfigId: this.props.workflowConfig.id });
  };

  render() {
    const { match } = this.props;
    if (this.props.workflowConfig.status === REQUEST_STATUSES.SUCCESS) {
      return (
        <>
          <ActionBar onClick={this.handleOnUpdate} actionButtonText="Update" diagramApp={this.props.diagramApp} />
          <Switch>
            <Route path={`${match.path}/overview`} component={Overview} />
            <Route
              path={`${match.path}/designer`}
              render={() => (
                <>
                  <TaskTray />
                  <div className="content">
                    <div
                      className="diagram-layer"
                      onDrop={this.props.createNode}
                      onDragOver={event => {
                        event.preventDefault();
                      }}
                    >
                      <DiagramWidget
                        className="srd-demo-canvas"
                        diagramEngine={this.props.diagramApp.getDiagramEngine()}
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
    return null;
  }
}

const mapStateToProps = state => ({
  workflowConfig: state.workflowConfig.fetch
});

const mapDispatchToProps = dispatch => ({
  workflowConfigActions: bindActionCreators(workflowConfigActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowEditorContainer);
