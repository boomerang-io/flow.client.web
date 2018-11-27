import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";

const WidgetCard = ({ title, children }) => {
  return (
    <div className="c-widget-card">
      <div className="b-widget-card__title">{title}</div>
      <div className="b-widget-card__content">{children}</div>
    </div>
  );
};

WidgetCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired
};

export default WidgetCard;
