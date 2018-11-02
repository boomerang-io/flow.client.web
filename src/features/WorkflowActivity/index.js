import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DiagramApplication from "Utilities/DiagramApplication";
import { DiagramWidget } from "@boomerang/boomerang-dag";
import { actions as workflowActions } from "State/workflow/fetch";
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
  }

  constructor(props) {
    super(props);
    //this.diagramApp = new DiagramApplication(props.workflow, true);
  }

  render() {
    const { workflow } = this.props;

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
  workflow: state.workflow.fetch
});

const mapDispatchToProps = dispatch => ({
  workflowActions: bindActionCreators(workflowActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowActivityContainer);
