import React, { Component } from "react";
import matchSorter from "match-sorter";
import uniqBy from "lodash/uniqBy";
import sortByProp from "@boomerang/boomerang-utilities/lib/sortByProp";
import { AccordionItem, OverflowMenu, Search } from "carbon-components-react";
import { ChevronLeft32, ChevronRight32, SettingsAdjust20 } from "@carbon/icons-react";
import { CheckboxList } from "@boomerang/carbon-addons-boomerang-react";
import Accordion from "carbon-components-react/lib/components/Accordion";
import mapTaskNametoIcon from "Utilities/taskIcons";
import Task from "./Task";
import styles from "./tasks.module.scss";

export default class Tasks extends Component {
  state = {
    accordionIsOpen: false,
    activeFilters: [],
    searchQuery: "",
    sidenavIsCollapsed: false,
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
      label: (
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

    //Iterate through all of the categories and render header with associated tasks
    const uniqueCategories = Object.keys(catgegoriesWithTasks);
    return (
      <Accordion>
        {uniqueCategories.map(category => (
          <AccordionItem
            title={`${category} (${catgegoriesWithTasks[category].length})`}
            open={this.state.accordionIsOpen ? true : null}
            key={category}
          >
            <ul className={styles.taskSection} key={category}>
              {catgegoriesWithTasks[category].map(task => (
                <Task model={{ type: task.id, name: task.name, taskData: task }} name={task.name} key={task.id} />
              ))}
            </ul>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };

  render() {
    return (
      <aside className={`${styles.container} ${this.state.sidenavIsCollapsed ? styles.collapsed : ""}`}>
        <>
          <div className={styles.header}>
            <h1 className={styles.heading}>Add a task</h1>
            <button
              className={styles.collapseButton}
              onClick={() => this.setState(prevState => ({ sidenavIsCollapsed: !prevState.sidenavIsCollapsed }))}
            >
              {this.state.sidenavIsCollapsed ? (
                <ChevronRight32 className={styles.collapseButtonImg} />
              ) : (
                <ChevronLeft32 className={styles.collapseButtonImg} />
              )}
            </button>
          </div>
          <div className={`${styles.tools} ${this.state.sidenavIsCollapsed ? styles.collapsed : ""}`}>
            <Search
              labelText="Search for a task"
              placeHolderText="Search for a task"
              onChange={this.handleOnSearchInputChange}
              value={this.state.searchQuery}
            />
            <OverflowMenu
              renderIcon={SettingsAdjust20}
              flipped={true}
              style={{ height: "2.5rem", width: "2.5rem", borderBottom: "1px solid #868d95" }}
            >
              <CheckboxList
                options={this.state.uniqueTaskTypes}
                initialSelectedItems={this.state.activeFilters}
                onChange={(...args) => this.handleCheckboxListChange(...args)}
              />
            </OverflowMenu>
          </div>
          <div className={`${styles.detail} ${this.state.sidenavIsCollapsed ? styles.collapsed : ""}`}>
            <h3 className={styles.totalCount}>{`Showing ${this.state.tasksToDisplay.length} tasks`}</h3>
            <button
              className={styles.expandButton}
              onClick={() => {
                this.setState(prevState => ({ accordionIsOpen: !prevState.accordionIsOpen }));
              }}
            >
              {this.state.accordionIsOpen ? "Collapse all" : "Expand all"}
            </button>
          </div>
        </>
        <div className={`${styles.content} ${this.state.sidenavIsCollapsed ? styles.collapsed : ""}`}>
          {this.determineTasks()}
        </div>
      </aside>
    );
  }
}
