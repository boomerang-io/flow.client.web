import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowActions } from "State/workflow/fetch";
import { actions as teamsActions } from "State/teams";
import { Link } from "react-router-dom";
import sortBy from "lodash/sortBy";
import Button from "@boomerang/boomerang-components/lib/Button";
// import NoDisplay from "@boomerang/boomerang-components/lib/NoDisplay";
import Sidenav from "@boomerang/boomerang-components/lib/Sidenav";
import ErrorDragon from "Components/ErrorDragon";
import SearchFilterBar from "Components/SearchFilterBar";
import WorkflowsSection from "./WorkflowsSection";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import "./styles.scss";

class WorkflowsViewerContainer extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
    workflowActions: PropTypes.object.isRequired,
    teams: PropTypes.object.isRequired,
    teamsActions: PropTypes.object.isRequired
  };

  state = {
    searchQuery: "",
    teamsFilter: []
  }

  componentDidMount() {
    this.props.workflowActions.fetch(`${BASE_SERVICE_URL}/workflow`);
    this.props.teamsActions.fetch(`${BASE_SERVICE_URL}/teams`);
  }

  handleSearchFilter = (searchQuery, teams) => {
    this.setState({ searchQuery, teamsFilter: teams });
  }

  filterTeams = () => {
    const { teams } = this.props;
    const { teamsFilter } = this.state;

    if (teamsFilter.length > 0) {
      return teams.data.filter(team => teamsFilter.find(filter => filter.text === team.name));
    } else {
      return teams.data;
    }
  }

  updateWorkflows = (data) => {
    this.props.teamsActions.updateWorkflows(data);
  };

  formatWorkflows = () => {
    return this.props.workflow.data.map(workflow => (
      <Link to={`/editor/${workflow.id}`} key={workflow.id}>
        {workflow.id}
      </Link>
    ));
  };

  render() {
    const { workflow, teams } = this.props;
    const { searchQuery } = this.state;

    if (workflow.status === REQUEST_STATUSES.FAILURE || teams.status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon />;
    }

    if (workflow.status === REQUEST_STATUSES.SUCCESS && teams.status === REQUEST_STATUSES.SUCCESS) {
      const filteredTeams = this.filterTeams();
      const sortedTeams = sortBy(filteredTeams,["name"]);

      return (
        <div className="c-workflow-viewer">
          <Sidenav
            theme="bmrg-white"
            content={() => <div className="c-sidenav-section">{this.formatWorkflows()}</div>}
            header={() => (
              <div className="c-sidenav-section">
                <Link to="/editor">
                  <Button theme="bmrg-black">Create Workflow</Button>
                </Link>
              </div>
            )}
          />
          <div className="c-workflow-viewer-content">
            {/* <NoDisplay text="Select a workflow" /> */}
            <SearchFilterBar handleSearchFilter={this.handleSearchFilter} teams={teams.data} />
            {
              sortedTeams.map(team=>{
                return <WorkflowsSection team={team} searchQuery={searchQuery} updateWorkflows={this.updateWorkflows}/>;
              })
            }
          </div>
        </div>
      );
    }

    return null;
  }
}

const mapStateToProps = state => ({
  workflow: state.workflow.fetch,
  teams: state.teams
});

const mapDispatchToProps = dispatch => ({
  workflowActions: bindActionCreators(workflowActions, dispatch),
  teamsActions: bindActionCreators(teamsActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowsViewerContainer);
