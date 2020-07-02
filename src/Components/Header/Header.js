import React from "react";
import PropTypes from "prop-types";
import styles from "./header.module.scss";

Header.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string
};

function Header({ title, description }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.info}>
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        <section className={styles.buttons} />
      </div>
    </div>
  );
}

export default Header;
