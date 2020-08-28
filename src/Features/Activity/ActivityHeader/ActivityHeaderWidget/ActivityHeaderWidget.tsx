//@ts-nocheck
import React from "react";
import PropTypes from "prop-types";
import styles from "./activityHeaderWidget.module.scss";

ActivityHeaderWidget.propTypes = {
  icon: PropTypes.any,
  text: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

function ActivityHeaderWidget({ icon: Icon, text, value }) {
  return (
    <div className={styles.container}>
      <div className={styles.valueAndIcon}>
        <p className={styles.value}>{value}</p>
        {typeof Icon === "object" ? (
          <Icon aria-label={text} className={styles.icon} />
        ) : typeof Icon === "string" ? (
          <span aria-label={text} aria-hidden={false} className={styles.emoji} role="img">
            {Icon}
          </span>
        ) : null}
      </div>
      <p className={styles.text}>{text}</p>
    </div>
  );
}

export default ActivityHeaderWidget;
