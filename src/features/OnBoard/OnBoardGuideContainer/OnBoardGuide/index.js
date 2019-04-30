import React from "react";
import PropTypes from "prop-types";
import CloseIcon from "Assets/icons/CloseIcon";
import "./styles.scss";
import isAccessibleEvent from "@boomerang/boomerang-utilities/lib/isAccessibleEvent";

const OnBoardGuide = props => {
  const {
    index,
    containerClassName,
    closeModal,
    title,
    message,
    nextScreen,
    previousScreen,
    screens,
    guideConfig
  } = props;

  const guideCount = Object.keys(guideConfig);
  const circles = guideCount.map((key, i) => (
    <div key={i} className={`b-onboard-screen-circle ${index === i + 1 ? "b-onboard-screen-circle--filled" : ""}`} />
  ));

  const lastScreen =
    index === screens.SIDENAV ||
    index === screens.CHANGE_LOG ||
    index === screens.OPTIONS ||
    index === screens.SCROLLING ||
    index === screens.DIAGRAM;

  const leftAction =
    index === 1 ? null : (
      <div
        className="b-onboard-screen-arrow"
        onClick={previousScreen}
        onKeyDown={e => isAccessibleEvent(e) && previousScreen}
        role="button"
        tabIndex="0"
      >
        <i className="b-onboard-screen-arrow--left" />
      </div>
    );

  const rightAction = lastScreen ? (
    <div
      className="b-onboard-screen-button"
      onClick={nextScreen}
      onKeyDown={e => isAccessibleEvent(e) && nextScreen}
      role="button"
      tabIndex="0"
    >
      <div className="b-onboard-screen-button__text">DONE</div>
    </div>
  ) : (
    <div
      className="b-onboard-screen-arrow"
      onClick={nextScreen}
      onKeyDown={e => isAccessibleEvent(e) && nextScreen}
      role="button"
      tabIndex="0"
    >
      >
      <i className="b-onboard-screen-arrow--right" />
    </div>
  );

  return (
    <div className={`c-onboard-screen ${containerClassName}`}>
      <div
        className="b-onboard-screen-modal-close"
        onClick={closeModal}
        onKeyDown={e => isAccessibleEvent(e) && closeModal}
        role="button"
        tabIndex="0"
      >
        >
        <CloseIcon className="b-onboard-screen-modal-close__img" />
      </div>
      <div className="b-onboard-screen-title">{title}</div>
      <div className="b-onboard-screen-content">{message}</div>
      <div className="b-onboard-screen-bottom">
        <div className="b-onboard-screen-bottom--left">{circles}</div>
        <div className="b-onboard-screen-bottom--right">
          {leftAction}
          {rightAction}
        </div>
      </div>
    </div>
  );
};

OnBoardGuide.propTypes = {
  containerClassName: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.string,
  index: PropTypes.number,
  nextScreen: PropTypes.func,
  previousScreen: PropTypes.func,
  closeModal: PropTypes.func,
  screens: PropTypes.array,
  guideConfig: PropTypes.object
};

export default OnBoardGuide;
