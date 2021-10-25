import { AtInput as input, AtSwitch as atSwitch  } from "taro-ui";
import textarea from "./AtTextarea";
import picker from "./picker";

export const Widgets = {
  input,
  atSwitch,
  textarea,
  picker,
};

export const defaultWidgetNameList = Object.keys(Widgets);
