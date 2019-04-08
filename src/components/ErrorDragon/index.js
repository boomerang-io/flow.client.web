import React from "react";
import ErrorDragonComponent from "@boomerang/boomerang-components/lib/ErrorDragon";
import { BASE_LAUNCH_ENV_URL } from "Config/platformUrlConfig";

function ErrorDragon() {
  return <ErrorDragonComponent includeReportBug={false} statusUrl={`${BASE_LAUNCH_ENV_URL}/status`} />;
}

export default ErrorDragon;
