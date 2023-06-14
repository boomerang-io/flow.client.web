//@ts-nocheck
import styles from "./homeBanner.module.scss";

export default function HomeBanner() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to Boomerang Flow</h1>
        <p className={styles.subtitle}>Turn ideation into automation.</p>
      </div>
    </div>
  );
}
