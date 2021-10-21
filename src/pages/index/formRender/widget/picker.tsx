import { View, Text, Picker } from "@tarojs/components";

// 注意名字
const FrPicker = (props) => {
  const { value, item, onChange } = props;
  console.log("item: ", item);
  const { typeProps = {}, title, required } = item;

  const onPickerChange = (e) => {
    const _value = e.detail.value;
    console.log("_value: ", _value);

    const { mode, range } = typeProps || {};
    console.log("range: ", range);
    if (mode === "multiSelector") {
      const [left, right] = _value;
      onChange([range[0][left], range[1][right]]);
    }
    if (mode === "selector") {
      onChange(range[_value]);
    }
  };
  
  return (
    <View className="FrPicker">
      <Text>{title}</Text>
      <Picker className="picker-com" onChange={onPickerChange} {...typeProps}>
        <Text>{value || "请选择"}</Text>
      </Picker>
    </View>
  );
};

export default FrPicker;
