import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowActions } from "State/workflow/fetch";
import { Link } from "react-router-dom";
import sortBy from "lodash/sortBy";
import Button from "@boomerang/boomerang-components/lib/Button";
import NoDisplay from "@boomerang/boomerang-components/lib/NoDisplay";
import Sidenav from "@boomerang/boomerang-components/lib/Sidenav";
import ErrorDragon from "Components/ErrorDragon";
import SearchFilterBar from "Components/SearchFilterBar";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import "./styles.scss";

class WorkflowsViewerContainer extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
    workflowActions: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.workflowActions.fetch(`${BASE_SERVICE_URL}/workflow`);
  }

  formatWorkflows = () => {
    return this.props.workflow.data.map(workflow => (
      <Link to={`/editor/${workflow.id}/designer`} key={workflow.id}>
        {workflow.id}
      </Link>
    ));
  };

  render() {
    const { workflow } = this.props;

    if (workflow.status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon />;
    }

    if (workflow.status === REQUEST_STATUSES.SUCCESS) {
      return (
        <div className="c-workflow-viewer">
          <Sidenav
            theme="bmrg-white"
            content={() => <div className="c-sidenav-section">{this.formatWorkflows()}</div>}
            header={() => (
              <div className="c-sidenav-section">
                <Link to="/creator/overview">
                  <Button theme="bmrg-black">Create Workflow</Button>
                </Link>
              </div>
            )}
          />
          <div className="c-workflow-viewer-content">
            <NoDisplay text="Select a workflow" />
          </div>
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
