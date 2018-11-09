import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions } from "State/reportBug";
import ReportBugComponent from "@boomerang/boomerang-components/lib/ReportBug";

const ReportBug = props => {
  return <ReportBugComponent {...props} />;
};
ReportBug.propTypes = {
  user: PropTypes.object,
  reportBug: PropTypes.object,
  actions: PropTypes.object
};

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
)(ReportBug);
