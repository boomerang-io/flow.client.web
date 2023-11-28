import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAppContext } from "Hooks";
import sortBy from "lodash/sortBy";
import matchSorter from "match-sorter";
import {
  Accordion,
  AccordionItem,
  ComboBox,
  OverflowMenu,
  Checkbox,
  CheckboxList,
  FeatureSideNav as SideNav,
  FeatureSideNavLink as SideNavLink,
  FeatureSideNavLinks as SideNavLinks,
  Search,
  TooltipHover,
} from "@boomerang-io/carbon-addons-boomerang-react";
import AddTaskTemplate from "./AddTaskTemplate";
import { appLink } from "Config/appConfig";
import { Bee16, ViewOff16, Recommend16, SettingsAdjust20 } from "@carbon/icons-react";
import { taskIcons } from "Utils/taskIcons";
import { TaskTemplateStatus } from "Constants";
import { TaskModel } from "Types";
import styles from "./sideInfo.module.scss";

const DESCRIPTION = "Create and import tasks to add to the Flow Editor task list";

interface SideInfoProps {
  addTemplateInState: (newTemplate: TaskModel) => void;
  taskTemplates: TaskModel[];
  setActiveTeam: Function;
  activeTeam: string | string[] | null;
  canEditWorkflow: boolean;
}

const SideInfo: React.FC<SideInfoProps> = ({
  addTemplateInState,
  taskTemplates,
  setActiveTeam,
  activeTeam,
  canEditWorkflow,
}) => {
  const { teams } = useAppContext();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeFilters, setActiveFilters] = React.useState<Array<string>>([]);
  const [tasksToDisplay, setTasksToDisplay] = React.useState<Array<TaskModel>>(
    taskTemplates?.filter((task) => task.status === TaskTemplateStatus.Active) ?? []
  );
  const [openCategories, setOpenCategories] = React.useState(false);
  const [showArchived, setShowArchived] = React.useState(false);
  const [showVerified, setShowVerified] = React.useState(false);

  const taskFilters = taskIcons.map((TaskIcon) => ({
    id: TaskIcon.name,
    labelText: (
      <div className={styles.checkboxOption}>
        <TaskIcon.Icon /> <p>{TaskIcon.name}</p>{" "}
      </div>
    ),
  }));

  const history = useHistory();
  const location = useLocation();

  let categories = tasksToDisplay
    ?.reduce((acc: string[], task: TaskModel) => {
      const newCategory = !acc.find((category) => task.category === category);
      if (newCategory) acc.push(task.category);
      return acc;
    }, [])
    .sort();

  React.useEffect(() => {
    const tempTaskTemplates = showVerified ? taskTemplates.filter((task) => task.verified === true) : taskTemplates;
    const newTaskTemplates = showArchived
      ? tempTaskTemplates
      : tempTaskTemplates?.filter((task) => task.status === TaskTemplateStatus.Active);
    const tasksFilteredByType =
      activeFilters.length > 0
        ? newTaskTemplates?.filter((task) => activeFilters.includes(task.icon))
        : newTaskTemplates;
    setTasksToDisplay(matchSorter(tasksFilteredByType, searchQuery, { keys: ["category", "name"] }));
  }, [taskTemplates, showArchived, showVerified, activeFilters, searchQuery]);

  const tasksByCategory = categories?.map((category) => ({
    name: category,
    tasks: sortBy(tasksToDisplay.filter((task) => task.category === category).sort(), "name"),
  }));

  const handleOnSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setSearchQuery(searchQuery);
    setTasksToDisplay(matchSorter(taskTemplates, searchQuery, { keys: ["category", "name"] }));
  };

  const handleCheckboxListChange = (checked: boolean, label: string) => {
    let filtersState: string[] = [...activeFilters];

    let newFilters = [];
    let hasFilter = Boolean(filtersState.find((filter) => filter === label));
    if (hasFilter) newFilters = filtersState.filter((filter) => filter !== label);
    else newFilters = filtersState.concat(label);
    setActiveFilters(newFilters);
  };

  const handleClearFilters = () => {
    setShowArchived(false);
    setShowVerified(false);
    setActiveFilters([]);
  };

  const selectedTeam = teams.find((team) => team.id === activeTeam);

  const handleSelectTeam = (selectedTeam: any) => {
    if (selectedTeam && selectedTeam.selectedItem) {
      setActiveTeam(selectedTeam?.selectedItem?.id);
      history.push(appLink.manageTaskTemplates({ teamId: selectedTeam?.selectedItem?.id }));
    }
  };

  return (
    <SideNav className={styles.container} border="right">
      <h1 className={styles.title}>Task manager</h1>
      <p className={styles.description}>{DESCRIPTION}</p>
      <ComboBox
        id="dropdown-team"
        items={teams}
        onChange={handleSelectTeam}
        placeholder="Select a team"
        initialSelectedItem={selectedTeam}
        selectedItem={selectedTeam}
        ariaLabel="Select a team"
      />
      {taskTemplates && (
        <div className={styles.tasksContainer}>
          <div className={styles.addTaskContainer}>
            <p className={styles.existingTasks}>{`Existing Tasks (${taskTemplates.length})`}</p>
            {canEditWorkflow && (
              <AddTaskTemplate
                addTemplateInState={addTemplateInState}
                taskTemplates={taskTemplates}
                history={history}
                location={location}
              />
            )}
          </div>
          <section className={styles.tools}>
            <Search
              data-testid="task-templates-search"
              id="task-templates-search"
              size="sm"
              labelText="Search for a task"
              onChange={handleOnSearchInputChange}
              placeHolderText="Search for a task"
              value={searchQuery}
            />
            <OverflowMenu
              renderIcon={SettingsAdjust20}
              style={{
                backgroundColor: showVerified || showArchived || activeFilters.length > 0 ? "#3DDBD9" : "initial",
                borderRadius: "0.25rem",
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
                <Checkbox
                  id="verified-tasks"
                  labelText={
                    <div className={styles.checkboxOption}>
                      <Recommend16 fill="#0072C3" style={{ willChange: "auto" }} /> <p>Verified Tasks</p>
                    </div>
                  }
                  checked={showVerified}
                  onChange={() => setShowVerified(!showVerified)}
                />
              </section>
              <section className={styles.filter}>
                <p className={styles.sectionTitle}>Filter by Task Type</p>
                <CheckboxList
                  selectedItems={activeFilters}
                  options={taskFilters}
                  onChange={(checked: boolean, label: string) => handleCheckboxListChange(checked, label)}
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
      )}
      {taskTemplates && (
        <SideNavLinks>
          <Accordion>
            {tasksByCategory.map((category, index) => {
              return (
                <AccordionItem
                  className={styles.taskCategory}
                  title={`${category.name} (${category.tasks.length})`}
                  open={openCategories}
                  key={`${category.name}${index}`}
                >
                  {category.tasks.map((task) => (
                    //@ts-ignore
                    <Task
                      key={task.id}
                      task={task}
                      //@ts-ignore
                      isActive={activeTeam === task.id}
                      activeTeam={activeTeam}
                    />
                  ))}
                </AccordionItem>
              );
            })}
          </Accordion>
        </SideNavLinks>
      )}
    </SideNav>
  );
};

interface TaskProps {
  isActive: boolean;
  task: TaskModel;
  activeTeam: string | string[] | null;
}
const Task: React.FC<TaskProps> = (props) => {
  const { task, activeTeam } = props;
  const TaskIcon = taskIcons.find((icon) => icon.name === task.icon);
  const taskIsActive = task.status === TaskTemplateStatus.Active;

  return (
    <SideNavLink
      to={appLink.manageTaskTemplateEdit({
        teamId: activeTeam,
        taskId: task.id,
        version: task.currentVersion,
      })}
      icon={TaskIcon ? TaskIcon.Icon : Bee16}
    >
      <div className={styles.task}>
        <p>{task.name}</p>
        {(task.verified || !taskIsActive) && (
          <div className={styles.iconContainer}>
            {!taskIsActive && (
              <TooltipHover direction="top" tooltipText="Archived Task">
                <ViewOff16 fill="#4d5358" />
              </TooltipHover>
            )}
            {task.verified && (
              <TooltipHover
                direction="top"
                tooltipText={
                  <div className={styles.tooltipContainer}>
                    <strong>Verified</strong>
                    <p style={{ marginTop: "0.5rem" }}>
                      This task has been fully tested and verified right out of the box.
                    </p>
                  </div>
                }
              >
                <Recommend16 />
              </TooltipHover>
            )}
          </div>
        )}
      </div>
    </SideNavLink>
  );
};

export default SideInfo;
