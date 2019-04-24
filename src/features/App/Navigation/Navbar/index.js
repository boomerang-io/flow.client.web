import React, { Component } from "react";
import PropTypes from "prop-types";
import { UIShell } from "@boomerang/carbon-addons-boomerang-react";
import SERVICE_REQUEST_STATUSES from "Constants/serviceRequestStatuses";
import { BASE_LAUNCH_ENV_URL } from "Config/platformUrlConfig";
import { BASE_URL } from "Config/servicesConfig";

const defaultUIShellProps = {
  baseServiceUrl: BASE_URL,
  //companyName: "Boomerang",
  //productName: "Admin"
  renderLogo: true
};

class NavbarContainer extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    handleOnTutorialClick: PropTypes.func.isRequired,
    user: PropTypes.object
  };

  render() {
    const { handleOnTutorialClick, navigation, user } = this.props;

    if (navigation.status === SERVICE_REQUEST_STATUSES.SUCCESS && user.status === SERVICE_REQUEST_STATUSES.SUCCESS) {
      const navbarLinks = navigation.data.navigation.map(link => {
        // eslint-disable-next-line
        if (link.url) return { ...link, url: link.url.replace("${BASE_LAUNCH_ENV_URL}", BASE_LAUNCH_ENV_URL) };
        else return link;
      });
      const headerConfig = { ...navigation.data, navigation: navbarLinks };
      return (
        <UIShell
          {...defaultUIShellProps}
          headerConfig={headerConfig}
          onTutorialClick={handleOnTutorialClick}
          user={user.data}
        />
      );
    }

    return <UIShell {...defaultUIShellProps} />;
  }
}

export default NavbarContainer;
