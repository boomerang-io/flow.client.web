import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { Close16 } from "@carbon/icons-react";
import styles from "./WorkflowCloseButton.module.scss";

WorkflowCloseButton.propTypes = {
  alt: PropTypes.string,
  className: PropTypes.string,
  kind: PropTypes.string,
  onClick: PropTypes.func
};

export default function WorkflowCloseButton({
  alt = "Workflow close button",
  className,
  kind = "designer",
  onClick,
  ...rest
}) {
  return (
    <button className={cx(styles.button, className, styles[kind])} onClick={onClick} {...rest}>
      <Close16 alt={alt} />
    </button>
  );
}
