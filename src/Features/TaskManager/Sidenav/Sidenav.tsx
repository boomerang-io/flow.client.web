import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import sortBy from "lodash/sortBy";
import { matchSorter } from "match-sorter";
import { Accordion, AccordionItem, Checkbox, Layer, OverflowMenu, Search, SkeletonText } from "@carbon/react";
import {
  CheckboxList,
  FeatureSideNav as SideNav,
  FeatureSideNavLink as SideNavLink,
  FeatureSideNavLinks as SideNavLinks,
  TooltipHover,
} from "@boomerang-io/carbon-addons-boomerang-react";
import AddTaskTemplate from "./AddTaskTemplate";
import { appLink } from "Config/appConfig";
import { TaskTemplateStatus } from "Constants";
import { taskIcons } from "Utils/taskIcons";
import { Bee, ViewOff, Recommend, SettingsAdjust } from "@carbon/react/icons";
import { FlowTeam, TaskTemplate } from "Types";
import styles from "./sideInfo.module.scss";

const DESCRIPTION = "Create and import tasks to add to the Workflow Editor task list";

const taskFilterElemList = taskIcons.map((TaskIcon) => ({
  id: TaskIcon.name,
  labelText: (
    <div className={styles.checkboxOption}>
      <TaskIcon.Icon /> <p>{TaskIcon.name}</p>{" "}
    </div>
  ),
}));

interface SideInfoProps {
  team?: FlowTeam;
  isLoading?: boolean;
  taskTemplates?: Record<string, TaskTemplate[]>;
  getTaskTemplatesUrl: string;
}

const SideInfo: React.FC<SideInfoProps> = ({ team, isLoading, taskTemplates, getTaskTemplatesUrl }) => {
  const history = useHistory();
  const location = useLocation();
  const [activeFilters, setActiveFilters] = React.useState<Array<string>>([]);
  const [openCategories, setOpenCategories] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showArchived, setShowArchived] = React.useState(false);
  const [showVerified, setShowVerified] = React.useState(false);

  const handleOnSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setSearchQuery(searchQuery);
  };

  const handleCheckboxListChange = (_: boolean, label: string) => {
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

  if (isLoading) {
    return (
      <SideNav className={styles.container} border="right">
        <h1 className={styles.title}>{team ? "Team " : ""}Task manager</h1>
        <p className={styles.description}>{DESCRIPTION}</p>
        <div style={{ padding: "1.5rem 1rem" }}>
          <SkeletonText />
          <SkeletonText />
          <SkeletonText />
          <SkeletonText />
          <SkeletonText />
        </div>
      </SideNav>
    );
  }

  // List of distinct task names by latest version
  let tasksToDisplay = Object.values(taskTemplates).map((taskList) => taskList[0]);

  // List of categories
  let categories = tasksToDisplay
    ?.reduce((acc: string[], task: TaskTemplate) => {
      const newCategory = !acc.find((category) => task.category === category);
      if (newCategory) acc.push(task.category);
      return acc;
    }, [])
    .sort();

  // Apply various filters
  const tempTaskTemplates = showVerified ? tasksToDisplay.filter((task) => task.verified === true) : tasksToDisplay;

  const newTaskTemplates = showArchived
    ? tempTaskTemplates
    : tempTaskTemplates?.filter((task) => task.status === TaskTemplateStatus.Active);

  const tasksFilteredByType =
    activeFilters.length > 0 ? newTaskTemplates?.filter((task) => activeFilters.includes(task.icon)) : newTaskTemplates;

  const filteredTasksToDisplay = matchSorter(tasksFilteredByType, searchQuery, { keys: ["category", "displayName"] });

  const tasksByCategory = categories?.map((category) => ({
    name: category,
    tasks: sortBy(filteredTasksToDisplay.filter((task) => task.category === category).sort(), "displayName"),
  }));

  const distinctTaskNames = tasksToDisplay.map((taskTemplate) => taskTemplate.name);

  return (
    <SideNav className={styles.container} border="right">
      <h1 className={styles.title}>{team ? "Team " : ""}Task manager</h1>
      <p className={styles.description}>{DESCRIPTION}</p>
      {tasksToDisplay && (
        <div className={styles.tasksContainer}>
          <div className={styles.addTaskContainer}>
            <p className={styles.existingTasks}>{`Existing Tasks (${tasksToDisplay.length})`}</p>
            <AddTaskTemplate
              taskTemplateNames={distinctTaskNames}
              history={history}
              location={location}
              getTaskTemplatesUrl={getTaskTemplatesUrl}
            />
          </div>
          <Layer className={styles.tools}>
            <Search
              data-testid="task-templates-search"
              id="task-templates-search"
              size="sm"
              labelText="Search for a task"
              onChange={handleOnSearchInputChange}
              placeholder="Search for a task"
              value={searchQuery}
            />
            <OverflowMenu
              ariaLabel="Filter"
              renderIcon={SettingsAdjust}
              style={{
                backgroundColor: showVerified || showArchived || activeFilters.length > 0 ? "#3DDBD9" : "initial",
                borderRadius: "0.25rem",
              }}
              flipped={true}
              menuOptionsClass={styles.filters}
              size="sm"
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
                      <Recommend fill="#0072C3" style={{ willChange: "auto" }} /> <p>Verified Tasks</p>
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
                  options={taskFilterElemList}
                  onChange={(checked: boolean, label: string) => handleCheckboxListChange(checked, label)}
                />
              </section>
            </OverflowMenu>
          </Layer>
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
                  {category.tasks.length > 0 ? (
                    category.tasks.map((task) => (
                      //@ts-ignore
                      <Task key={task.name} task={task} team={team ?? null} />
                    ))
                  ) : (
                    <EmptyTask key={`${category.name}-empty`} />
                  )}
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
  task: TaskTemplate;
  activeTeam?: FlowTeam | null;
}
const Task: React.FC<TaskProps> = (props) => {
  const { task, activeTeam } = props;
  const TaskIcon = taskIcons.find((icon) => icon.name === task.icon);
  const taskIsActive = task.status === TaskTemplateStatus.Active;

  return (
    <SideNavLink
      to={
        activeTeam
          ? appLink.manageTaskTemplateEdit({
              teamId: team.id,
              name: task.name,
              version: task.version.toString(),
            })
          : appLink.taskTemplateDetail({
              name: task.name,
              version: task.version.toString(),
            })
      }
      icon={TaskIcon ? TaskIcon.Icon : Bee}
    >
      <div className={styles.task}>
        <p>{task.displayName}</p>
        {(task.verified || !taskIsActive) && (
          <div className={styles.iconContainer}>
            {!taskIsActive && (
              <TooltipHover direction="top" tooltipText="Archived Task">
                <ViewOff fill="#4d5358" />
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
                <Recommend />
              </TooltipHover>
            )}
          </div>
        )}
      </div>
    </SideNavLink>
  );
};

//TODO make the below a part of the empty state of the component in the add-ons
const EmptyTask: React.FC = () => {
  return (
    <div className={`cds--bmrg-feature-sidenav-link`}>
      <div className={`cds--bmrg-feature-sidenav-link-content`}>
        <div className={styles.task}>
          <p>There are no tasks for this category. This may be due to filters applied.</p>
        </div>
      </div>
    </div>
  );
};

export default SideInfo;
