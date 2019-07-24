import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as teamsActions } from "State/teams";
import { actions as appActions } from "State/app";
import sortBy from "lodash/sortBy";
import LoadingAnimation from "@boomerang/boomerang-components/lib/LoadingAnimation";
import NoDisplay from "@boomerang/boomerang-components/lib/NoDisplay";
import { notify, Notification } from "@boomerang/boomerang-components/lib/Notifications";
import ErrorDragon from "Components/ErrorDragon";
import SearchFilterBar from "Components/SearchFilterBar";
import WorkflowsSection from "./WorkflowsSection";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import "./styles.scss";

export class WorkflowsHome extends Component {
  static propTypes = {
    appActions: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    teamsState: PropTypes.object.isRequired,
    teamsActions: PropTypes.object.isRequired
  };

  state = {
    searchQuery: "",
    teamsFilter: []
  };

  componentDidMount() {
    this.fetchTeams();
    this.props.appActions.setActiveTeam({ teamId: undefined });
  }

  handleSearchFilter = (searchQuery, teams) => {
    this.setState({ searchQuery, teamsFilter: Array.isArray(teams) && teams.length ? teams : [] });
  };

  fetchTeams = () => {
    this.props.teamsActions.fetch(`${BASE_SERVICE_URL}/teams`).catch(err => {
      // noop
    });
  };

  filterTeams = () => {
    const { teamsState } = this.props;
    const { teamsFilter } = this.state;

    if (teamsFilter.length > 0) {
      return teamsState.data.filter(team => teamsFilter.find(filter => filter.text === team.name));
    } else {
      return teamsState.data;
    }
  };

  updateWorkflows = data => {
    this.props.teamsActions.updateWorkflows(data);
  };

  setActiveTeamAndRedirect = selectedTeamId => {
    this.props.appActions.setActiveTeam({ teamId: selectedTeamId });
    this.props.history.push(`/creator/overview`);
  };

  setActiveTeam = selectedTeamId => {
    this.props.appActions.setActiveTeam({ teamId: selectedTeamId });
  };

  handleExecuteWorkflow = ({ workflowId, redirect = false, properties = {} }) => {
    return axios
      .post(`${BASE_SERVICE_URL}/execute/${workflowId}`, { properties })
      .then(response => {
        notify(<Notification type="success" title="Run Workflow" message="Successfully ran workflow" />);
        if (redirect) {
          this.props.history.push({
            pathname: `/activity/${workflowId}/execution/${response.data.id}`,
            state: { fromUrl: "/workflows", fromText: "Workflows" }
          });
        }
      })
      .catch(error => {
        notify(<Notification type="error" title="Something's wrong" message="Failed to run workflow" />);
      });
  };

  handleDeleteWorkflow = ({ workflowId, teamId }) => {
    axios
      .delete(`${BASE_SERVICE_URL}/workflow/${workflowId}`)
      .then(() => {
        this.updateWorkflows({ workflowId, teamId });
        notify(<Notification type="remove" title="Delete Workflow" message="Workflow successfully deleted" />);
        return;
      })
      .catch(e => {
        console.log(e);
        notify(<Notification type="error" title="SOMETHING'S WRONG" message="Your delete request has failed" />);
        return;
      });
  };

  render() {
    const { teamsState } = this.props;
    const { searchQuery } = this.state;

    if (teamsState.status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon theme="bmrg-flow" />;
    }

    if (teamsState.isFetching) {
      return (
        <div className="c-workflow-home">
          <div className="c-workflow-home-content">
            <LoadingAnimation theme="bmrg-flow" />
          </div>
        </div>
      );
    }

    if (teamsState.status === REQUEST_STATUSES.SUCCESS && Object.keys(teamsState.data).length === 0) {
      /**
       * security check, we don't want to show anything to a user who does not belong to any teams
       *
       * This only protects against users who are new to the platform
       * TODO: prevent a user from accesing a flow associated to a different team
       */
      return null;
    }

    if (teamsState.status === REQUEST_STATUSES.SUCCESS) {
      const filteredTeams = this.filterTeams();
      const sortedTeams = sortBy(filteredTeams, ["name"]);

      if (!sortedTeams.length) {
        return (
          <div className="c-workflow-home">
            <div className="c-workflow-home-content">
              <SearchFilterBar handleSearchFilter={this.handleSearchFilter} label="Teams" options={[]} />
              <NoDisplay style={{ marginTop: "5rem" }} text="Looks like you don't have any workflow teams" />
            </div>
          </div>
        );
      }
      return (
        <div className="c-workflow-home">
          <div className="c-workflow-home-content">
            <SearchFilterBar handleSearchFilter={this.handleSearchFilter} label="Teams" options={teamsState.data} />
            {sortedTeams.map(team => {
              return (
                <WorkflowsSection
                  key={team.id}
                  deleteWorkflow={this.handleDeleteWorkflow}
                  executeWorkflow={this.handleExecuteWorkflow}
                  fetchTeams={this.fetchTeams}
                  setActiveTeam={this.setActiveTeam}
                  setActiveTeamAndRedirect={this.setActiveTeamAndRedirect}
                  searchQuery={searchQuery}
                  team={team}
                  updateWorkflows={this.updateWorkflows}
                />
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  }
}

const mapStateToProps = state => ({
  teamsState: state.teams
});

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(appActions, dispatch),
  teamsActions: bindActionCreators(teamsActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowsHome);
