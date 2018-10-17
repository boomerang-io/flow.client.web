import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import chevron from "Assets/svg/chevron";
import "./styles.scss";

const NavigateBack = ({ className, onClick, style, text, to }) => (
  <div className={className} style={style} onClick={onClick}>
    <Link className="b-navigate-back" to={to}>
      <img className="b-navigate-back__chevron" src={chevron} alt="Back chevron" />
      <div className="b-navigate-back__text">{text}</div>
    </Link>
  </div>
);

NavigateBack.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object,
  text: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired
};

export default NavigateBack;
