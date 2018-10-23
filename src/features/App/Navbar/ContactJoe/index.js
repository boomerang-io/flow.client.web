import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions } from "State/contactJoe";
import ContactJoeComponent from "@boomerang/boomerang-components/lib/ContactJoe";

const ContactJoe = props => {
  return <ContactJoeComponent {...props} />;
};

ContactJoe.propTypes = {
  actions: PropTypes.object,
  contactJoe: PropTypes.object
};

const mapStateToProps = state => {
  return {
    contactJoe: state.contactJoe
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
)(ContactJoe);
