import { AtInput as input, AtSwitch as atSwitch } from "taro-ui";
import textarea from "./AtTextarea";
import picker from "./picker";


/** 高阶组件，优化 onChange event */
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

export const DefaultWidgetNameList = Object.keys(Widgets);
