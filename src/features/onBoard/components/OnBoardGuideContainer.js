import React from "react";
import PropTypes from "prop-types";
import OnBoardGuide from "./OnBoardGuide";

const OnBoardGuideContainer = ({ index, nextScreen, previousScreen, closeModal, screens, guideConfig }) => {
  const basicConfig = { index, nextScreen, previousScreen, closeModal, screens, guideConfig };

  const determineProps = () => {
    switch (index) {
      case screens.TEAMS:
        return {
          index,
          nextScreen,
          closeModal,
          screens,
          guideConfig,
          ...guideConfig.teams
        };
      case screens.SEARCH_FILTER:
        return { ...basicConfig, ...guideConfig.search_filter };
      case screens.SIDENAV:
        return { ...basicConfig, ...guideConfig.sidenav };
      case screens.OVERVIEW:
        return {
          index,
          nextScreen,
          closeModal,
          screens,
          guideConfig,
          ...guideConfig.overview
        };
      case screens.INPUTS:
        return { ...basicConfig, ...guideConfig.inputs };
      case screens.DESIGN:
        return { ...basicConfig, ...guideConfig.design };
      case screens.CHANGE_LOG:
        return { ...basicConfig, ...guideConfig.change_log };
      default:
        return null;
    }
  };

  const props = determineProps();
  return <OnBoardGuide {...props} />;
};

OnBoardGuideContainer.propTypes = {
  index: PropTypes.number,
  nextScreen: PropTypes.func,
  previousScreen: PropTypes.func,
  closeModal: PropTypes.func,
  screens: PropTypes.object,
  guideConfig: PropTypes.object
};

export default OnBoardGuideContainer;
