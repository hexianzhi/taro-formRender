import { View } from "@tarojs/components";
import React, { Component } from "react";
import FormRender from "./formRender";
import "./index.scss";

const formData = [
  {
    key: "a",
    title: "地址",
    type: "input",
    required: true,
    // 注入组件
    typeProps: {
      title: "地址",
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

export default class Index extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      formValue: {},
      formSchema: formData,
    };
  }

  onChange = (newValue) => {
    this.setState({
      formValue: newValue,
    });
  };

  render() {
    const { formValue, formSchema } = this.state;
    return (
      <View className="index">
        <FormRender
          formValue={formValue}
          formSchema={formSchema}
          onChange={this.onChange}
        ></FormRender>
      </View>
    );
  }
}
