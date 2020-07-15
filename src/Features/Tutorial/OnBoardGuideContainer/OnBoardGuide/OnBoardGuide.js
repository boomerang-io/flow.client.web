import React from "react";
import PropTypes from "prop-types";
import { Button } from "@boomerang-io/carbon-addons-boomerang-react";
import { ArrowRight16, ArrowLeft16, Close20 } from "@carbon/icons-react";
import "./styles.scss";

const OnBoardGuide = (props) => {
  const {
    index,
    containerClassName,
    closeModal,
    title,
    message,
    nextScreen,
    previousScreen,
    screens,
    guideConfig,
  } = props;

  const guideCount = Object.keys(guideConfig);
  const circles = guideCount.map((key, i) => (
    <div key={i} className={`b-onboard-screen-circle ${index === i + 1 ? "b-onboard-screen-circle--filled" : ""}`} />
  ));

  const lastScreen =
    index === screens.SIDENAV ||
    index === screens.SETTINGS ||
    index === screens.ACTIVITY_NUMBERS ||
    index === screens.DIAGRAM;

  const leftAction =
    index === 1 ? null : (
      <Button
        hasIconOnly
        className="b-onboard-screen-arrow"
        data-testid="onboardArrowLeft"
        iconDescription="back"
        onClick={previousScreen}
        renderIcon={ArrowLeft16}
        size="small"
        style={{ width: "2rem", height: "1rem", marginRight: "1rem" }}
        tooltipAlignment="center"
        tooltipPosition="bottom"
      />
    );

  const rightAction = lastScreen ? (
    <Button
      kind="primary"
      onClick={nextScreen}
      size="small"
      style={{ width: "1rem" }} //will have to change
    >
      Done
    </Button>
  ) : (
    <Button
      hasIconOnly
      className="b-onboard-screen-arrow"
      iconDescription="forward"
      onClick={nextScreen}
      renderIcon={ArrowRight16}
      size="small"
      style={{ width: "2rem", height: "1rem" }}
      tooltipAlignment="center"
      tooltipPosition="bottom"
    />
  );

  return (
    <section aria-label="Onboard" className={`c-onboard-screen ${containerClassName}`}>
      <button className="b-onboard-screen-exit-button" onClick={closeModal}>
        <Close20 />
      </button>
      <h1 className="b-onboard-screen-title">{title}</h1>
      <p className="b-onboard-screen-content">{message}</p>
      <footer className="b-onboard-screen-bottom">
        <div className="b-onboard-screen-bottom--left">{circles}</div>
        <div className="b-onboard-screen-bottom--right">
          {leftAction}
          {rightAction}
        </div>
      </footer>
    </section>
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
  screens: PropTypes.object,
  guideConfig: PropTypes.object,
};

export default OnBoardGuide;
