import CustomLink from "./CustomLink";
import { DefaultLinkFactory } from "storm-react-diagrams";

export default class CustomLinkFactory extends DefaultLinkFactory {
  constructor() {
    super();
    this.type = "custom";
  }

  getNewInstance = () => {
    return new CustomLink();
  };

  /*generateLinkSegment(model: AdvancedLinkModel, widget: DefaultLinkWidget, selected: boolean, path: string) {
		return (
			<g>
				<AdvancedLinkSegment model={model} path={path} />
			</g>
		);
	}*/
}
