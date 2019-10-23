import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function DelayedRender({ children, wait }) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, wait);

    return () => clearTimeout(timer);
  }, [wait]);

  if (shouldRender) {
    return children;
  }

  return null;
}

DelayedRender.defaultProps = {
  wait: 300
};

DelayedRender.propTypes = {
  children: PropTypes.node.isRequired,
  /** Time to wait in milliseconds before rendering the component */
  wait: PropTypes.number
};

export default DelayedRender;
