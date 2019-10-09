import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { Edit16 } from "@carbon/icons-react";
import styles from "./WorkflowEditButton.module.scss";

WorkflowEditButton.propTypes = {
  alt: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default function WorkflowEditButton({ alt = "Workflow edit button", className, onClick, ...rest }) {
  return (
    <button className={cx(styles.button, className)} onClick={onClick} {...rest}>
      <Edit16 alt={alt} />
    </button>
  );
}
