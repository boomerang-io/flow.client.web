import React from "react";
import PropTypes from "prop-types";
import DelayedRender from "Components/DelayedRender";
import { Loading as CarbonLoading } from "carbon-components-react";

Loading.propTypes = {
  wait: PropTypes.number
};

export default function Loading({ wait, ...rest }) {
  return (
    <DelayedRender wait={wait}>
      <CarbonLoading {...rest} />
    </DelayedRender>
  );
}
