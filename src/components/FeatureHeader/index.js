import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./FeatureHeader.module.scss";

FeatureHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

function FeatureHeader({ children, className, ...rest }) {
  return (
    <header className={cx(styles.container, className)} {...rest}>
      {children}
    </header>
  );
}

export default FeatureHeader;
