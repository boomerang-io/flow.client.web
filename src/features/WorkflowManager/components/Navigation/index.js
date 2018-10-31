import React from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
import NavigateBack from "Components/NavigateBack";
import "./styles.scss";

function Navigation(props) {
  return (
    <>
      <div className="c-navigation-bar">
        <NavigateBack to="/workflows" text={"Back to Workflows"} />
      </div>
      <div className="b-navigation-links">
        <NavLink className="b-navigation-links__link" activeClassName="--active" to={`${props.match.url}/overview`}>
          Overview
        </NavLink>
        <NavLink className="b-navigation-links__link" activeClassName="--active" to={`${props.match.url}/designer`}>
          Design
        </NavLink>
        <NavLink className="b-navigation-links__link" activeClassName="--active" to={`${props.match.url}/changes`}>
          Change Log
        </NavLink>
      </div>
    </>
  );
}

export default withRouter(Navigation);
