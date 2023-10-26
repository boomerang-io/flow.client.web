import React from "react";
import {
  FeatureSideNav as SideNav,
  FeatureSideNavLink as SideNavLink,
  FeatureSideNavLinks as SideNavLinks,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { appLink } from "Config/appConfig";
import styles from "./navPanel.module.scss";

interface NavPanelProps {
  team: string;
  workflowId: string;
}

const NavPanel: React.FC<NavPanelProps> = ({ team, workflowId }) => {
  // List of Nav Items
  const navigationItems = [
    {
      name: "General",
      path: `${appLink.editorConfigureGeneral({
        team: team,
        workflowId: workflowId,
      })}`,
    },
    {
      name: "Triggers",
      path: `${appLink.editorConfigureTriggers({
        team: team,
        workflowId: workflowId,
      })}`,
    },
    {
      name: "Parameters",
      path: `${appLink.editorConfigureParams({
        team: team,
        workflowId: workflowId,
      })}`,
    },
    {
      name: "Run Options",
      path: `${appLink.editorConfigureRun({
        team: team,
        workflowId: workflowId,
      })}`,
    },
    {
      name: "Workspaces",
      path: `${appLink.editorConfigureWorkspaces({
        team: team,
        workflowId: workflowId,
      })}`,
    },
  ];

  return (
    <SideNav className={styles.container} border="right">
      <SideNavLinks>
        {navigationItems.map((item) => {
          return <SideNavLink to={item.path}>{item.name}</SideNavLink>;
        })}
      </SideNavLinks>
    </SideNav>
  );
};

export default NavPanel;
