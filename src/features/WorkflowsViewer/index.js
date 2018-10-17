import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowActions } from "State/workflow/fetch";
import { Link } from "react-router-dom";
import { Tile } from "carbon-components-react";
import NoDisplay from "@boomerang/boomerang-components/lib/NoDisplay";
import Sidenav from "@boomerang/boomerang-components/lib/Sidenav";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import "./styles.scss";

class WorkflowsViewerContainer extends Component {
  componentDidMount() {
    this.props.workflowActions.fetch(`${BASE_SERVICE_URL}/workflow`);
  }

  formatWorkflows = () => {
    return this.props.workflow.data.map(workflow => (
      <Link to={`/editor/${workflow.id}`} key={workflow.id}>
        <Tile>{workflow.id}</Tile>
      </Link>
    ));
  };

  render() {
    const { workflow } = this.props;

    if (workflow.status === REQUEST_STATUSES.SUCCESS) {
      return (
        <div className="c-workflow-viewer">
          <Sidenav theme="bmrg-white" content={() => this.formatWorkflows()} />
          <NoDisplay text="Select a workflow" style={{ paddingTop: "5rem" }} />
        </div>
      );
    }

    return null;
  }
}

const mapStateToProps = state => ({
  workflow: state.workflow.fetch
});

const mapDispatchToProps = dispatch => ({
  workflowActions: bindActionCreators(workflowActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowsViewerContainer);
