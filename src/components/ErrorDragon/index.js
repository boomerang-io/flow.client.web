import React from "react";
import { ErrorDragon as ErrorDragonComponent } from "@boomerang/carbon-addons-boomerang-react";
import { BASE_LAUNCH_ENV_URL } from "Config/platformUrlConfig";

function ErrorDragon() {
  return <ErrorDragonComponent statusUrl={`${BASE_LAUNCH_ENV_URL}/status`} />;
}

export default ErrorDragon;
