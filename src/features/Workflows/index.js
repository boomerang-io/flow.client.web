import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import cx from "classnames";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as teamsActions } from "State/teams";
import { actions as appActions } from "State/app";
import { actions as OnBoardActions } from "State/onBoard";
import sortBy from "lodash/sortBy";
import { SkeletonText, SkeletonPlaceholder } from "carbon-components-react";
import { notify, ToastNotification, Error404 } from "@boomerang/carbon-addons-boomerang-react";
import WelcomeBanner from "Components/WelcomeBanner";
import DelayedRender from "Components/DelayedRender";
import ErrorDragon from "Components/ErrorDragon";
import WorkflowsHeader from "./WorkflowsHeader";
import WorkflowsSection from "./WorkflowsSection";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import styles from "./workflowHome.module.scss";

export class WorkflowsHome extends Component {
  static propTypes = {
    appActions: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    teamsState: PropTypes.object.isRequired,
    teamsActions: PropTypes.object.isRequired
  };

  state = {
    isWelcomeBannerOpen: true,
    isWelcomeBannerShown: window.localStorage.getItem("bmrg-flow-hideWelcomeBanner") !== "true",
    searchQuery: "",
    teamsFilter: []
  };

  componentDidMount() {
    this.props.appActions.setActiveTeam({ teamId: undefined });
    this.fetchTeams();
  }

  componentDidUpdate(prevProps, prevState) {
    // If the state has changed and the it is now open, close the welcome banner
    if (prevProps.onBoard.show !== this.props.onBoard.show && this.props.onBoard.show) {
      this.setState({ isWelcomeBannerOpen: false });
    }
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
        notify(<ToastNotification kind="success" title="Run Workflow" subtitle="Successfully ran workflow" />);
        if (redirect) {
          this.props.history.push({
            pathname: `/activity/${workflowId}/execution/${response.data.id}`,
            state: { fromUrl: "/workflows", fromText: "Workflows" }
          });
        }
      })
      .catch(error => {
        notify(<ToastNotification kind="error" title="Something's wrong" subtitle="Failed to run workflow" />);
      });
  };

  handleDeleteWorkflow = ({ workflowId, teamId }) => {
    axios
      .delete(`${BASE_SERVICE_URL}/workflow/${workflowId}`)
      .then(() => {
        this.updateWorkflows({ workflowId, teamId });
        notify(<ToastNotification kind="success" title="Delete Workflow" subtitle="Workflow successfully deleted" />);
        return;
      })
      .catch(e => {
        console.log(e);
        notify(<ToastNotification kind="error" title="SOMETHING'S WRONG" subtitle="Your delete request has failed" />);
        return;
      });
  };

  handleOpenTutorial = () => {
    this.props.OnBoardActions.showOnBoardExp();
  };

  handleToggleIsWelcomeBannerOpen = () => {
    this.setState(prevState => ({ isWelcomeBannerOpen: !prevState.isWelcomeBannerOpen }));
  };

  handleHideWelcomeBanner = () => {
    this.setState({ isWelcomeBannerShown: false, isWelcomeBannerOpen: false }, () =>
      window.localStorage.setItem("bmrg-flow-hideWelcomeBanner", true)
    );
  };

  render() {
    const { onBoard, teamsState } = this.props;
    const { isWelcomeBannerOpen, isWelcomeBannerShown, searchQuery } = this.state;

    if (teamsState.status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon />;
    }

    if (teamsState.isFetching) {
      return (
        <DelayedRender>
          <div className={styles.container}>
            <WorkflowsHeader isLoading handleSearchFilter={this.handleSearchFilter} workflowsLength={0} options={[]} />
            <section aria-label="Loadin Workflows" className={styles.content}>
              <div className={styles.loadingContainer}>
                <SkeletonText heading width="10rem" />
                <div className={styles.cardPlaceholderContainer}>
                  <SkeletonPlaceholder className={styles.cardPlaceholder} />
                  <SkeletonPlaceholder className={styles.cardPlaceholder} />
                </div>
              </div>
              <div className={styles.loadingContainer}>
                <SkeletonText heading width="10rem" />
                <SkeletonPlaceholder className={styles.cardPlaceholder} />
              </div>
            </section>
          </div>
        </DelayedRender>
      );
    }

    if (teamsState.status === REQUEST_STATUSES.SUCCESS) {
      const filteredTeams = this.filterTeams();
      const sortedTeams = sortBy(filteredTeams, ["name"]);
      const workflowsLength = teamsState.data.reduce((acc, team) => team.workflows.length + acc, 0);

      return (
        <>
          {isWelcomeBannerShown && (
            <WelcomeBanner
              hide={this.handleHideWelcomeBanner}
              isOpen={isWelcomeBannerOpen}
              openTutorial={this.handleOpenTutorial}
              toggleIsOpen={this.handleToggleIsWelcomeBannerOpen}
            />
          )}
          <div
            className={cx(styles.container, {
              [styles.bannerClosed]: !isWelcomeBannerOpen || onBoard.show,
              [styles.bannerHidden]: !isWelcomeBannerShown
            })}
          >
            <WorkflowsHeader
              handleSearchFilter={this.handleSearchFilter}
              workflowsLength={workflowsLength}
              options={teamsState.data}
            />
            <section aria-label="Workflows Content" className={styles.content}>
              {sortedTeams.length > 0 ? (
                sortedTeams.map(team => {
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
                })
              ) : (
                <Error404
                  message={"You need to be a member of a team to use Flow"}
                  title="No teams found"
                  header={null}
                />
              )}
            </section>
          </div>
        </>
      );
    }

    return null;
  }
}

const mapStateToProps = state => ({
  onBoard: state.onBoard,
  teamsState: state.teams
});

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(appActions, dispatch),
  OnBoardActions: bindActionCreators(OnBoardActions, dispatch),
  teamsActions: bindActionCreators(teamsActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkflowsHome);
