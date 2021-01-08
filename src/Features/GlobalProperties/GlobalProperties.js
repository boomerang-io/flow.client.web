import React from "react";
import { useQuery } from "Hooks";
import { Helmet } from "react-helmet";
import ErrorDragon from "Components/ErrorDragon";
import { Loading } from "@boomerang-io/carbon-addons-boomerang-react";
import PropertiesTable from "./PropertiesTable";
import { serviceUrl } from "Config/servicesConfig";
import styles from "./globalProperties.module.scss";

const configUrl = serviceUrl.getGlobalConfiguration();

function GlobalPropertiesContainer() {
  const { data, error, isLoading } = useQuery(configUrl);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <ErrorDragon />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Global Parameters</title>
      </Helmet>
      <PropertiesTable properties={data} />
    </div>
  );
}

export default GlobalPropertiesContainer;
