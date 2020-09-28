import React from "react";
import { ErrorPage } from "@boomerang-io/carbon-addons-boomerang-react";
import EmptyGraphic from "./EmptyGraphic";

const EmptyState: React.FC<any> = (props) => {
  return (
    <ErrorPage
      graphic={<EmptyGraphic />}
      header={null}
      message="No results from that search, try again."
      title="Looks like there's nothing here"
      {...props}
    />
  );
};

export default EmptyState;
