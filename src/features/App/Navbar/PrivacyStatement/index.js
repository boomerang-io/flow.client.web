import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as consentFormActions } from "State/privacyStatement/consentForm";
import { actions as consentResponseActions } from "State/privacyStatement/consentResponse";
import { actions as userActions } from "State/user";
import PrivacyStatementComponent from "@boomerang/boomerang-components/lib/PrivacyStatement";
import { BASE_SERVICE_ENV_URL } from "Config/servicesConfig";
import { BASE_LAUNCH_ENV_URL, BASE_WWW_ENV_URL } from "Config/platformUrlConfig";

export const PrivacyStatement = props => {
  return (
    <PrivacyStatementComponent
      baseServiceUrl={BASE_SERVICE_ENV_URL}
      baseLaunchEnvUrl={BASE_LAUNCH_ENV_URL}
      baseWWWEnvUrl={BASE_WWW_ENV_URL}
      {...props}
    />
  );
};

PrivacyStatement.propTypes = {
  consentFormActions: PropTypes.object,
  consentResponseActions: PropTypes.object,
  userActions: PropTypes.object,
  consentResponse: PropTypes.object,
  consentForm: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = state => {
  return {
    consentResponse: state.privacyStatement.consentResponse,
    consentForm: state.privacyStatement.consentForm,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    consentFormActions: bindActionCreators(consentFormActions, dispatch),
    consentResponseActions: bindActionCreators(consentResponseActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrivacyStatement);
