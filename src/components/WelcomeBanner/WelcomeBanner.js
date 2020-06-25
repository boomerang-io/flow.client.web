import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { Close32, ChevronUp32 } from "@carbon/icons-react";
import styles from "./welcomeBanner.module.scss";

const SLACK_TEAM_ID = "T27TLPNS1";
const SLACK_FLOW_USERS_CHANNEL_ID = "CFKN6FJD6";

WelcomeBanner.propTypes = {
  hide: PropTypes.func,
  isOpen: PropTypes.bool,
  openTutorial: PropTypes.func,
  toggleIsOpen: PropTypes.func
};

export default function WelcomeBanner({ hide, isOpen, openTutorial, toggleIsOpen }) {
  return (
    <div className={cx(styles.container, { [styles.collapsed]: !isOpen })}>
      <section className={styles.closeHideButtons}>
        <button className={styles.closeButton} onClick={hide}>
          <Close32 aria-label="close" className={styles.closeIcon} />
          <p className={styles.closeText}>Don't show again</p>
        </button>
        <button className={styles.collapseButton} onClick={toggleIsOpen}>
          <p className={styles.collapseText}>{isOpen ? "Collapse" : "Welcome to Flow"}</p>
          <ChevronUp32 aria-label="collapse" className={cx(styles.collapseIcon, { [styles.closed]: !isOpen })} />
        </button>
      </section>
      <div className={cx(styles.content, { [styles.closed]: !isOpen })}>
        <h1 className={styles.title}>Welcome to Flow</h1>
        <p className={styles.subtitle}>Your new favorite tool</p>
        <div className={cx(styles.buttons, { [styles.closed]: !isOpen })}>
          <button className={styles.button} disabled={!isOpen} onClick={openTutorial}>
            <p className={styles.buttonText}>Learn the basics</p>
          </button>
          {/* <button className={`${styles.button} ${styles.buttonMiddle}`}>
            <p className={styles.buttonText}>Jump in</p>
            <p className={styles.buttonSubtext}>with a sample workflow</p>
          </button> */}
          <a
            className={styles.button}
            href={`slack://channel?team=${SLACK_TEAM_ID}&id=${SLACK_FLOW_USERS_CHANNEL_ID}`}
            tabIndex={isOpen ? 0 : -1}
          >
            <p className={styles.buttonText}>Slack us feedback</p>
          </a>
        </div>
      </div>
    </div>
  );
}
