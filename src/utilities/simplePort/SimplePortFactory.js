import { AbstractPortFactory } from "storm-react-diagrams";

export default class SimplePortFactory extends AbstractPortFactory {
  //cb: (initialConfig?: any) => PortModel;

  constructor(type, cb) {
    super(type);
    this.cb = cb;
  }

  getNewInstance(initialConfig) {
    return this.cb(initialConfig);
  }
}
