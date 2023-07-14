import { TaskTemplate } from "Types";

export function emailIsValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

//helper function to replace empty strings with null values
export const swapValue = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === "") {
      obj[key] = null;
    }
  });
};

export function groupTaskTemplatesByName(taskTemplates: TaskTemplate[]) {
  return taskTemplates.reduce(
    (acc: Record<string, TaskTemplate[]>, task: TaskTemplate) => {
      if (acc[task.name]) {
        acc[task.name].push(task);
        acc[task.name].sort((a, b) => b.version - a.version);
      } else {
        acc[task.name] = [task];
      }
      return acc;
    },
    {}
  )
}
