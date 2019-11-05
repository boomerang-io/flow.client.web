import React from "react";
import { BASE_LAUNCH_ENV_URL } from "Config/platformUrlConfig";
import castleBridge from "Assets/svg/castle_drawbridge.svg";
import "./styles.scss";

const RedirectModalContent = () => {
  const handleOnClick = () => {
    window.location.assign(`${BASE_LAUNCH_ENV_URL}/launchpad`);
  };
  const contentText = "You need to be a member of a team with access to Flow to start using it";
  const smallText = "Request to join a team on Launchpad";

  return (
    <div className="c-flowRedirect-content">
      <h1 className="b-flowRedirect-content__header">Hi Mate,</h1>
      <span className="b-flowRedirect-content__text">{contentText}</span>
      <span className="b-flowRedirect-content__text--small">{smallText}</span>
      <button className="b-flowRedirect-content__button" onClick={handleOnClick}>
        Launchpad
      </button>
      <img className="c-flowRedirect-content__img" src={castleBridge} alt="redirect" />
    </div>
  );
};

export default RedirectModalContent;
