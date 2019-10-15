import React from "react";
import PropTypes from "prop-types";
import styles from "./activityHeaderWidget.module.scss";

ActivityHeaderWidget.propTypes = {
  icon: PropTypes.any,
  text: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

function ActivityHeaderWidget({ icon: Icon, text, value }) {
  return (
    <div className={styles.container}>
      <div className={styles.valueAndIcon}>
        <p className={styles.value}>{value}</p>
        {Icon && <Icon aria-label={text} className={styles.icon} />}
      </div>
      <p className={styles.text}>{text}</p>
    </div>
  );
}

export default ActivityHeaderWidget;
