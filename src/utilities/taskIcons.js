import React from "react";
import {
  Concept20,
  Search16,
  CheckmarkOutline16,
  Restart16,
  Launch16,
  Terminal20,
  Power16,
  BackToTop16,
  Download16,
  Edit16,
  AddAlt16,
  CloseOutline16,
  Filter16
} from "@carbon/icons-react";

/**
 * Carbon Icon icon name to the conditions it matches for
 * @todo: think about giving startsWith precedence over includes
 */
const iconToTaskNames = [
  {
    //icon: "search",
    icon: <Search16 fill="#40D5BB" className="b-task-node__img" alt="Task node type" />,
    startsWithConditions: ["get"],
    includesConditions: ["read"]
  },
  {
    //icon: "checkmark--outline",
    icon: <CheckmarkOutline16 fill="#40D5BB" className="b-task-node__img" alt="Task node type" />,
    startsWithConditions: ["submit", "validate"],
    includesConditions: ["approval"]
  },
  {
    //icon: "restart",
    icon: <Restart16 fill="#40D5BB" className="b-task-node__img" alt="Task node type" />,
    startsWithConditions: ["update", "sync"],
    includesConditions: []
  },
  {
    //icon: "launch",
    icon: <Launch16 fill="#40D5BB" className="b-task-node__img" alt="Task node type" />,
    startsWithConditions: ["launch"],
    includesConditions: ["deploy"]
  },
  {
    //icon: "terminal",
    icon: <Terminal20 fill="#40D5BB" className="b-task-node__img" alt="Task node type" />,
    startsWithConditions: ["shell", "appcmd"],
    includesConditions: []
  },
  {
    //icon: "power",
    icon: <Power16 fill="#40D5BB" className="b-task-node__img" alt="Task node type" />,
    startsWithConditions: ["enable", "start", "activate"],
    includesConditions: []
  },
  {
    //icon: "back-to-top",
    icon: <BackToTop16 fill="#40D5BB" className="b-task-node__img" alt="Task node type" />,
    startsWithConditions: ["export"],
    includesConditions: []
  },
  {
    //icon: "download",
    icon: <Download16 fill="#40D5BB" className="b-task-node__img" alt="Task node type" />,
    startsWithConditions: [],
    includesConditions: ["download"]
  },
  {
    //icon: "edit",
    icon: <Edit16 fill="#40D5BB" className="b-task-node__img" alt="Task node type" />,
    startsWithConditions: [],
    includesConditions: ["edit", "define", "modify"]
  },
  {
    //icon: "add--outline",
    icon: <AddAlt16 fill="#40D5BB" className="b-task-node__img" alt="Task node type" />,
    startsWithConditions: ["create", "register"],
    includesConditions: []
  },
  {
    //icon: "close--outline",
    icon: <CloseOutline16 fill="#40D5BB" className="b-task-node__img" alt="Task node type" />,
    startsWithConditions: ["stop", "cancel", "disable", "terminate"],
    includesConditions: []
  },
  {
    //icon: "filter",
    icon: <Filter16 fill="#40D5BB" className="b-task-node__img" alt="Task node type" />,
    startsWithConditions: ["configure"],
    includesConditions: []
  }
];

/**
 *
 * @param {string} taskName
 * @return {string} Used in Carbon <Icon /> "name" prop
 */
export default function mapTaskNametoIcon(taskName) {
  const taskNameFormatted = taskName.toLowerCase();

  // Set default as fallback icon if none
  //let iconName = "predictive"; //not in carbon 10
  let iconName = <Concept20 fill="#40D5BB" className="b-task-node__img" alt="Task node type" />;

  // Some will iterate through array until true is returned
  iconToTaskNames.some(iconConfig => {
    if (iconConfig.startsWithConditions.find(condition => taskNameFormatted.startsWith(condition))) {
      iconName = iconConfig.icon;
      return true;
    }
    if (iconConfig.includesConditions.find(condition => taskNameFormatted.includes(condition))) {
      iconName = iconConfig.icon;
      return true;
    }
    return false;
  });

  return iconName;
}
