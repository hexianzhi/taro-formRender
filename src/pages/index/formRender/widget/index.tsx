import { AtInput as input, AtSwitch as atSwitch } from "taro-ui";
import textarea from "./AtTextarea";
import picker from "./picker";

const withEventValue = (Component) => (props) => {
  const { onChange } = props;
  const onEventChange = (e) => {
    onChange(e.detail.value);
  };
  return <Component {...props} onChange={onEventChange}></Component>;
};

export const Widgets = {
  input,
  atSwitch,
  textarea,
  picker,
};

export const defaultWidgetNameList = Object.keys(Widgets);
