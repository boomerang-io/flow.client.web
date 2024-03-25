import React from "react";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import GitHub from "./GitHub";
import styles from "./connect.module.scss";

function Connect() {
  const location = useLocation();
  const parsed = queryString.parse(location.search);
  console.log(parsed);

  //TODO - add in the ability to retrieve a path param of :providor
  return (
    <div className={styles.container}>
      <GitHub installId={parsed.installation_id} />
    </div>
  );
}

export default Connect;
