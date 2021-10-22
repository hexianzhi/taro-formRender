import { View, Text, Picker } from "@tarojs/components";
import React from 'react'

// 注意名字
const FrPicker = (props) => {
  const { value, item, onChange } = props;
  const { typeProps = {}, title, required } = item;
  // console.log("typeProps: ", typeProps);
  // const { onColumnChange } = typeProps;

  const onPickerChange = (e) => {
    const _value = e.detail.value;
    const { mode, range } = typeProps || {};
    if (mode === "multiSelector") {
      // _value 为索引
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
      <Picker
        className="picker-com"
        {...typeProps}
        onChange={onPickerChange}
        // onColumnChange={(e) => onColumnChange(e, item)}
      >
        <Text>{value || "请选择"}</Text>
      </Picker>
    </View>
  );
};

export default React.memo(FrPicker);
