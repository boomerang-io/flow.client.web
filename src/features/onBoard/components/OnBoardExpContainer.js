import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions } from "State/user";
import { homeScreens, designerScreens, messageConfig, homeGuideConfig, designerGuideConfig } from "../constants";
import OnBoardGuideContainer from "./OnBoardGuideContainer";
import OnBoardMessage from "./OnBoardMessage";
import "../styles/onBoardExpContainer.scss";

class OnBoardExpContainer extends Component {
  static propTypes = {
    handleGuideFinish: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired,
    userEmail: PropTypes.string,
    userUpdateData: PropTypes.object,
    homeFirstVisit: PropTypes.bool,
    designerFirstVisit: PropTypes.bool,
    showHomeFirstTimeExperience: PropTypes.bool,
    showDesignerFirstTimeExperience: PropTypes.bool,
    page: PropTypes.string
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
    this.props.handleGuideFinish(this.props.page);
    this.setState({ screen: 0 });
  };

  render() {
    const {
      page,
      showHomeFirstTimeExperience,
      showDesignerFirstTimeExperience,
      homeFirstVisit,
      designerFirstVisit
    } = this.props;

    if (
      !(
        ((homeFirstVisit || showHomeFirstTimeExperience) && page === "home") ||
        ((designerFirstVisit || showDesignerFirstTimeExperience) && page === "designer")
      )
    ) {
      return null;
    }

    const index = this.state.screen;
    let screens = {};
    let guideConfig = {};

    if (page === "home") {
      screens = homeScreens;
      guideConfig = homeGuideConfig;
    } else if (page === "designer") {
      screens = designerScreens;
      guideConfig = designerGuideConfig;
    }

    if (index === screens.WELCOME) {
      return (
        <div className="c-onboard-wrapper">
          <OnBoardMessage
            nextScreen={this.nextScreen}
            closeModal={this.closeModal}
            goToScreen={this.goToScreen}
            returnScreen={screens.RETURN}
            {...(page === "home"
              ? messageConfig.welcomeHome
              : page === "designer"
              ? messageConfig.welcomeDesigner
              : null)}
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
  userEmail: state.user.data.email
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnBoardExpContainer);
