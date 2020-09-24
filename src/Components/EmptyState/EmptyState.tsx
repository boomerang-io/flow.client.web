import React from "react";

import { ErrorPage } from "@boomerang-io/carbon-addons-boomerang-react";

import EmptyGraphic from "./EmptyGraphic";
//@ts-ignore
export default function EmptyState(props) {
  return <ErrorPage graphic={<EmptyGraphic />} {...props} />;
}
