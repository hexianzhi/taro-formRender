import { AtInput as input } from "taro-ui";
import textarea from "./AtTextarea";
import picker from "./picker";
export const Widgets = {
  input,
  textarea,
  picker
};

export const defaultWidgetNameList = Object.keys(Widgets);
