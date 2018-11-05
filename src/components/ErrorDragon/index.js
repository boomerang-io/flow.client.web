import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions } from "State/reportBug/";
import ErrorDragonComponent from "@boomerang/boomerang-components/lib/ErrorDragon";
import { BASE_LAUNCH_ENV_URL } from "Config/platformUrlConfig";

class ErrorDragon extends Component {
  static propTypes = {
    actions: PropTypes.object,
    user: PropTypes.object,
    reportBug: PropTypes.object
  };

  render() {
    return (
      <ErrorDragonComponent
        reportBugProps={{
          actions: this.props.actions,
          user: this.props.user,
          reportBug: this.props.reportBug
        }}
        statusUrl={`${BASE_LAUNCH_ENV_URL}/status`}
        {...this.props}
        theme="bmrg-white"
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    reportBug: state.reportBug
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorDragon);
