import React from "react";
import PropTypes from "prop-types";

const CloseIcon = ({ className }) => {
  return (
    <svg
      className={className}
      width="13px"
      height="14px"
      viewBox="0 0 13 14"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="13-Report-a-bug" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="13.20-describe-empty" transform="translate(-1159.000000, -152.000000)" fill="#1D364D">
          <g id="x" transform="translate(1147.000000, 140.000000)">
            <polygon points="24.1332409 12 18.0666975 17.51474 12 12 12 14.96982 16.4331308 18.99986 16.4329767 19 16.4331308 19.00014 12 23.03018 12 26 18.0666975 20.48512 24.1332409 26 24.1332409 23.03018 19.7001102 19.00014 19.7004182 19 19.7001102 18.99972 24.1332409 14.96982" />
          </g>
        </g>
      </g>
    </svg>
  );
};

CloseIcon.propTypes = {
  className: PropTypes.string
};

export default CloseIcon;
