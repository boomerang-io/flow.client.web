import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions } from "State/onBoard";
import { withRouter } from "react-router-dom";
import {
  homeScreens,
  designerScreens,
  activityScreens,
  executionScreens,
  messageConfig,
  homeGuideConfig,
  designerGuideConfig,
  activityGuideConfig,
  executionGuideConfig
} from "./constants";
import OnBoardGuideContainer from "./OnBoardGuideContainer";
import OnBoardMessage from "./OnBoardMessage";
import "./styles.scss";

class OnBoardExpContainer extends Component {
  static propTypes = {
    location: PropTypes.object,
    onBoard: PropTypes.object,
    actions: PropTypes.object
  };

  state = {
    screen: 0
  };

  nextScreen = () => {
    this.setState(prevState => ({
      screen: prevState.screen + 1
    }));
  };

  previousScreen = () => {
    this.setState(prevState => ({
      screen: prevState.screen - 1
    }));
  };

  goToScreen = screen => {
    this.setState(() => ({ screen }));
  };

  closeModal = () => {
    this.setState({ screen: 0 });
    this.props.actions.hideOnBoardExp();
  };

  render() {
    const { onBoard } = this.props;

    if (!onBoard.show) {
      return null;
    }

    const index = this.state.screen;
    const path = this.props.location.pathname;
    let screens = {};
    let guideConfig = {};
    let message = {};

    if (path.includes("/workflows")) {
      screens = homeScreens;
      guideConfig = homeGuideConfig;
      message = messageConfig.welcomeHome;
    } else if (path.includes("/editor")) {
      screens = designerScreens;
      guideConfig = designerGuideConfig;
      message = messageConfig.welcomeDesigner;
    } else if (path.includes("/activity") && !path.includes("/execution")) {
      screens = activityScreens;
      guideConfig = activityGuideConfig;
      message = messageConfig.welcomeActivity;
    } else if (path.includes("/execution")) {
      screens = executionScreens;
      guideConfig = executionGuideConfig;
      message = messageConfig.welcomeExecution;
    } else {
      this.closeModal();
      return null;
    }

    if (index === screens.WELCOME) {
      return (
        <div className="c-onboard-wrapper">
          <OnBoardMessage
            nextScreen={this.nextScreen}
            closeModal={this.closeModal}
            goToScreen={this.goToScreen}
            returnScreen={screens.RETURN}
            {...message}
          />
        </div>
      );
    }

    if (index === screens.DONE) {
      return (
        <div className="c-onboard-wrapper">
          <OnBoardMessage nextScreen={this.nextScreen} closeModal={this.closeModal} {...messageConfig.done} />
        </div>
      );
    }

    if (index === screens.RETURN) {
      return (
        <div className="c-onboard-wrapper">
          <OnBoardMessage closeModal={this.closeModal} {...messageConfig.return} />
        </div>
      );
    }

    return (
      <div className="c-onboard-wrapper c-onboard-wrapper--transparent">
        <OnBoardGuideContainer
          index={index}
          nextScreen={this.nextScreen}
          previousScreen={this.previousScreen}
          closeModal={this.closeModal}
          screens={screens}
          guideConfig={guideConfig}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userEmail: state.user.data.email,
  onBoard: state.onBoard
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OnBoardExpContainer)
);
