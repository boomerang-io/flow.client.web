import React from "react";
import PropTypes from "prop-types";
import { useHistory, matchPath, useLocation } from "react-router-dom";
// import axios from "axios";
import cx from "classnames";
import capitalize from "lodash/capitalize";
import { Search, Accordion, AccordionItem } from "@boomerang/carbon-addons-boomerang-react";
import matchSorter from "match-sorter";
import { Bee16 } from "@carbon/icons-react";
import AddTaskTemplate from "./AddTaskTemplate";
import { appLink } from "Config/appConfig";
import taskTemplateIcons from "Assets/taskTemplateIcons";
import styles from "./sideInfo.module.scss";

SideInfo.propTypes = {
  tasks: PropTypes.array.isRequired,
  addTemplateInState: PropTypes.func.isRequired
};
const description = "Create and import tasks to add to the Flow Editor task list";

export function SideInfo({ taskTemplates, addTemplateInState }) {
  const [ searchQuery, setSearchQuery ] = React.useState();
  // const [ activeFilters, setActiveFilters ] = React.useState();
  const [ tasksToDisplay, setTasksToDisplay ] = React.useState(taskTemplates);
  const [ openCategories, setOpenCategories ] = React.useState(false);

  
  const history = useHistory();
  const location = useLocation();
  const globalMatch = matchPath(location.pathname, { path: "/task-templates/:taskTemplateId/:version" });

  const categories = tasksToDisplay.reduce((acc, task) => {
    const newCategory = !acc.find(category => task.category.toLowerCase() === category?.toLowerCase());
    if(newCategory)
      acc.push(capitalize(task.category))
    return acc;
  },[]);

  React.useEffect(() => {
    setSearchQuery("");
    setTasksToDisplay(taskTemplates);
  },[taskTemplates]);

  const tasksByCategory = categories.map(category =>({ name: category, tasks:tasksToDisplay.filter(task => capitalize(task.category) === category)}));

  const handleOnSearchInputChange = e => {
    const searchQuery = e.target.value;
    setSearchQuery(searchQuery);
    setTasksToDisplay(matchSorter(taskTemplates, searchQuery, { keys: ["category", "name"] }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Task manager</h1>
      <p className={styles.description}>{description}</p>
      <div className={styles.tasksContainer}>
      <div className={styles.addTaskContainer}>
        <p className={styles.existingTasks}>{`Existing Tasks (${taskTemplates.length})`}</p>
        <AddTaskTemplate addTemplateInState={addTemplateInState} taskTemplates={taskTemplates} history={history} location={location}/>
      </div>
      <section className={styles.tools}>
        <Search
          small
          labelText="Search for a task"
          onChange={handleOnSearchInputChange}
          placeHolderText="Search for a task"
          value={searchQuery}
        />
        {/* <OverflowMenu renderIcon={SettingsAdjust20} flipped={true}>
          <CheckboxList
            initialSelectedItems={activeFilters}
            options={this.state.uniqueTaskTypes}
            onChange={(...args) => this.handleCheckboxListChange(...args)}
          />
        </OverflowMenu> */}
      </section>
      <div className={styles.tasksInfo}>
        <p className={styles.info}>{`Showing ${tasksToDisplay.length} tasks`}</p>
        <button addTemplateInState={addTemplateInState} className={styles.expandCollapse} onClick={() => setOpenCategories(!openCategories)}>{openCategories? "Collapse all" : "Expand all"}</button>
      </div>
      
      </div>
        <Accordion align="end" className={styles.accordion}>
        {
          tasksByCategory.map(category => {
            return(
              <AccordionItem title={`${category.name} (${category.tasks.length})`} open={openCategories}>
                {
                  category.tasks.map(task => (
                    <Task 
                      task={task}
                      history={history}
                      isActive={globalMatch?.params?.taskTemplateId === task.id}
                    />
                  ))
                }
              </AccordionItem>
            );
          })
        }
        </Accordion>
      </div>
  );
}
function Task(props) {
  const { task, history } = props;
  const taskIcon = taskTemplateIcons.find(icon => icon.name === task.revisions[task.revisions.length - 1].image);
  return (
    <button
      className={cx(styles.task, { [styles.active]: props.isActive })}
      onClick={() => history.push(appLink.taskTemplateEdit({id: task.id, version: task.currentVersion}))}
    >
     { 
      taskIcon?
      <taskIcon.src style={{width:"1rem", height:"1rem"}}/>
      :
      <Bee16 />}
      <p className={cx(styles.taskName, { [styles.active]: props.isActive })}>{task.name}</p>
    </button>
  );
}


export default SideInfo;
