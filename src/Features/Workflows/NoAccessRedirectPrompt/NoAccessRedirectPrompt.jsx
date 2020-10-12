import React from "react";
import { useFeature } from "flagged";
import { Error403 } from "@boomerang-io/carbon-addons-boomerang-react";
import { FeatureFlag } from "Config/appConfig";
import { CORE_ENV_URL } from "Config/appConfig";

const NoAccessRedirectPrompt = () => {
  const isStandaAloneMode = useFeature(FeatureFlag.StandaloneModeEnabled);

  const title = isStandaAloneMode ? "Welcome to Boomerang Flow" : "Crikey, how did you get here?!";
  const message = isStandaAloneMode ? (
    <p>
      You’re not a member of any teams yet. Before you can do much in this wonderful tool, please have an admin add you
      to a team.{" "}
    </p>
  ) : (
    <p>
      You’re not a member of any teams with access to Boomerang Flow.{" "}
      <a href={`${CORE_ENV_URL}/launchpad`}>Head over to Launchpad</a> to join or create a team authorized for Flow.
    </p>
  );

  return (
    <div style={{ paddingTop: "1rem" }}>
      <Error403 header={null} title={title} message={message} />
    </div>
  );
};

export default NoAccessRedirectPrompt;
