import { AtInput as input, AtSwitch as atSwitch } from "taro-ui";
import textarea from "./AtTextarea";
import picker from "./picker";

/**
 * 高阶组件，提取 onChange event 中的值
 */
const withOnchangeDetailValue = (Component) => (props) => {
  const { onChange } = props;
  const onEventChange = (e) => {
    onChange(e.detail.value);
  };
  return <Component {...props} onChange={onEventChange}></Component>;
};

/**
 * 高阶组件，把 typeProps 展开到顶层 props。
 *    如 input 组件中 typeProps 的 placeholder 等
 *    自定义组件自行展开即可
 */
const withItemToProps = (Component) => (props) => {
  const { item } = props;
  const { typeProps } = item;
  return <Component {...props} {...typeProps}></Component>;
};

export const Widgets = {
  input: withItemToProps(input),
  atSwitch,
  textarea,
  picker,
};

export const defaultWidgetNameList = Object.keys(Widgets);
