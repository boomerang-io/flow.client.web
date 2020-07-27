import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { appLink } from "Config/appConfig";
import styles from "./Navigation.module.scss";

export default function Navigation({ teamId }: { teamId: string }) {
  const location = useLocation();

  return (
    <nav className={styles.links}>
      <NavLink
        exact
        className={styles.link}
        activeClassName={styles["--active"]}
        to={{ pathname: appLink.team({ teamId }), state: location.state }}
      >
        Members
      </NavLink>
      <NavLink
        exact
        className={styles.link}
        activeClassName={styles["--active"]}
        to={{ pathname: appLink.teamWorkflows({ teamId }), state: location.state }}
      >
        Workflows
      </NavLink>
    </nav>
  );
}
