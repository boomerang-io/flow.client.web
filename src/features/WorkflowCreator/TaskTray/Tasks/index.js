import React, { Component } from "react";
import sortByProp from "@boomerang/boomerang-utilities/lib/sortByProp";
import classNames from "classnames";
import Sidenav from "@boomerang/boomerang-components/lib/Sidenav";
import Task from "./Task";

export default class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  /*
        New Feature to Display the lefthand component pallet organized by category
        Incoming tasks are sorted and then broken into an array that contained arrays
        of task objects split by each category
        -Each category is displayed in its own container on the pallet

    */
  determineTasks = () => {
    const sortedTasks = sortByProp(this.props.tasks, "category");
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

    return all_tasks.map((arr, index) => (
      <div className={classNames("pallet-category--", arr[0].category)} key={index}>
        <h3 className={classNames("pallet-category--header--", arr[0].category)}> {arr[0].category}</h3>

        {arr.map(task => (
          <Task
            model={{ type: task.id, name: task.name, task_data: task }}
            name={task.name}
            color="rgb(129,17,81)"
            key={task.id}
          />
        ))}
      </div>
    ));
  };

  render() {
    return <Sidenav theme="bmrg-white" styles={{ width: "20rem" }} content={() => this.determineTasks()} />;
  }
}
