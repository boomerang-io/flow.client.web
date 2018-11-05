import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DiagramApplication from "Utilities/DiagramApplication";
import { DiagramWidget } from "@boomerang/boomerang-dag";
import { actions as workflowActions } from "State/workflow/fetch";
import { actions as tasksActions } from "State/tasks";
import StepSideInfo from "../WorkflowExecution/StepSideInfo";
import TimeProgressBar from "Components/TimeProgressBar";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";

class WorkflowActivityContainer extends Component {
  static propTypes = {
    workflow: PropTypes.object,
    workflowActions: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { match } = this.props;
    const { workflowId } = match.params;
    this.props.workflowActions.fetch(`${BASE_SERVICE_URL}/workflow/${workflowId}`);
    this.props.tasksActions.fetchTasks(`${BASE_SERVICE_URL}/activity/${this.props.match.params.workflowId}`);
  }

  constructor(props) {
    super(props);
    //this.diagramApp = new DiagramApplication(props.workflow, true);
  }

  render() {
    const { workflow } = this.props;
    const { status, data } = this.props.tasks;

    if (workflow.status === REQUEST_STATUSES.SUCCESS) {
      this.diagramApp = new DiagramApplication(workflow.data, true);
      return (
        <div className="content">
          <div className="diagram-layer">
            <DiagramWidget
              className="srd-demo-canvas"
              diagramEngine={this.diagramApp.getDiagramEngine()}
              maxNumberPointsPerLink={0}
              smartRouting={true}
              deleteKeys={[]}
              allowLooseLinks={false}
              allowCanvasTranslation={false}
              allowCanvasZoo={false}
            />
          </div>
        </div>
      );
    }

    return null;
  }
}

const mapStateToProps = (state, ownProps) => ({
  workflow: state.workflow.fetch,
  tasks: state.tasks,
  workflowRevision: state.workflowRevision
});

const mapDispatchToProps = dispatch => ({
  workflowActions: bindActionCreators(workflowActions, dispatch),
  tasksActions: bindActionCreators(tasksActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowActivityContainer);
