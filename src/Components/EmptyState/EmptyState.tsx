import React from "react";
import { ErrorPage } from "@boomerang-io/carbon-addons-boomerang-react";
import EmptyGraphic from "./EmptyGraphic";

const EmptyState: React.FC<any> = (props) => {
  return <ErrorPage graphic={<EmptyGraphic />} {...props} />;
};

export default EmptyState;
