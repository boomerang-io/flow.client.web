import React from "react";
import { ErrorDragon as ErrorDragonComponent } from "@boomerang-io/carbon-addons-boomerang-react";
import { CORE_ENV_URL } from "Config/appConfig";

const ErrorDragon: React.FC<any> = (props) => {
  return <ErrorDragonComponent statusUrl={`${CORE_ENV_URL}/status`} {...props} />;
};

export default ErrorDragon;
