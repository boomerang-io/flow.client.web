// @ts-nocheck
import React, { Component } from "react";
import cx from "classnames";
import {
  AccordionItem,
  Checkbox,
  CheckboxList,
  OverflowMenu,
  Search,
} from "@boomerang-io/carbon-addons-boomerang-react";
import Accordion from "carbon-components-react/lib/components/Accordion";
import Task from "./Task";
import { taskIcons } from "Utils/taskIcons";
import matchSorter from "match-sorter";
import uniqBy from "lodash/uniqBy";
import { sortByProp } from "@boomerang-io/utils";
import { ChevronLeft32, SettingsAdjust20, Recommend16 } from "@carbon/icons-react";
import { TaskModel } from "Types";
import styles from "./tasks.module.scss";

const FIRST_TASK_CATEGORY = "workflow";

interface TaskProps {
  tasks: Array<TaskModel>;
}
export default class Tasks extends Component<TaskProps> {
  state = {
    activeFilters: [],
    firstTaskCategoryIsOpen: true,
    isAccordionOpen: false,
    isSidenavOpen: true,
    searchQuery: "",
    tasksToDisplay: this.props.tasks,
    taskTypes: [],
    showVerified: false,
  };

  componentDidMount() {
    const taskFilters = taskIcons.map((IconConfig) => ({
      id: IconConfig.name,
      labelText: (
        <div className={styles.checkboxOption}>
          <IconConfig.Icon /> <p>{IconConfig.name}</p>{" "}
        </div>
      ),
    }));
    this.setState({ taskTypes: sortByProp(taskFilters, "id") });
  }

  handleOnSearchInputChange = (e) => {
    const searchQuery = e.target.value;
    if (searchQuery === "" && this.state.activeFilters === []) {
      this.setState({
        searchQuery,
        tasksToDisplay: this.props.tasks,
      });
      return;
    }
    if (this.state.activeFilters.length === 0) {
      this.setState({
        searchQuery,
        tasksToDisplay: this.handleSearchFilter(searchQuery, this.props.tasks),
      });
      return;
    }

    //use the filters to select which tasks can be passed to search query
    const currentTasks = this.props.tasks.filter((task) => this.state.activeFilters.includes(task.icon));
    this.setState({
      searchQuery,
      tasksToDisplay: this.handleSearchFilter(searchQuery, currentTasks),
    });
  };

  handleCheckboxListChange = (checked: boolean, label: string) => {
    let filtersState = [].concat(this.state.activeFilters);

    let newFilters = [];
    let hasFilter = Boolean(filtersState.find((filter) => filter === label));
    if (hasFilter) newFilters = filtersState.filter((filter) => filter !== label);
    else newFilters = filtersState.concat(label);

    const searchQuery = this.state.searchQuery;

    this.setState({ activeFilters: newFilters });

    //if none are checked, set back to default w/ search query
    if (newFilters.length === 0) {
      this.setState({
        tasksToDisplay: this.handleSearchFilter(searchQuery, this.props.tasks),
      });
      return;
    }

    //use the filters to select which tasks can be passed to search query
    const currentTasksWithMapping = this.props.tasks.filter((task) => newFilters.includes(task.icon));
    this.setState({
      tasksToDisplay: this.handleSearchFilter(searchQuery, currentTasksWithMapping),
    });
  };

  handleCheckboxChange = () => {
    const newTaskTemplates = this.state.showVerified
      ? this.props.tasks.filter((task) => task.verified === true)
      : this.props.tasks;
    const tasksFilteredByType =
      this.state.activeFilters.length > 0
        ? newTaskTemplates.filter((task) => this.state.activeFilters.includes(task.icon))
        : newTaskTemplates;

    const searchQuery = this.state.searchQuery;

    this.setState({
      tasksToDisplay: this.handleSearchFilter(searchQuery, tasksFilteredByType),
    });
  };

  handleSearchFilter = (searchQuery: string, tasksToDisplay) =>
    matchSorter(tasksToDisplay, searchQuery, { keys: ["category", "name"] });

  determineTasks = () => {
    //Create object with keys as the categories and values as tasks
    const sortedTasksByCategory = sortByProp(this.state.tasksToDisplay, "category");
    const catgegoriesWithTasks = sortedTasksByCategory.reduce((accum, task) => {
      const formattedCategory = task.category?.toLowerCase();
      if (!accum[formattedCategory]) {
        accum[formattedCategory] = [task];
      } else {
        accum[formattedCategory].push(task);
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
        {uniqueCategories.map((category) => (
          <AccordionItem
            title={`${category} (${catgegoriesWithTasks[category].length})`}
            open={
              this.state.isAccordionOpen || (category === FIRST_TASK_CATEGORY && this.state.firstTaskCategoryIsOpen)
                ? true
                : null
            }
            key={category}
          >
            <ul className={styles.taskSection} key={category}>
              {sortByProp(catgegoriesWithTasks[category], "name").map((task) => (
                <Task
                  key={task.id}
                  icon={task.icon}
                  model={{ type: task.id, name: task.name, taskData: task }}
                  name={task.name}
                  verified={task.verified}
                  scope={task.scope}
                />
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
            onClick={() => this.setState((prevState) => ({ isSidenavOpen: !prevState.isSidenavOpen }))}
          >
            <ChevronLeft32 className={styles.collapseButtonImg} />
          </button>
        </header>
        {this.state.isSidenavOpen && (
          <>
            <section className={styles.tasks}>
              <Search
                data-testid="editor-task-search"
                id="search-tasks"
                size="sm"
                labelText="Search"
                onChange={this.handleOnSearchInputChange}
                placeHolderText="Search for a task"
                value={this.state.searchQuery}
              />
              <OverflowMenu
                iconDescription="Filter"
                renderIcon={SettingsAdjust20}
                style={{
                  backgroundColor:
                    this.state.activeFilters.length > 0 || this.state.showVerified ? "#3DDBD9" : "initial",
                  borderRadius: "0.25rem",
                }}
                flipped={true}
                menuOptionsClass={styles.filters}
              >
                <section className={styles.filterHeader}>
                  <p className={styles.filterTitle}>Filters</p>
                  <button
                    className={styles.resetFilter}
                    onClick={() => this.setState({ activeFilters: [], tasksToDisplay: this.props.tasks })}
                  >
                    Reset filters
                  </button>
                </section>
                <section className={styles.topFilter}>
                  <Checkbox
                    id="verified-tasks"
                    labelText={
                      <div className={styles.checkboxOption}>
                        <Recommend16 fill="#0072C3" style={{ willChange: "auto" }} /> <p>Verified Tasks</p>
                      </div>
                    }
                    checked={this.state.showVerified}
                    onChange={() => {
                      this.setState(
                        (prevState) => ({ showVerified: !prevState.showVerified }),
                        this.handleCheckboxChange
                      );
                    }}
                  />
                </section>
                <section className={styles.filter}>
                  <p className={styles.sectionTitle}>Filter by Task Type</p>
                  <CheckboxList
                    selectedItems={this.state.activeFilters}
                    // initialSelectedItems={this.state.activeFilters}
                    options={this.state.taskTypes}
                    onChange={(...args) => this.handleCheckboxListChange(...args)}
                  />
                </section>
              </OverflowMenu>
            </section>
            <section className={styles.detail}>
              <h3 className={styles.totalCount}>{`Showing ${this.state.tasksToDisplay.length} tasks`}</h3>
              <button
                className={styles.expandButton}
                onClick={() => {
                  this.setState((prevState) => ({
                    isAccordionOpen: !prevState.isAccordionOpen,
                    firstTaskCategoryIsOpen: false,
                  }));
                }}
              >
                {this.state.isAccordionOpen ? "Collapse all" : "Expand all"}
              </button>
            </section>
            <section className={styles.content}>{this.determineTasks()}</section>
          </>
        )}
      </aside>
    );
  }
}
