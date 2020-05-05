import React from "react";
import PropTypes from "prop-types";
import { Link, useHistory, matchPath, useLocation } from "react-router-dom";
import cx from "classnames";
import capitalize from "lodash/capitalize";
import sortBy from "lodash/sortBy";
import matchSorter from "match-sorter";
import {
  Search,
  Accordion,
  AccordionItem,
  OverflowMenu,
  Checkbox,
  CheckboxList
} from "@boomerang/carbon-addons-boomerang-react";
import AddTaskTemplate from "./AddTaskTemplate";
import { appLink } from "Config/appConfig";
import { Bee16, ViewOff16, SettingsAdjust20 } from "@carbon/icons-react";
import { taskIcons } from "Utilities/taskIcons";
import { TaskTemplateStatus } from "Constants/taskTemplateStatuses";
import styles from "./sideInfo.module.scss";

SideInfo.propTypes = {
  taskTemplates: PropTypes.array.isRequired,
  addTemplateInState: PropTypes.func.isRequired
};
const description = "Create and import tasks to add to the Flow Editor task list";

export function SideInfo({ taskTemplates, addTemplateInState }) {
  const [searchQuery, setSearchQuery] = React.useState();
  const [activeFilters, setActiveFilters] = React.useState([]);
  const [tasksToDisplay, setTasksToDisplay] = React.useState(
    taskTemplates.filter(task => task.status === TaskTemplateStatus.Active)
  );
  const [openCategories, setOpenCategories] = React.useState(false);
  const [showArchived, setShowArchived] = React.useState(false);
  const taskFilters = taskIcons.map(icon => ({
    id: icon.iconName,
    labelText: (
      <div className={styles.checkboxOption}>
        <icon.icon /> <p>{icon.iconName}</p>{" "}
      </div>
    )
  }));

  const history = useHistory();
  const location = useLocation();
  const globalMatch = matchPath(location.pathname, { path: "/task-templates/:taskTemplateId/:version" });

  let categories = tasksToDisplay
    .reduce((acc, task) => {
      const newCategory = !acc.find(category => task.category.toLowerCase() === category?.toLowerCase());
      if (newCategory) acc.push(capitalize(task.category));
      return acc;
    }, [])
    .sort();

  React.useEffect(() => {
    const newTaskTemplates = showArchived
      ? taskTemplates
      : taskTemplates.filter(task => task.status === TaskTemplateStatus.Active);
    const tasksFilteredByType =
      activeFilters.length > 0 ? newTaskTemplates.filter(task => activeFilters.includes(task.icon)) : newTaskTemplates;
    setTasksToDisplay(matchSorter(tasksFilteredByType, searchQuery, { keys: ["category", "name"] }));
  }, [taskTemplates, showArchived, activeFilters, searchQuery]);

  const tasksByCategory = categories.map(category => ({
    name: category,
    tasks: sortBy(tasksToDisplay.filter(task => capitalize(task.category) === category).sort(), "name")
  }));

  const handleOnSearchInputChange = e => {
    const searchQuery = e.target.value;
    setSearchQuery(searchQuery);
    setTasksToDisplay(matchSorter(taskTemplates, searchQuery, { keys: ["category", "name"] }));
  };

  const handleCheckboxListChange = (checked, label) => {
    let filtersState = [].concat(activeFilters);

    let newFilters = [];
    let hasFilter = Boolean(filtersState.find(filter => filter === label));
    if (hasFilter) newFilters = filtersState.filter(filter => filter !== label);
    else newFilters = filtersState.concat(label);
    setActiveFilters(newFilters);
  };

  const handleClearFilters = () => {
    setShowArchived(false);
    setActiveFilters([]);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Task manager</h1>
      <p className={styles.description}>{description}</p>
      <div className={styles.tasksContainer}>
        <div className={styles.addTaskContainer}>
          <p className={styles.existingTasks}>{`Existing Tasks (${taskTemplates.length})`}</p>
          <AddTaskTemplate
            addTemplateInState={addTemplateInState}
            taskTemplates={taskTemplates}
            history={history}
            location={location}
          />
        </div>
        <section className={styles.tools}>
          <Search
            small
            labelText="Search for a task"
            onChange={handleOnSearchInputChange}
            placeHolderText="Search for a task"
            value={searchQuery}
          />
          <OverflowMenu
            renderIcon={SettingsAdjust20}
            style={{
              backgroundColor: showArchived || activeFilters.length > 0 ? "#3DDBD9" : "initial",
              borderRadius: "0.25rem"
            }}
            flipped={true}
            menuOptionsClass={styles.filters}
          >
            <section className={styles.filterHeader}>
              <p className={styles.filterTitle}>Filters</p>
              <button className={styles.resetFilter} onClick={handleClearFilters}>
                Reset filters
              </button>
            </section>
            <section className={styles.filter}>
              <Checkbox
                id="archived-tasks"
                labelText="Show Archived Tasks"
                checked={showArchived}
                onChange={() => setShowArchived(!showArchived)}
              />
            </section>
            <section className={styles.filter}>
              <p className={styles.sectionTitle}>Filter by Task Type</p>
              <CheckboxList
                selectedItems={activeFilters}
                options={taskFilters}
                onChange={(...args) => handleCheckboxListChange(...args)}
              />
            </section>
          </OverflowMenu>
        </section>
        <div className={styles.tasksInfo}>
          <p className={styles.info}>{`Showing ${tasksToDisplay.length} tasks`}</p>
          <button className={styles.expandCollapse} onClick={() => setOpenCategories(!openCategories)}>
            {openCategories ? "Collapse all" : "Expand all"}
          </button>
        </div>
      </div>
      <Accordion>
        {tasksByCategory.map((category, index) => {
          return (
            <AccordionItem
              title={`${category.name} (${category.tasks.length})`}
              open={openCategories}
              key={`${category.name}${index}`}
            >
              {category.tasks.map(task => (
                <Task key={task.id} task={task} isActive={globalMatch?.params?.taskTemplateId === task.id} />
              ))}
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
function Task(props) {
  const { task } = props;
  const taskIcon = taskIcons.find(icon => icon.iconName === task.icon);
  const isActive = task.status === TaskTemplateStatus.Active;

  return (
    <Link
      className={cx(styles.task, { [styles.active]: props.isActive })}
      to={appLink.taskTemplateEdit({ id: task.id, version: task.currentVersion })}
      id={task.id}
    >
      {taskIcon ? <taskIcon.icon /> : <Bee16 />}
      <p className={cx(styles.taskName, { [styles.active]: props.isActive })}>{task.name}</p>
      {!isActive && <ViewOff16 style={{ marginLeft: "auto" }} />}
    </Link>
  );
}

export default SideInfo;
