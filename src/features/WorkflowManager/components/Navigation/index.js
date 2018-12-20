import React from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
import NavigateBack from "Components/NavigateBack";
import "./styles.scss";

Navigation.propTypes = {
  match: PropTypes.object.isRequired,
  onlyShowOverviewLink: PropTypes.bool
};

Navigation.defaultProps = {
  onlyShowOverviewLink: false
};

function Navigation({ match, onlyShowOverviewLink }) {
  return (
    <>
      <div className="c-navigation-bar">
        <NavigateBack to="/workflows" text={"Back to Workflows"} />
      </div>
      <div className="b-navigation-links">
        <NavLink className="b-navigation-links__link" activeClassName="--active" to={`${match.url}/overview`}>
          Overview
        </NavLink>
        {!onlyShowOverviewLink && (
          <>
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
