import { AbstractPortFactory } from "@boomerang/boomerang-dag";
import StartEndPortModel from "./StartEndPortModel";

export default class StartEndPortFactory extends AbstractPortFactory {
  constructor() {
    super("startend");
  }

  getNewInstance() {
    return new StartEndPortModel();
  }
}
