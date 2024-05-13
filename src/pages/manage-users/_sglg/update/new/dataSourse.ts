export const dataInputMethod = [
  { value: "null", label: "None" },
  {
    value: "radio_button",
    label: "Single Selection",
  },
  {
    value: "check_box",
    label: "Multiple Selection",
  },

  {
    value: "num:null:0",
    label: "Number",
  },
  {
    value: "str:null:0",
    label: "Text",
  },
  {
    value: "date",
    label: "Date",
  },
];
export const mov = [
  { value: "null", label: "None" },
  { value: "any", label: "Files" },
];

export const requirementConditions = [
  { value: "any", label: "Any of the selected indicators." },
  { value: "must", label: "Must of all the selected indicators." },
  { value: "all", label: "All of the indicators." },
  { value: "selected", label: "Only selected indicators." },
  { value: "modify:data", label: "- Modify." },
];
