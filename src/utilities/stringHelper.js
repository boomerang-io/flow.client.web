export const stringToPassword = str => {
  return str.replace(new RegExp(".", "g"), "•");
};
