import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Navbar from "./Navbar";
//import "./styles.scss";

class Navigation extends Component {
  state = {
    showFirstTimeExperience: false
  };

  handleOnQuestionClick = () => {
    this.setState({
      showFirstTimeExperience: true
    });
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

export default withRouter(Navigation);
