import React from "react";
import { Helmet } from "react-helmet";
import { NavLink } from "react-router-dom";
import { SideNav, SideNavLink, SideNavItems, SideNavMenu, SideNavMenuItem } from "@carbon/react";
import { UIShell, HeaderMenuItem } from "@boomerang-io/carbon-addons-boomerang-react";
import { APP_ROOT } from "Config/appConfig";
import { FlowNavigationItem, FlowNavigationItemChild, FlowUser, PlatformConfig } from "Types";
import { navigationIcons } from "Utils/navigationIcons";
import { FlowData } from "@carbon/react/icons";

const ACTIVE_CLASS_NAME = "cds--side-nav__link--current";

function isInternalLink(navUrl: string) {
  return navUrl.includes(APP_ROOT);
}

function getRelativePath(navUrl: string) {
  return navUrl.substring(navUrl.indexOf(APP_ROOT) + APP_ROOT.length);
}

const handleOnMenuClick =
  (flowNavigationData: FlowNavigationItem[]) =>
  ({ isOpen, close }) =>
    (
      <SideNav aria-label="nav" expanded={isOpen} isChildOfHeader={true} isPersistent={false}>
        <SideNavItems>
          {flowNavigationData.map((item) => {
            const itemIcon = navigationIcons.find((icon) => icon.name === item.icon) ?? FlowData;
            if (item?.childLinks) {
              return (
                <SideNavMenu large key={item.name} title={item.name} renderIcon={itemIcon.Icon}>
                  {item.childLinks.map((childItem) => {
                    let props: Omit<FlowNavigationItemChild, "link" | "name" | "renderIcon" | "large"> = {};
                    if (isInternalLink(childItem.link)) {
                      props.to = getRelativePath(childItem.link);
                      props.activeClassName = ACTIVE_CLASS_NAME;
                      props.element = NavLink;
                      props.onClick = close;
                    } else {
                      props.href = childItem.link;
                    }
                    return (
                      <SideNavMenuItem key={childItem.name} {...props}>
                        {childItem.name}
                      </SideNavMenuItem>
                    );
                  })}
                </SideNavMenu>
              );
            } else {
              let props: Omit<FlowNavigationItemChild, "link" | "name"> = {
                large: true,
                renderIcon: itemIcon.Icon,
              };
              if (isInternalLink(item.link)) {
                props.to = getRelativePath(item.link);
                props.activeClassName = ACTIVE_CLASS_NAME;
                props.element = NavLink;
                props.onClick = close;
              } else props.href = item.link;
              return (
                <SideNavLink key={item.name} {...props}>
                  {item.name}
                </SideNavLink>
              );
            }
          })}
        </SideNavItems>
      </SideNav>
    );

const skipToContentProps = {
  href: "#content",
};

interface NavbarProps {
  handleOnTutorialClick: () => void;
  flowNavigationData: Array<FlowNavigationItem>;
  platformConfigData: PlatformConfig;
  userData: FlowUser;
}

export default function Navbar({
  handleOnTutorialClick,
  flowNavigationData,
  platformConfigData,
  userData,
}: NavbarProps) {
  const defaultUIShellProps = {
    baseServiceUrl: "",
  };

  const { platform } = platformConfigData;
  const appTitle = getAppTitle(platform);
  const appName = platform.appName;
  const platformName = platform.platformName;

  return (
    <>
      <Helmet defaultTitle={appTitle} titleTemplate={`%s - ${appTitle}`} />
      <UIShell
        {...defaultUIShellProps}
        productName={appName}
        config={platformConfigData}
        leftPanel={handleOnMenuClick(flowNavigationData)}
        platformName={platformName}
        skipToContentProps={skipToContentProps}
        user={userData as FlowUser}
        supportMenuItems={[
          <HeaderMenuItem type="button" onClick={handleOnTutorialClick} text="Tutorial" />,
          <HeaderMenuItem type="link" kind="external" href="https://www.useboomerang.io/flow" text="Docs" />,
        ]}
      />
    </>
  );
}

function getAppTitle(platformData: PlatformConfig["platform"]) {
  let appTitle = platformData.platformName;

  if (platformData.appName) {
    appTitle = `${platformData.appName} - ${platformData.platformName}`;
  }

  return appTitle;
}
