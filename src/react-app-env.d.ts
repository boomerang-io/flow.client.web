/// <reference types="react-scripts" />
declare module "@boomerang-io/carbon-addons-boomerang-react";
declare module "@carbon/icons-react";
declare module "@boomerang-io/utils";

declare module "*.scss" {
  const styles: { [className: string]: string };
  export default styles;
}
