//mock parameters that will be deleted when service is implemented
export const inputs = [
  {
    id: "1",
    name: "input1",
    description: "This is a description",
    label: "label1",
    required: true,
    type: "textInput",
    defaultValue: "Test default value"
  },
  {
    id: "2",
    name: "input2",
    description: "This is another description",
    label: "label2",
    required: false,
    type: "textAreaBox",
    defaultValue: "Test default value"
  },
  {
    id: "3",
    name: "input3",
    description: "And another description",
    label: "label3",
    required: true,
    type: "boolean",
    defaultValue: false
  },
  {
    id: "4",
    name: "input4",
    description: "This is a bigger description, clearly bigger than the other descriptions from here",
    label: "label4",
    required: false,
    type: "password",
    defaultValue: "****"
  },
  {
    id: "5",
    name: "input5",
    description: "Thre are a lot of descriptions",
    label: "label5",
    required: true,
    type: "number",
    defaultValue: 142857
  },
  {
    id: "6",
    name: "input6",
    description: "This is the final description",
    label: "label6",
    required: false,
    type: "select",
    defaultValue: ["option1", "option2"]
  }
];
