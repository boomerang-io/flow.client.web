import React from "react";
import { ErrorDragon as ErrorDragonComponent } from "@boomerang-io/carbon-addons-boomerang-react";
import { BASE_LAUNCH_ENV_URL } from "Config/platformUrlConfig";

const ErrorDragon: React.FC<any> = (props) => {
  return <ErrorDragonComponent statusUrl={`${BASE_LAUNCH_ENV_URL}/status`} {...props} />;
}

export default ErrorDragon;
