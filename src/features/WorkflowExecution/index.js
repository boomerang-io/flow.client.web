import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DiagramApplication from "Utilities/DiagramApplication";
import { DiagramWidget } from "@boomerang/boomerang-dag";

class WorkflowExecutionContainer extends Component {
  static propTypes = {
    tasks: PropTypes.object.isRequired,
    tasksActions: PropTypes.object.isRequired,
    workflow: PropTypes.object,
    workflowConfigActions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.diagramApp = new DiagramApplication({ dag: props.workflowRevision.dag, isLocked: true });
  }

  render() {
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
}

const mapStateToProps = state => ({
  workflowRevision: state.workflowRevision
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowExecutionContainer);
