/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/sort-comp */
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import cloneDeep from "lodash.clonedeep";
import React, { Component } from "react";
import FormRender from "./formRender";
import { formData } from "./formData";
import "./index.scss";

export default class CustomersInfo extends Component<any, any> {
  formRef = React.useRef<any>();

  constructor(props) {
    super(props);
    // console.log('this.params: ', this.params)
    this.state = {
      /** 表单数据。 所有 storage 中的数据都要放到 customerInfo 中 */
      customerInfo: {},
      allFormData: cloneDeep(formData),
    };
  }

  async componentDidMount() {}

  componentDidShow() {}

  onChange = (key, value) => {
    const { customerInfo } = this.state;
    const oldValue = customerInfo[key];
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

  showClientDemandType = () => {
    const { allFormData, customerInfo } = this.state;
    const _formData = allFormData.slice(0);
    const item = _formData.find((v) => v.key === "client_demand_type");
    if (customerInfo.type === "求购") {
      item.required = true;
    } else {
      item.required = false;
    }
    this.setState({ formData: _formData });
  };

  onPickerColumnChange = (e, item) => {
    const { key, widgetProps } = item;
    if (!widgetProps.isColumnChange) return;
    // 因为是获取到 value 左侧值，所以 allRangeObj 设计数据结构成 {a: ["a1", 'a2'], b: ['b1', 'b2']}
    //  allRangeObj eg: {a: ["a1", 'a2'], b: ['b1', 'b2']}
    const { allRangeObj } = widgetProps;
    // console.log('allRangeObj: ', allRangeObj)
    const { column, value } = e.detail;
    if (!column) {
      this.changeSingleFormData(
        key,
        [
          Object.keys(allRangeObj),
          allRangeObj[Object.keys(allRangeObj)[value]],
        ],
        "widgetProps",
        "range"
      );
    }
  };

  // 改变某个数据源数据
  changeSingleFormData = (key, newData, name, childName) => {
    const { allFormData } = this.state;
    const _allFormData = allFormData.slice();
    const item = _allFormData.find((i) => i.key === key);
    if (!item) return;
    if (childName && name) {
      if (!item[name]) item[name] = {};
      item[name][childName] = newData;
    } else if (name) {
      item[name] = newData;
    }
    // console.log('changeSingleFormData item: ', item)
    this.setState({ allFormData: _allFormData });
  };

  render() {
    const { customerInfo, allFormData } = this.state;
    console.log("customerInfo: ", customerInfo);
    // console.log('allFormData: ', allFormData)
    // console.log('this.state: ', this.state)

    return (
      <View className="customer_info">
        <FormRender
          ref={this.formRef}
          formValue={customerInfo}
          formSchema={allFormData}
          onChange={this.onChange}
        ></FormRender>
      </View>
    );
  }
}
