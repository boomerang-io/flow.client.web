import { AbstractPortFactory } from "@boomerang/boomerang-dag";
import CustomTaskPortModel from "./CustomTaskPortModel";

export default class CustomTaskPortFactory extends AbstractPortFactory {
  constructor() {
    super("custom");
  }

  getNewInstance() {
    return new CustomTaskPortModel();
  }
}
