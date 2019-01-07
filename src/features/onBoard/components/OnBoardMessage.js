import React from "react";
import PropTypes from "prop-types";
import CloseIcon from "Assets/icons/CloseIcon";
import bkgskyline from "../img/bkg-skyline.svg";
import FadeAnimation from "Components/FadeAnimation";
import "../styles/onBoardMessage.scss";

const OnBoardMessage = props => {
  const {
    title,
    subTitle,
    leftButton,
    rightButton,
    finishButton,
    modalClassName,
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
        <div className="c-onboardExp">
          <div className={modalClassName} onClick={closeModal}>
            <CloseIcon className="b-onboardExp-screen-modal-close__img" />
          </div>
          <div className={finishImgsClassName}>
            <div className={finishButtonClassName}>
              <div className="b-onboardExp-finish__title">{title}</div>
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
                <button className="b-onboardExp-finish__button " onClick={closeModal}>
                  {finishButton}
                </button>
              </div>
            </div>
          </div>
          <div className={contentClassName}>
            <div className="b-onboardExp__title">{title}</div>
            <div className={subtitleClassName}>{subTitle}</div>
            <div className={buttonsClassName}>
              <button className="b-onboardExp__button" onClick={() => goToScreen(returnScreen)}>
                {leftButton}
              </button>
              <button className="b-onboardExp__button b-onboardExp__button--right" onClick={nextScreen}>
                {rightButton}
              </button>
            </div>
          </div>
          <footer className="b-onboardExp-footer">
            <img alt="" className="b-onboardExp-footer__img" src={bkgskyline} />
          </footer>
        </div>
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
