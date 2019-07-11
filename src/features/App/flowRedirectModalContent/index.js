import React from "react";
import { BASE_LAUNCH_ENV_URL } from "Config/platformUrlConfig";
import castleBridge from "Assets/svg/castle_drawbridge.svg";
import "./styles.scss";

const FlowRedirectModalContent = () => {
  const handleOnClick = () => {
    window.location.assign(`${BASE_LAUNCH_ENV_URL}/launchpad`);
  };
  const contentText = "In order to access Flow, you must be a part of a Team";
  const smallText = "Please allow us to redirect you to Boomerang Launchpad";

  return (
    <div className="bmrg--c-flowRedirect-content">
      <h1 className="bmrg--b-flowRedirect-content__header">Hi Mate,</h1>
      <span className="bmrg--b-flowRedirect-content__text">{contentText}</span>
      <span className="bmrg--b-flowRedirect-content__text--small">{smallText}</span>
      <button className="bmrg--b-flowRedirect-content__button" onClick={handleOnClick}>
        Launchpad
      </button>
      <img className="bmrg--c-flowRedirect-content__img" src={castleBridge} alt="redirect" />
    </div>
  );
};

export default FlowRedirectModalContent;
