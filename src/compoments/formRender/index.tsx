// import { useForceUpdate } from "@/hook/useForceUpdate";
// import { useSet } from "@/hook/useSet";
import { View } from "@tarojs/components";
import { isEqual } from "lodash";
import React, { forwardRef, useImperativeHandle } from "react";
import "./index.scss";
import { FRProps, IWidgetProps } from "./type";
import { getClsOrStyle, transformFunctionItem } from "./utils";
import { validate } from "./validate";
import { Widgets } from "./widget/index";

// 支持函数表达式的字段
const SupportFunctionItem = ["title", "hidden", "required", "disabled"];
// 注入顶层props的字段
const injectCompKeys = ["title", "hidden", "required", "disabled"];

const FormRender = ({ formSchema, formValue = {}, onChange }: FRProps, ref) => {
  useImperativeHandle(ref, () => ({
    validate: _validate,
  }));

  const _validate = () => validate(formValue, formSchema);

  const renderItem = (item, index) => {
    if (!item) return;
    const { type, key, render, extra } = item || {};
    const funcItem = transformFunctionItem(
      item,
      formValue,
      formSchema,
      SupportFunctionItem
    );
    const { title, hidden } = funcItem;
    const { itemCls, itemStyle } = getClsOrStyle(item, formValue);
    if (!type) {
      throw `${title}字段没有 type,无法渲染`;
    }
    if (hidden) {
      return null;
    }

    const value = formValue[key];
    const tempChange = (v) => onChange({ ...formValue, [key]: v }, v, key); // 注入 key
    let compProps: IWidgetProps = {
      value,
      item: { ...item, funcItem },
      formValue,
      formSchema,
      onChange: tempChange,
    };

    // 展开 item 中指定字段到顶层props
    injectCompKeys.forEach((v) => {
      compProps[v] = funcItem[v];
    });

    let Compoment;
    if (type === "custom") {
      Compoment = render(formValue, formSchema, tempChange);
    } else {
      Compoment = Widgets[type];
    }
    if (!Compoment) {
      console.warn(`${key}字段的类型找不到，无法渲染`);
      return;
    }

    return (
      <View className={itemCls} style={itemStyle} key={index}>
        <Compoment {...compProps}></Compoment>
        {extra}
      </View>
    );
  };

  return (
    <View className="fr">
      {formSchema.map((v, index) => renderItem(v, index))}
    </View>
  );
};

const areEqual = (prev, current) => {
  if (
    isEqual(prev.formSchema, current.formSchema) &&
    isEqual(prev.formValue, current.formValue)
  ) {
    return true;
  }
  return false;
};

export default React.memo(forwardRef(FormRender), areEqual);
