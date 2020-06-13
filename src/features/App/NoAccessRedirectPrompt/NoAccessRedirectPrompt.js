import React from "react";
import { Error403 } from "@boomerang/carbon-addons-boomerang-react";
import { BASE_LAUNCH_ENV_URL } from "Config/platformUrlConfig";

const NoAccessRedirectPrompt = () => {
  return (
    <div style={{ paddingTop: "3rem" }}>
      <Error403
        header={null}
        title="Crikey, how did you get here?!"
        message={
          <p>
            You’re not a member of any teams with access to Boomerang Flow. Before we let you explore this wonderful
            tool, <a href={`${BASE_LAUNCH_ENV_URL}/launchpad`}>head over to Launchpad</a> to join or create a team
            authorized for Flow.
          </p>
        }
      />
    </div>
  );
};

export default NoAccessRedirectPrompt;
