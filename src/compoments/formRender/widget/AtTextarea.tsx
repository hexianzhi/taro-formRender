import { View, Text } from "@tarojs/components";
import { AtTextarea } from "taro-ui";
import { IWidgetProps } from "../type";

const Textarea = (props: IWidgetProps) => {
  const { value, item, onChange } = props;
  const { typeProps = {}, title, required } = item;

  return (
    <>
      <View className="textarea-title">
        {title}
        {required && <Text style={{ color: "red" }}>*</Text>}
      </View>
      <AtTextarea
        className="textarea-content"
        value={value || ""}
        onChange={(v) => onChange(v)}
        {...typeProps}
      />
    </>
  );
};

export default Textarea;
