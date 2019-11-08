import React from "react";
import PropTypes from "prop-types";
import { Button } from "carbon-components-react";
import { Error403 } from "@boomerang/carbon-addons-boomerang-react";
import { ArrowRight16 } from "@carbon/icons-react";

const UnsupportedBrowserPrompt = ({ onDismissWarning }) => {
  return (
    <div style={{ textAlign: "center", paddingTop: "3rem" }}>
      <Error403
        header={null}
        message={
          <>
            <p style={{ marginBottom: "2rem" }}>
              Your experience may be degraded if you aren't using a recent version of Chrome, Firefox, Safari or Edge.
            </p>
            <Button iconDescription="Continue" onClick={onDismissWarning} renderIcon={ArrowRight16}>
              Continue, anyway
            </Button>
          </>
        }
      />
    </div>
  );
};

UnsupportedBrowserPrompt.propTypes = {
  onDismissWarning: PropTypes.func.isRequired
};

export default UnsupportedBrowserPrompt;
