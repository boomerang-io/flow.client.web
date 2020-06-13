import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./FeatureHeader.module.scss";

FeatureHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  includeBorder: PropTypes.bool
};

function FeatureHeader({ children, className, includeBorder, ...rest }) {
  return (
    <header className={cx(styles.container, className, { [styles.border]: includeBorder })} {...rest}>
      {children}
    </header>
  );
}

export default FeatureHeader;
