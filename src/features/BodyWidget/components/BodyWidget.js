import React from "react";
import _ from "lodash";
import { TrayWidget } from "../../TaskTray/TrayWidget";
import { Application } from "../Application";
import { TrayItemWidget } from "../../TaskTray/TrayItemWidget";
import { DefaultNodeModel, DiagramWidget } from "storm-react-diagrams";

import { actions as nodeActions } from "../BodyWidgetContainer/reducer/index";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { IngestCSVNodeModel } from "../../IngestCSV/CustomTaskNodeModel";
import Navbar from "@boomerang/boomerang-components/lib/Navbar";
import sortByProp from "@boomerang/boomerang-utilities/lib/sortByProp";

import classNames from "classnames";

/**
 * @author Dylan Vorster
 */
export class BodyWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    /*
        New Feature to Display the lefthand component pallet organized by category
        Incoming tasks are sorted and then broken into an array that contained arrays
        of task objects split by each category
        -Each category is displayed in its own container on the pallet

    */

    const sortedTasks = sortByProp(this.props.tasks.data, "category");
    /*let trayItems = this.props.tasks.data.map(task => (
      <TrayItemWidget
        model={{ type: task.id, name: task.name, task_data: task }}
        name={task.name}
        color="rgb(129,17,81)"
      />
    ));*/

    let all_tasks = [];
    let list_of_unique_categories = [];
    let index = -1;

    Object.keys(sortedTasks).forEach(key => {
      if (list_of_unique_categories.includes(sortedTasks[key].category) === false) {
        index++;
        list_of_unique_categories.push(sortedTasks[key].category);
        all_tasks[index] = [];
        all_tasks[index].push(sortedTasks[key]);
      } else {
        all_tasks[index].push(sortedTasks[key]);
      }
    });

    let trayItems = all_tasks.map(arr => (
      <div className={classNames("pallet-category--", arr[0].category)}>
        <h3 className={classNames("pallet-category--header--", arr[0].category)}> {arr[0].category}</h3>

        {arr.map(task => (
          <TrayItemWidget
            model={{ type: task.id, name: task.name, task_data: task }}
            name={task.name}
            color="rgb(129,17,81)"
          />
        ))}
      </div>
    ));

    return (
      <>
        <TrayWidget>{trayItems}</TrayWidget>
        <div className="content">
          <div
            className="diagram-layer"
            onDrop={event => {
              var data = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));
              var nodesCount = _.keys(
                this.props.app
                  .getDiagramEngine()
                  .getDiagramModel()
                  .getNodes()
              ).length;

              var node = null;
              node = new IngestCSVNodeModel("Node " + (nodesCount + 1), "rgb(0,192,255)", data.type); //, data.name);

              //add node info to the state
              const { id, type, taskId, taskName } = node;
              //this.props.nodeActions.addNode({ id, type, taskId, taskName, config: {} });
              this.props.nodeActions.addNode({ nodeId: id, taskId, config: {} });

              var points = this.props.app.getDiagramEngine().getRelativeMousePoint(event);
              node.x = points.x;
              node.y = points.y;
              this.props.app
                .getDiagramEngine()
                .getDiagramModel()
                .addNode(node);
              this.forceUpdate();
              console.log(
                JSON.stringify(
                  this.props.app
                    .getDiagramEngine()
                    .getDiagramModel()
                    .serializeDiagram()
                )
              );
            }}
            onDragOver={event => {
              event.preventDefault();
            }}
          >
            <DiagramWidget
              className="srd-demo-canvas"
              diagramEngine={this.props.app.getDiagramEngine()}
              maxNumberPointsPerLink={0}
              //smartRouting={true}
              deleteKeys={[]}
            />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => {
  return { nodes: state };
};

const mapDispatchToProps = dispatch => ({
  nodeActions: bindActionCreators(nodeActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BodyWidget);
