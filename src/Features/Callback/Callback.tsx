import React from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import GitHub from "./GitHub";
import styles from "./callback.module.scss";

function Callback() {
  const location = useLocation();

  console.log(queryString.parse(location.search));

  return (
    <div className={styles.container}>
      <GitHub />
    </div>
  );
}

export default Callback;
