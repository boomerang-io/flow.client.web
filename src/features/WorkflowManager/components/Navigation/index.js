import React from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
import "./styles.scss";

Navigation.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

function Navigation({ location, match }) {
  return (
    <nav className="b-navigation-links">
      <NavLink className="b-navigation-links__link" activeClassName="--active" to={`${match.url}/designer`}>
        Workflow
      </NavLink>
      <NavLink className="b-navigation-links__link" activeClassName="--active" to={`${match.url}/properties`}>
        Properties
      </NavLink>
      <NavLink className="b-navigation-links__link" activeClassName="--active" to={`${match.url}/changes`}>
        Change Log
      </NavLink>
      <NavLink className="b-navigation-links__link" activeClassName="--active" to={`${match.url}/overview`}>
        Settings
      </NavLink>
    </nav>
  );
}

export default withRouter(Navigation);
