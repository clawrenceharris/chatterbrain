export type ScenarioVariableType =
  | "text"
  | "textarea"
  | "select"
  | "multiselect"
  | "number";

export type ScenarioVariable = {
  id: string;
  label: string;
  type: ScenarioVariableType;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  defaultValue?: string;
};
