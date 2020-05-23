import React from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { appLink } from "Config/appConfig";
import styles from "./Navigation.module.scss";

function Navigation() {
  const {
    params: { teamId, workflowId },
  } = useRouteMatch();
  return (
    <nav className={styles.links}>
      <NavLink
        className={styles.link}
        activeClassName={styles["--active"]}
        to={appLink.editorDesigner({ teamId, workflowId })}
      >
        Workflow
      </NavLink>
      <NavLink
        className={styles.link}
        activeClassName={styles["--active"]}
        to={appLink.editorProperties({ teamId, workflowId })}
      >
        Properties
      </NavLink>
      <NavLink
        className={styles.link}
        activeClassName={styles["--active"]}
        to={appLink.editorConfigure({ teamId, workflowId })}
      >
        Configure
      </NavLink>
      <NavLink
        className={styles.link}
        activeClassName={styles["--active"]}
        to={appLink.editorChangelog({ teamId, workflowId })}
      >
        Change Log
      </NavLink>
    </nav>
  );
}

export default Navigation;
