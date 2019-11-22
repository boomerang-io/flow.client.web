import React, { Component } from "react";
import cx from "classnames";
import { AccordionItem, OverflowMenu, Search } from "carbon-components-react";
import { CheckboxList } from "@boomerang/carbon-addons-boomerang-react";
import Accordion from "carbon-components-react/lib/components/Accordion";
import Task from "./Task";
import mapTaskNametoIcon from "Utilities/taskIcons";
import matchSorter from "match-sorter";
import uniqBy from "lodash/uniqBy";
import sortByProp from "@boomerang/boomerang-utilities/lib/sortByProp";
import { ChevronLeft32, SettingsAdjust20 } from "@carbon/icons-react";
import styles from "./tasks.module.scss";

const FIRST_TASK_CATEGORY = "workflow";
export default class Tasks extends Component {
  state = {
    activeFilters: [],
    firstTaskCategoryIsOpen: true,
    isAccordianOpen: false,
    isSidenavOpen: true,
    searchQuery: "",
    tasksToDisplay: this.props.tasks.data,
    tasksWithMapping: this.props.tasks.data.map(task => ({
      ...task,
      iconImg: mapTaskNametoIcon(task.name, task.category).iconImg,
      iconName: mapTaskNametoIcon(task.name, task.category).iconName
    })),
    uniqueTaskTypes: []
  };

  componentDidMount() {
    /**
     * create task type format to pass to the CheckboxList filter
     */
    let totalTaskTypes = [
      ...new Set(this.state.tasksWithMapping.map(task => ({ iconName: task.iconName, iconImg: task.iconImg })))
    ];
    let uniqueNames = uniqBy(totalTaskTypes, "iconName");
    const uniqueTaskTypes = uniqueNames.map(task => ({
      id: task.iconName,
      labelText: (
        <div className={styles.checkboxOption}>
          {task.iconImg} <p>{task.iconName}</p>{" "}
        </div>
      )
    }));
    this.setState({ uniqueTaskTypes: sortByProp(uniqueTaskTypes, "id") });
  }

  handleOnSearchInputChange = e => {
    const searchQuery = e.target.value;
    if (searchQuery === "" && this.state.activeFilters === []) {
      this.setState({
        searchQuery,
        tasksToDisplay: this.props.tasks.data
      });
      return;
    }
    if (this.state.activeFilters.length === 0) {
      this.setState({
        searchQuery,
        tasksToDisplay: this.handleSearchFilter(searchQuery, this.props.tasks.data)
      });
      return;
    }

    //use the filters to select which tasks can be passed to search query
    const currentTasks = this.state.tasksWithMapping.filter(task => this.state.activeFilters.includes(task.iconName));
    delete currentTasks[("iconName", "iconImg")];
    this.setState({
      searchQuery,
      tasksToDisplay: this.handleSearchFilter(searchQuery, currentTasks)
    });
  };

  handleCheckboxListChange = (...args) => {
    const currFilters = args[args.length - 1];
    const searchQuery = this.state.searchQuery;

    this.setState({ activeFilters: currFilters });

    //if none are checked, set back to default w/ search query
    if (currFilters.length === 0) {
      this.setState({
        tasksToDisplay: this.handleSearchFilter(searchQuery, this.props.tasks.data)
      });
      return;
    }

    //use the filters to select which tasks can be passed to search query
    const currentTasksWithMapping = this.state.tasksWithMapping.filter(task => currFilters.includes(task.iconName));
    delete currentTasksWithMapping[("iconName", "iconImg")];
    this.setState({
      tasksToDisplay: this.handleSearchFilter(searchQuery, currentTasksWithMapping)
    });
  };

  handleSearchFilter = (searchQuery, tasksToDisplay) =>
    matchSorter(tasksToDisplay, searchQuery, { keys: ["category", "name"] });

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

    // Push "workflow" to front of array and delete the other instance of it w/ set
    const uniqueCategories = uniqBy(Object.keys(catgegoriesWithTasks)).sort((categoryA, categoryB) => {
      if (categoryA === FIRST_TASK_CATEGORY) {
        return -1;
      }

      if (categoryA < categoryB) {
        return -1;
      }

      if (categoryA > categoryB) {
        return 1;
      }

      return 0;
    });

    //Iterate through all of the categories and render header with associated tasks
    return (
      <Accordion>
        {uniqueCategories.map(category => (
          <AccordionItem
            title={`${category} (${catgegoriesWithTasks[category].length})`}
            open={
              this.state.isAccordianOpen || (category === FIRST_TASK_CATEGORY && this.state.firstTaskCategoryIsOpen)
                ? true
                : null
            }
            key={category}
          >
            <ul className={styles.taskSection} key={category}>
              {catgegoriesWithTasks[category].map(task => (
                <Task key={task.id} model={{ type: task.id, name: task.name, taskData: task }} name={task.name} />
              ))}
            </ul>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };

  render() {
    return (
      <aside className={cx(styles.container, { [styles.collapsed]: !this.state.isSidenavOpen })}>
        <header className={styles.header}>
          <h1 className={styles.heading}>Add a task</h1>
          <button
            className={styles.collapseButton}
            onClick={() => this.setState(prevState => ({ isSidenavOpen: !prevState.isSidenavOpen }))}
          >
            <ChevronLeft32 className={styles.collapseButtonImg} />
          </button>
        </header>
        {this.state.isSidenavOpen && (
          <>
            <section className={styles.tools}>
              <Search
                small
                labelText="Search for a task"
                onChange={this.handleOnSearchInputChange}
                placeHolderText="Search for a task"
                value={this.state.searchQuery}
              />
              <OverflowMenu renderIcon={SettingsAdjust20} flipped={true}>
                <CheckboxList
                  initialSelectedItems={this.state.activeFilters}
                  options={this.state.uniqueTaskTypes}
                  onChange={(...args) => this.handleCheckboxListChange(...args)}
                />
              </OverflowMenu>
            </section>
            <section className={styles.detail}>
              <h3 className={styles.totalCount}>{`Showing ${this.state.tasksToDisplay.length} tasks`}</h3>
              <button
                className={styles.expandButton}
                onClick={() => {
                  this.setState(prevState => ({
                    isAccordianOpen: !prevState.isAccordianOpen,
                    firstTaskCategoryIsOpen: false
                  }));
                }}
              >
                {this.state.isAccordianOpen ? "Collapse all" : "Expand all"}
              </button>
            </section>
            <section className={styles.content}>{this.determineTasks()}</section>
          </>
        )}
      </aside>
    );
  }
}
