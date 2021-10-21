// import { useForceUpdate } from "@/hook/useForceUpdate";
// import { useSet } from "@/hook/useSet";
import { Picker, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { debounce } from "debounce";
import React, { forwardRef, useImperativeHandle } from "react";
import "./index.scss";
import { getClsOrStyle, getStatus } from "./utils";
import {
  DefaultValidateTypeMsgMap,
  isEmptyValue,
  requiredRuleMsg,
} from "./validate";
import { Widgets } from "./widget";

const FormRender = ({ formSchema, formValue = {}, onChange }, ref) => {
  // const [state, setState] = useSet({
  //   isOpenLayout: false,
  // });

  // const { update } = useForceUpdate();

  useImperativeHandle(ref, () => ({
    validate,
  }));

  /**
   * 1. 验证必填项
   * 2. 验证 rules: 1. pattern 正则 2. validate 自定义方法
   *
   * @returns
   */
  const validate = () => {
    try {
      formSchema.forEach((schema) => {
        let isSuccess = true;
        const value = formValue[schema.key];
        // required单独拿出来处理
        if (schema.required) {
          if (Array.isArray(value)) {
            isSuccess =
              value.length > 0 && value.every((vv) => !isEmptyValue(vv));
          }
          if (isEmptyValue(value)) {
            isSuccess = false;
          }
          if (!isSuccess) {
            const msg =
              requiredRuleMsg(schema) ||
              DefaultValidateTypeMsgMap[schema.type] + schema.title ||
              schema.title + "必填";

            throw msg;
            // 抛出是为了从第一个开始提示
            // TODO 或者是全都提示?分别给错误样式？？
            // 实时校验？
          }
        }

        // 有值才判断正则
        if (value && schema.rules && schema.rules.length) {
          schema.rules.some((rule) => {
            if (rule.pattern && !new RegExp(rule.pattern).test(value))
              isSuccess = false;
            if (rule.validate && !rule.validate(value)) isSuccess = false;
            if (!isSuccess) throw rule.message;
          });
        }
      });
    } catch (e) {
      Taro.showToast({ title: e, icon: "none" });
      return false;
    }
    return true;
  };

  const onAdapterChange = (value, key) => {
    if (typeof value === "object" && value.detail.value) {
      value = value.detail.value;
    }
    onChange(value, key);
  };

  const renderItem = (item) => {
    if (!item) return;
    const { type, typeProps, key, title, render, extra } = item || {};
    const { hidden } = getStatus(item, formValue, formSchema);
    if (!type) {
      throw `${title}字段没有 type,无法渲染`;
    }
    if (hidden) {
      return null;
    }
    const value = formValue[key];

    const tempChange = (v) => onAdapterChange(v, key); // 注入 key
    const compProps = {
      item,
      value,
      formSchema,
      onChange: tempChange,

      ...typeProps, // 是否控制一下？
    };
    console.log("compProps: ", compProps);

    let Compoment = Widgets[type];
    // 自定义
    if (type === "custom") {
      Compoment = render(value, item, tempChange);
    }

    const { itemCls, itemStyle } = getClsOrStyle(item, formValue);
    return (
      <View className={itemCls} style={itemStyle}>
        <Compoment {...compProps}></Compoment>
        {extra}
      </View>
    );
  };

  return (
    <View className="com-formRender">
      {formSchema.map((v) => renderItem(v))}
    </View>
  );
};

export default React.memo(forwardRef(FormRender));
