import React from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
import NavigateBack from "Components/NavigateBack";
import "./styles.scss";

Navigation.propTypes = {
  match: PropTypes.object.isRequired,
  onlyShowBackLink: PropTypes.bool
};

function Navigation({ match, onlyShowBackLink }) {
  return (
    <>
      <div className="c-navigation-bar">
        <NavigateBack to="/workflows" text={"Back to Workflows"} />
      </div>
      <div className="b-navigation-links">
        {!onlyShowBackLink && (
          <>
            <NavLink className="b-navigation-links__link" activeClassName="--active" to={`${match.url}/overview`}>
              Overview
            </NavLink>
            <NavLink className="b-navigation-links__link" activeClassName="--active" to={`${match.url}/inputs`}>
              Inputs
            </NavLink>
            <NavLink className="b-navigation-links__link" activeClassName="--active" to={`${match.url}/designer`}>
              Design
            </NavLink>
            <NavLink className="b-navigation-links__link" activeClassName="--active" to={`${match.url}/changes`}>
              Change Log
            </NavLink>
          </>
        )}
      </div>
    </>
  );
}

export default withRouter(Navigation);
