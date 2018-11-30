import React from "react";
import PropTypes from "prop-types";

const LegendIcon = ({ className, strokeColor }) => {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="10 0 13 28"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-width="4"
        fill="none"
        stroke={strokeColor}
        d="M0,16h10.666666666666666
          A5.333333333333333,5.333333333333333,0,1,1,21.333333333333332,16
          H32M21.333333333333332,16
          A5.333333333333333,5.333333333333333,0,1,1,10.666666666666666,16"
        class="recharts-legend-icon"
      />
    </svg>
  );
};

LegendIcon.propTypes = {
  className: PropTypes.string,
  strokeColor: PropTypes.string
};

export default LegendIcon;
