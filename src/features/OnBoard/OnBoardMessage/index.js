import React from "react";
import PropTypes from "prop-types";
import { Button } from "carbon-components-react";
import { Close20 } from "@carbon/icons-react";
import bkgskyline from "Assets/svg/bkg-skyline.svg";
import FadeAnimation from "Components/FadeAnimation";
import "./styles.scss";

const OnBoardMessage = props => {
  const {
    title,
    subTitle,
    leftButton,
    rightButton,
    finishButton,
    contentClassName,
    finishImgsClassName,
    finishButtonClassName,
    finishSubTitle,
    finishQuestionMark,
    subtitleClassName,
    buttonsClassName,
    closeModal,
    nextScreen,
    goToScreen,
    returnScreen
  } = props;

  return (
    <FadeAnimation animationDuration={100} timeout={100} animationDelay={0} animationFunction="ease-in">
      <div className="c-onboard-wrapper">
        <section aria-label="Onboard Message Container" className="c-onboardExp">
          <button className="b-onboardExp-screen-modal-close" onClick={closeModal}>
            <Close20 />
          </button>
          <div className={finishImgsClassName}>
            <div className={finishButtonClassName}>
              <h1 className="b-onboardExp-finish__title">{title}</h1>
              <div className={subtitleClassName}>
                <div className="b-onboardExp-finish__subtitle">
                  {subTitle}
                  <div className="b-onboardExp-finish-oval-content">
                    <div className="b-onboardExp-finish-oval">{finishQuestionMark}</div>
                  </div>
                  {finishSubTitle}
                </div>
              </div>
              <div className={buttonsClassName}>
                <Button onClick={closeModal} size="field" style={{ marginTop: "2.6rem" }}>
                  {finishButton}
                </Button>
              </div>
            </div>
          </div>
          <section className={contentClassName}>
            <div className="b-onboardExp__title">{title}</div>
            <div className={subtitleClassName}>{subTitle}</div>
            <div className={buttonsClassName}>
              <Button size="field" onClick={() => goToScreen(returnScreen)}>
                {leftButton}
              </Button>
              <Button size="field" onClick={nextScreen} style={{ marginLeft: "1rem" }}>
                {rightButton}
              </Button>
            </div>
          </section>
          <footer className="b-onboardExp-footer">
            <img alt="" className="b-onboardExp-footer__img" src={bkgskyline} />
          </footer>
        </section>
      </div>
    </FadeAnimation>
  );
};

OnBoardMessage.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  leftButton: PropTypes.string,
  rightButton: PropTypes.string,
  finishButton: PropTypes.string,
  modalClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  finishImgsClassName: PropTypes.string,
  finishButtonClassName: PropTypes.string,
  finishSubTitle: PropTypes.string,
  finishQuestionMark: PropTypes.string,
  subtitleClassName: PropTypes.string,
  buttonsClassName: PropTypes.string,
  nextScreen: PropTypes.func,
  closeModal: PropTypes.func,
  goToScreen: PropTypes.func,
  returnScreen: PropTypes.number
};

export default OnBoardMessage;
