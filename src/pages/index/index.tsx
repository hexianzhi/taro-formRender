import { Button, View } from "@tarojs/components";
import React, { useRef, useState } from "react";
import FormRender from "./formRender";
import "./index.scss";

const formData = [
  {
    key: "a",
    title: "地址",
    type: "input",
    required: true,
    typeProps: {
      placeholder: "请输入",
    },
  },
  {
    key: "c",
    title: "国家",
    type: "picker",
    typeProps: {
      mode: "selector",
      range: ["美国", "中国", "巴西", "日本"],
    },
  },
  {
    key: "b",
    title: "备注",
    type: "textarea",
  },
];

export default function (props) {
  const formRef = useRef<any>();
  const [formValue, setformValue] = useState({});
  const [formSchema, setformSchema] = useState(formData);

  const onChange = (newValue) => {
    setformValue(newValue);
  };
  const onSubmit = () => {
    const isValid = formRef.current.validate();
    console.log("isValid: ", isValid);
  };

  return (
    <View className="index">
      <FormRender
        ref={formRef}
        formValue={formValue}
        formSchema={formSchema}
        onChange={onChange}
      ></FormRender>
      <Button onClick={onSubmit}>提交</Button>
    </View>
  );
}
