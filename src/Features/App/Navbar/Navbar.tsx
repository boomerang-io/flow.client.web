//@ts-nocheck
import React from "react";
import { Helmet } from "react-helmet";
import { NavLink } from "react-router-dom";
import { SideNav } from "carbon-components-react";
import {
  LeftSideNav,
  SideNavLink,
  SideNavItems,
  SideNavMenu,
  SideNavMenuItem,
  UIShell,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { APP_ROOT } from "Config/appConfig";
import { FlowUser } from "Types";
import { navigationIcons } from "Utils/navigationIcons";
import { FlowData16 } from "@carbon/icons-react";

const ACTIVE_CLASS_NAME = "bx--side-nav__link--current";
const BOOMERANG_FALLBACK = "Boomerang";

function isInternalLink(navUrl: string) {
  return navUrl.includes(APP_ROOT);
}

function getRelativePath(navUrl: string) {
  return navUrl.substring(navUrl.indexOf(APP_ROOT) + APP_ROOT.length);
}

const handleOnMenuClick = (flowNavigationData: any) => ({
  isOpen,
  onMenuClose,
}: {
  isOpen: boolean;
  onMenuClose(): void;
}) => (
  <LeftSideNav isOpen={isOpen}>
    <SideNav aria-label="nav" expanded={isOpen} isChildOfHeader={true}>
      <SideNavItems>
        {flowNavigationData.map((item) => {
          const itemIcon = navigationIcons.find((icon) => icon.name === item.icon) ?? FlowData16;
          if (item?.childLinks) {
            return (
              <SideNavMenu large title={item.name} renderIcon={itemIcon.Icon}>
                {item.childLinks.map((childItem: any) => {
                  let props = {
                    large: true,
                    renderIcon: itemIcon.Icon,
                  };
                  if (isInternalLink(childItem.link)) {
                    props.to = getRelativePath(childItem.link);
                    props.activeClassName = ACTIVE_CLASS_NAME;
                    props.element = NavLink;
                    props.onClick = onMenuClose;
                  } else props.href = childItem.link;
                  return <SideNavMenuItem {...props}>{childItem.name}</SideNavMenuItem>;
                })}
              </SideNavMenu>
            );
          } else {
            let props = {
              large: true,
              renderIcon: itemIcon.Icon,
            };
            if (isInternalLink(item.link)) {
              props.to = getRelativePath(item.link);
              props.activeClassName = ACTIVE_CLASS_NAME;
              props.element = NavLink;
              props.onClick = onMenuClose;
            } else props.href = item.link;
            return <SideNavLink {...props}>{item.name}</SideNavLink>;
          }
        })}
      </SideNavItems>
    </SideNav>
  </LeftSideNav>
);

const skipToContentProps = {
  href: "#content",
};

interface NavbarContainerProps {
  handleOnTutorialClick(): void;
  platformNavigationData: { platform: { platformName: string } };
  userData: FlowUser;
  flowNavigationData: any;
}

export default function NavbarContainer({
  handleOnTutorialClick,
  platformNavigationData,
  userData,
  flowNavigationData,
}: NavbarContainerProps) {
  const defaultUIShellProps = {
    renderLogo: true,
  };
  const platformName = platformNavigationData.platform?.platformName;
  const isBoomerangInPlatformName = platformName?.includes(BOOMERANG_FALLBACK);
  const appTitle =
    !isBoomerangInPlatformName && platformName
      ? `${BOOMERANG_FALLBACK} Flow - ${platformName}`
      : `${BOOMERANG_FALLBACK} Flow`;

  return (
    <>
      <Helmet defaultTitle={appTitle} titleTemplate={`%s - ${appTitle}`} />
      <UIShell
        {...defaultUIShellProps}
        onMenuClick={handleOnMenuClick(flowNavigationData)}
        headerConfig={platformNavigationData}
        onTutorialClick={handleOnTutorialClick}
        user={userData}
        skipToContentProps={skipToContentProps}
      />
    </>
  );
}
