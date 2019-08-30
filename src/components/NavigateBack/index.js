import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ChevronLeft32 } from "@carbon/icons-react";
import "./styles.scss";

const NavigateBack = ({ className, onClick, style, text, to }) => (
  <button className={className} style={style} onClick={onClick}>
    <Link className="b-navigate-back" to={to}>
      <ChevronLeft32 className="b-navigate-back__chevron" />
      <div className="b-navigate-back__text">{text}</div>
    </Link>
  </button>
);

NavigateBack.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object,
  text: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired
};

export default NavigateBack;
