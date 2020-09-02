import React from "react";
import { 
  FeatureHeader as Header, 
  FeatureHeaderTitle as HeaderTitle, 
  FeatureHeaderSubtitle as HeaderSubtitle, 
} from "@boomerang-io/carbon-addons-boomerang-react";
import styles from "./insightsHeader.module.scss";

const InsightsHeader: React.FC = () => {
  return (
    <Header
      className={styles.container}
      includeBorder={false}
      header={
        <>
          <HeaderSubtitle>There are some</HeaderSubtitle>
          <HeaderTitle>Insights</HeaderTitle>
        </>
      }
    />
  );
}

export default InsightsHeader;
