import isURL from "validator/lib/isURL";

export const INPUT_TYPES = {
  text: { type: "text", validationFunction: () => {}, validationText: "" },
  password: { type: "password", validationFunction: () => {}, validationText: "" },
  url: { type: "input", validationFunction: isURL, validationText: "Please enter a valid url" },
};

export const TEXT_AREA_TYPES = {
  textarea: { type: "textarea", validationFunction: () => {}, validationText: "" },
  texteditor: { type: "texteditor", validationFunction: () => {}, validationText: "" },
};

export const SELECT_TYPES = {
  select: { type: "select", isMultiselect: false },
  multiselect: { type: "multiselect", isMultiselect: true },
};
