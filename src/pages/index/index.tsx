/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/sort-comp */
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import cloneDeep from "lodash.clonedeep";
import { AtButton } from "taro-ui";
import React, { Component } from "react";
import FormRender from "./formRender";
import { getFormData } from "./formData";
// import "./index.scss";

export default class Index extends Component<any, any> {
  formRef = React.createRef<any>();

  constructor(props) {
    super(props);
    console.log("this: ", this);
    this.state = {
      customerInfo: {},
      allFormData: getFormData.apply(this),
    };
  }

  onChange = (value, key) => {
    // console.log("Index value, key: ", value, key);
    const { customerInfo } = this.state;
    this.setState(
      {
        customerInfo: { ...customerInfo, [key]: value },
      },
      () => {}
    );
  };

  //新增客源
  submit = async () => {
    const canSubmit = this.formRef.current.validate();
    console.log("canSubmit: ", canSubmit);
    if (!canSubmit) return;
  };

  // 改变某个数据源数据
  changeSingleFormData = (key, newData, name, childName) => {
    const { allFormData } = this.state;
    // const _allFormData = allFormData.slice(); // TODO 导致FormRender React.memo 的 pre字段也改变了
    const _allFormData = cloneDeep(allFormData);
    const item = _allFormData.find((i) => i.key === key);
    if (!item) return;
    if (childName && name) {
      if (!item[name]) item[name] = {};
      item[name][childName] = newData;
    } else if (name) {
      item[name] = newData;
    }

    this.setState({ allFormData: _allFormData });
  };

  render() {
    const { customerInfo, allFormData } = this.state;
    // console.log("customerInfo: ", customerInfo);
    // console.log("allFormData: ", allFormData);

    return (
      <View className="index">
        <FormRender
          ref={this.formRef}
          formValue={customerInfo}
          formSchema={allFormData}
          onChange={this.onChange}
        ></FormRender>
        <AtButton
          customStyle={{ marginTop: 20 }}
          type="primary"
          onClick={() => this.submit()}
        >
          确定
        </AtButton>
      </View>
    );
  }
}
