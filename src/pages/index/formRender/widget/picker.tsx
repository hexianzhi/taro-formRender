import { View, Text, Picker } from "@tarojs/components";
import React from "react";

// 注意名字
const FrPicker = (props) => {
  const { value, item, onChange } = props;
  const { typeProps = {}, title } = item;

  const onPickerChange = (e) => {
    const _value = e.detail.value;
    const { mode, range } = typeProps || {};
    if (mode === "multiSelector") {
      const [left, right] = _value;
      onChange([range[0][left], range[1][right]]);
    }
    if (mode === "selector") {
      onChange(range[_value]);
    }
  };

  return (
    <>
      <Text className="fr-item-label">{title}</Text>
      <Picker className="picker-com" onChange={onPickerChange} {...typeProps}>
        <Text>{value || "请选择"}</Text>
      </Picker>
    </>
  );
};

export default React.memo(FrPicker);
