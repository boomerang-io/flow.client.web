import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as OnBoardActions } from "State/onBoard";

class Navigation extends Component {
  state = {
    showFirstTimeExperience: false
  };

  handleOnQuestionClick = () => {
    this.setState({
      showFirstTimeExperience: true
    });
    this.props.OnBoardActions.showOnBoardExp();
  };

  render() {
    const { navigation, user } = this.props;
    return (
      <>
        <Navbar
          navigation={navigation}
          user={user}
          handleOnTutorialClick={this.handleOnQuestionClick}
          location={this.props.location}
        />
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    onBoard: state.onBoard
  };
};

const mapDispatchToProps = dispatch => {
  return {
    OnBoardActions: bindActionCreators(OnBoardActions, dispatch)
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Navigation)
);
