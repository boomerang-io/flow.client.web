import React from "react";
import cx from "classnames";
import styles from "./FeatureHeader.module.scss";

interface FeatureHeaderProps {
  className?: string;
  includeBorder?: boolean;
}

const FeatureHeader: React.FC<FeatureHeaderProps> = ({ children, className = "", includeBorder = false, ...rest }) => {
  return (
    <header className={cx(styles.container, className, { [styles.border]: includeBorder })} {...rest}>
      {children}
    </header>
  );
};

export default FeatureHeader;
