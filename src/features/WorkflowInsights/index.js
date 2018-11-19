import React, { Component } from "react";
import PropTypes from "prop-types";
// import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as insightsActions } from "State/insights";
import { actions as teamsActions } from "State/teams";
// import sortBy from "lodash/sortBy";
import LoadingAnimation from "@boomerang/boomerang-components/lib/LoadingAnimation";
import SelectDropdown from "@boomerang/boomerang-components/lib/SelectDropdown";
// import NoDisplay from "@boomerang/boomerang-components/lib/NoDisplay";
import NavigateBack from "Components/NavigateBack";
// import { notify, Notification } from "@boomerang/boomerang-components/lib/Notifications";
import ErrorDragon from "Components/ErrorDragon";
// import SearchFilterBar from "Components/SearchFilterBar";
// import WorkflowsSection from "./WorkflowsSection";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import "./styles.scss";

class WorkflowsInsights extends Component {
  static propTypes = {
    // insights: PropTypes.object.isRequired,
    // insightsActions: PropTypes.object.isRequired,
    // teams: PropTypes.object.isRequired,
    // teamsActions: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.insightsActions.fetch(`${BASE_SERVICE_URL}/insights`);
    this.props.teamsActions.fetch(`${BASE_SERVICE_URL}/teams`);
  }

  render() {
    const { insights, teams } = this.props;

    if (insights.status === REQUEST_STATUSES.FAILURE || teams.status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon theme="bmrg-white" />;
    }

    if (insights.isFetching || teams.isFetching) {
      return (
        <div className="c-workflow-insights">
          <div className="c-workflow-insights-content">
            <LoadingAnimation theme="bmrg-white" />
          </div>
        </div>
      );
    }

    if (insights.status === REQUEST_STATUSES.SUCCESS && teams.status === REQUEST_STATUSES.SUCCESS ) {
      // const filteredTeams = this.filterTeams();
      // const sortedTeams = sortBy(filteredTeams, ["name"]);
      const teamsList = teams.data.map(team=>({label: team.name, value: team.id}));
      console.log(teamsList, "TEAMS");

      // if (!sortedTeams.length) {
      //   return (
      //     <div className="c-workflow-insights">
      //       <div className="c-workflow-insights-content">
      //         <NoDisplay style={{ marginTop: "5rem" }} text="Looks like you don't have any insights" />
      //       </div>
      //     </div>
      //   );
      // }
      return (
        <div className="c-workflow-insights">
          <nav className="s-workflow-activity-navigation">
            <NavigateBack to="/workflows" text="Back to Workflows" />
          </nav>
          <div className="c-workflow-insights__header">
            <SelectDropdown options={teamsList} theme="bmrg-white" />
            <SelectDropdown options={[]} theme="bmrg-white" />
          </div>
          <div className="c-workflow-insights-content">

            yay
          </div>
        </div>
      );
    }

    return null;
  }
}

const mapStateToProps = state => ({
  insights: state.insights,
  teams: state.teams
});

const mapDispatchToProps = dispatch => ({
  insightsActions: bindActionCreators(insightsActions, dispatch),
  teamsActions: bindActionCreators(teamsActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowsInsights);
