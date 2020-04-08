import React from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
import styles from "./Navigation.module.scss";

Navigation.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

function Navigation({ location, match }) {
  return (
    <nav className={styles.links}>
      <NavLink exact className={styles.link} activeClassName={styles["--active"]} to={`${match.url}`}>
        Overview
      </NavLink>
      <NavLink className={styles.link} activeClassName={styles["--active"]} to={`${match.url}/settings`}>
        Settings
      </NavLink>
    </nav>
  );
}

export default withRouter(Navigation);
