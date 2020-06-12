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
      case screens.WORKFLOW:
        return {
          index,
          nextScreen,
          closeModal,
          screens,
          guideConfig,
          ...guideConfig.workflow
        };
      case screens.PROPERTIES:
        return { ...basicConfig, ...guideConfig.properties };
      case screens.CHANGE_LOG:
        return { ...basicConfig, ...guideConfig.change_log };
      case screens.SETTINGS:
        return { ...basicConfig, ...guideConfig.settings };
      case screens.ACTIVITY:
        return { ...basicConfig, ...guideConfig.activity };
      case screens.ACTIVITY_FILTERS:
        return { ...basicConfig, ...guideConfig.activity_filters };
      case screens.ACTIVITY_NUMBERS:
        return { ...basicConfig, ...guideConfig.activity_numbers };
      case screens.SIDE_INFO:
        return { ...basicConfig, ...guideConfig.side_info };
      case screens.DIAGRAM:
        return { ...basicConfig, ...guideConfig.diagram };
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
