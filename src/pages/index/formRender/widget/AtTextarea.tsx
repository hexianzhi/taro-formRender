import { View, Text } from "@tarojs/components";

const AtTextarea = ({ item, formValue, onchange }) => {
  const { typeProps, key, name, required } = item;
  const value = formValue[key];

  return (
    <>
      <View className="textarea-title">
        {name}
        {required && <Text style={{ color: "red" }}>*</Text>}
      </View>
      <AtTextarea
        className="textarea-content"
        value={value || ""}
        onChange={(v) => onchange(key, v)}
        {...typeProps}
      />
    </>
  );
};

export default AtTextarea;
