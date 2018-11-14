import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as teamsActions } from "State/teams";
import sortBy from "lodash/sortBy";
import LoadingAnimation from "@boomerang/boomerang-components/lib/LoadingAnimation";
import NoDisplay from "@boomerang/boomerang-components/lib/NoDisplay";
import { notify, Notification } from "@boomerang/boomerang-components/lib/Notifications";
import ErrorDragon from "Components/ErrorDragon";
import SearchFilterBar from "Components/SearchFilterBar";
import WorkflowsSection from "./WorkflowsSection";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import "./styles.scss";

class WorkflowsHome extends Component {
  static propTypes = {
    teams: PropTypes.object.isRequired,
    teamsActions: PropTypes.object.isRequired
  };

  state = {
    searchQuery: "",
    teamsFilter: []
  };

  componentDidMount() {
    this.props.teamsActions.fetch(`${BASE_SERVICE_URL}/teams`);
  }

  handleSearchFilter = (searchQuery, teams) => {
    this.setState({ searchQuery, teamsFilter: Array.isArray(teams) && teams.length ? teams : [] });
  };

  filterTeams = () => {
    const { teams } = this.props;
    const { teamsFilter } = this.state;

    if (teamsFilter.length > 0) {
      return teams.data.filter(team => teamsFilter.find(filter => filter.text === team.name));
    } else {
      return teams.data;
    }
  };

  updateWorkflows = data => {
    this.props.teamsActions.updateWorkflows(data);
  };

  setActiveTeamAndRedirect = selectedTeamId => {
    this.props.teamsActions.setActiveTeam({ teamId: selectedTeamId });
    this.props.history.push(`/creator/overview`);
  };

  handleExecute = ({ workflowId, redirect }) => {
    return axios
      .post(`${BASE_SERVICE_URL}/execute/${workflowId}`)
      .then(response => {
        notify(<Notification type="success" title="Run Workflow" message="Succssfully ran workflow" />);
        console.log(response);
        if (redirect) this.props.history.push(`/activity/${workflowId}/execution/${response.data.id}`);
      })
      .catch(error => {
        notify(<Notification type="error" title="Something's wrong" message="Failed to run workflow" />);
      });
  };

  handleOnDelete = ({ workflowId, teamId }) => {
    axios
      .delete(`${BASE_SERVICE_URL}/workflow/${workflowId}`)
      .then(() => {
        notify(<Notification type="remove" title="SUCCESS" message="Workflow successfully deleted" />);
        this.updateWorkflows({ workflowId, teamId });
        return;
      })
      .catch(() => {
        notify(<Notification type="error" title="SOMETHING'S WRONG" message="Your delete request has failed" />);
        return;
      });
  };

  render() {
    const { teams } = this.props;
    const { searchQuery } = this.state;

    if (teams.status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon theme="bmrg-white" />;
    }

    if (teams.isFetching) {
      return (
        <div className="c-workflow-home">
          <div className="c-workflow-home-content">
            <LoadingAnimation theme="bmrg-white" />
          </div>
        </div>
      );
    }

    if (teams.status === REQUEST_STATUSES.SUCCESS) {
      const filteredTeams = this.filterTeams();
      const sortedTeams = sortBy(filteredTeams, ["name"]);

      if (!sortedTeams.length) {
        return (
          <div className="c-workflow-home">
            <div className="c-workflow-home-content">
              <SearchFilterBar handleSearchFilter={this.handleSearchFilter} options={[]} />
              <NoDisplay style={{ marginTop: "5rem" }} text="Looks like you don't have any workflow teams" />
            </div>
          </div>
        );
      }
      return (
        <div className="c-workflow-home">
          <div className="c-workflow-home-content">
            <SearchFilterBar handleSearchFilter={this.handleSearchFilter} options={teams.data} />
            {sortedTeams.map(team => {
              return (
                <WorkflowsSection
                  team={team}
                  searchQuery={searchQuery}
                  updateWorkflows={this.updateWorkflows}
                  setActiveTeamAndRedirect={this.setActiveTeamAndRedirect}
                  key={team.id}
                  executeWorkflow={this.handleExecute}
                  deleteWorkflow={this.handleOnDelete}
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
  teams: state.teams
});

const mapDispatchToProps = dispatch => ({
  teamsActions: bindActionCreators(teamsActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowsHome);
