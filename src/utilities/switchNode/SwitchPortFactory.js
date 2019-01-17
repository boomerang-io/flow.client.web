import { AbstractPortFactory } from "@boomerang/boomerang-dag";
import SwitchPortModel from "./SwitchPortModel";

export default class SwitchPortFactory extends AbstractPortFactory {
  constructor() {
    super("decision");
  }

  getNewInstance() {
    return new SwitchPortModel();
  }
}
