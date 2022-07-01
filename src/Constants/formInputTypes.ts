import isURL from "validator/lib/isURL";

export const INPUT_TYPES = Object.freeze({
  text: { type: "text", validationFunction: () => {}, validationText: "" },
  password: { type: "password", validationFunction: () => {}, validationText: "" },
  url: { type: "input", validationFunction: isURL, validationText: "Please enter a valid url" },
});

export const TEXT_AREA_TYPES = Object.freeze({
  textarea: { type: "textarea", validationFunction: () => {}, validationText: "" },
  texteditor: { type: "texteditor", validationFunction: () => {}, validationText: "" },
})

export const SELECT_TYPES = Object.freeze({
  select: { type: "select", isMultiselect: false },
  multiselect: { type: "multiselect", isMultiselect: true },
});
