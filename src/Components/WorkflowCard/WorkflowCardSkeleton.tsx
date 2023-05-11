import { SkeletonPlaceholder } from "@carbon/react";

import styles from "./workflowCard.module.scss";

const WorkflowCardSkeleton = () => {
  return <SkeletonPlaceholder className={styles.skeletonContainer}></SkeletonPlaceholder>;
};

export default WorkflowCardSkeleton;
