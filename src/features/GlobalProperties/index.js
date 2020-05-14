import React from "react";
import { useQuery } from "react-query";
import ErrorDragon from "Components/ErrorDragon";
import { Loading } from "@boomerang/carbon-addons-boomerang-react";
import PropertiesTable from "./PropertiesTable";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { QueryStatus } from "Constants";
import styles from "./globalProperties.module.scss";

const configUrl = serviceUrl.getGlobalConfiguration();

function GlobalPropertiesContainer() {
  const { data, status, error } = useQuery({ queryKey: configUrl, queryFn: resolver.query(configUrl) });
  const isLoading = status === QueryStatus.Loading;

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

  if (data) {
    return (
      <div className={styles.container}>
        <PropertiesTable properties={data} />
      </div>
    );
  }

  return null;
}

export default GlobalPropertiesContainer;
