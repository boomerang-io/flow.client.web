import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import "./styles.scss";

const WidgetCard = ({ title, type, children }) => {
  return (
    <div className={classnames("b-widget-card", { [`--${type}`]: type })}>
      <div className="b-widget-card__title">{title}</div>
      <div className="b-widget-card__content">{children}</div>
    </div>
  );
};

WidgetCard.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["stats", "graph"]),
  children: PropTypes.any.isRequired
};

export default WidgetCard;
