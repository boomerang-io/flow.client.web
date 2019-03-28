import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as onBoardActions } from "State/onBoard";
import Navbar from "@boomerang/boomerang-components/lib/Navbar";
import Dropdown from "@boomerang/boomerang-components/lib/Dropdown";
import AboutPlatformComponent from "@boomerang/boomerang-components/lib/AboutPlatform";
import SignOut from "@boomerang/boomerang-components/lib/SignOut";
import ContactJoe from "./ContactJoe";
import ReportBug from "./ReportBug";
import PrivacyStatement from "./PrivacyStatement";
import userTypes from "Constants/userTypes";
import { BASE_LAUNCH_ENV_URL } from "Config/platformUrlConfig";
import { BASE_SERVICE_ENV_URL, IMG_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import { PLATFORM_VERSION } from "Config/appConfig";

const dropdownOptions = [
  <PrivacyStatement key={"privacy statement"} initialStep="TERMS_SMALL" />,
  <ContactJoe key={"contact-joe"} baseServiceUrl={BASE_SERVICE_ENV_URL} />,
  <ReportBug key={"report-bug"} baseServiceUrl={BASE_SERVICE_ENV_URL} />,
  <AboutPlatformComponent version={PLATFORM_VERSION} key={"aboutPlatform"} />,
  <SignOut key={"signout"} />
];

class NavbarContainer extends Component {
  static propTypes = {
    user: PropTypes.object,
    navbarLinks: PropTypes.object,
    refresh: PropTypes.func,
    onBoardActions: PropTypes.object,
    handleOnIconClick: PropTypes.func
  };

  render() {
    const { user, navbarLinks, handleOnIconClick, onBoardActions, refresh } = this.props;
    if (user.isFetching || user.isCreating || navbarLinks.isFetching) {
      return <Navbar handleOnIconClick={handleOnIconClick} />;
    }

    if (user.status === REQUEST_STATUSES.SUCCESS && navbarLinks.status === REQUEST_STATUSES.SUCCESS) {
      const links = navbarLinks.data.navigation.map(link => {
        // eslint-disable-next-line
        if (link.url) return { ...link, url: link.url.replace("${BASE_LAUNCH_ENV_URL}", BASE_LAUNCH_ENV_URL) };
        else return link;
      });
      return (
        <Navbar
          navbarLinks={links}
          isAdmin={user.data.type === userTypes.ADMIN}
          user={user.data}
          handleOnIconClick={handleOnIconClick}
          hasOnBoardingExperience
          onboardingExperienceCharacter="?"
          handleOnOnboardingExperienceClick={() => onBoardActions.showOnBoardExp()}
        >
          <Dropdown {...user.data} profileImgUrl={IMG_URL} options={dropdownOptions} />
        </Navbar>
      );
    }

    if (user.status === REQUEST_STATUSES.FAILURE || navbarLinks.status === REQUEST_STATUSES.FAILURE) {
      return (
        <Navbar refresh={refresh} handleOnIconClick={handleOnIconClick}>
          <Dropdown options={dropdownOptions.slice(1, -1)} includeHeader={false} />
        </Navbar>
      );
    }
    return null;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onBoardActions: bindActionCreators(onBoardActions, dispatch)
  };
};

export default connect(
  null,
  mapDispatchToProps
)(NavbarContainer);
