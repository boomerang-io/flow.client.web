import React from "react";
import { useFeature } from "flagged";
import { Error403 } from "@boomerang-io/carbon-addons-boomerang-react";
import { FeatureFlag } from "Config/appConfig";
import { CORE_ENV_URL } from "Config/appConfig";

const NoAccessRedirectPrompt = () => {
  const isStandaAloneMode = useFeature(FeatureFlag.Standalone);
  const message = React.useMemo(() => {
    return isStandaAloneMode ? (
      <p>
        You’re not a member of any teams in Boomerang Flow. Before we let you explore this wonderful tool, please have
        an admin add you to a team.{" "}
      </p>
    ) : (
      <p>
        You’re not a member of any teams with access to Boomerang Flow. Before we let you explore this wonderful tool,{" "}
        <a href={`${CORE_ENV_URL}/launchpad`}>head over to Launchpad</a> to join or create a team authorized for Flow.
      </p>
    );
  }, [isStandaAloneMode]);

  return (
    <div style={{ paddingTop: "3rem" }}>
      <Error403 header={null} title="Crikey, how did you get here?!" message={message} />
    </div>
  );
};

export default NoAccessRedirectPrompt;
