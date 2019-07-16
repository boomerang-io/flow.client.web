import React, { Component } from "react";
import sortByProp from "@boomerang/boomerang-utilities/lib/sortByProp";
import classNames from "classnames";
import matchSorter from "match-sorter";
import { Search } from "carbon-components-react";
import Sidenav from "@boomerang/boomerang-components/lib/Sidenav";
import Task from "./Task";

export default class Tasks extends Component {
  state = {
    tasksToDisplay: this.props.tasks.data,
    searchQuery: ""
  };

  handleClear = () => {
    this.setState({ tasksToDisplay: this.props.tasks.data, searchQuery: "" });
  };

  handleOnSearchInputChange = e => {
    const searchQuery = e.target.value;
    this.setState({
      searchQuery,
      tasksToDisplay: this.handleSearchFilter(searchQuery)
    });
  };

  handleSearchFilter = searchQuery => matchSorter(this.props.tasks.data, searchQuery, { keys: ["category", "name"] });

  determineTasks = () => {
    //Create object with keys as the categories and values as tasks
    const sortedTasksByCategory = sortByProp(this.state.tasksToDisplay, "category");
    const catgegoriesWithTasks = sortedTasksByCategory.reduce((accum, task) => {
      if (!accum[task.category]) {
        accum[task.category] = [task];
      } else {
        accum[task.category].push(task);
      }
      return accum;
    }, {});

    //Iterate through all of the categories and render header with associated tasks
    const uniqueCategories = Object.keys(catgegoriesWithTasks);
    return uniqueCategories.map(category => (
      <section className={classNames("b-task-category", { [`--${category}`]: category })} key={category}>
        <h3 className={classNames("b-task-category__header", { [`--${category}`]: category })}>{category}</h3>

        <ul role="listbox">
          {catgegoriesWithTasks[category].map(task => (
            <Task model={{ type: task.id, name: task.name, taskData: task }} name={task.name} key={task.id} />
          ))}
        </ul>
      </section>
    ));
  };

  render() {
    return (
      <Sidenav
        theme="bmrg-white"
        header={() => (
          <Search
            placeHolderText="Search tasks"
            onChange={this.handleOnSearchInputChange}
            onClear={this.handleClear}
            value={this.state.searchQuery}
          />
        )}
        content={() => this.determineTasks()}
      />
    );
  }
}
