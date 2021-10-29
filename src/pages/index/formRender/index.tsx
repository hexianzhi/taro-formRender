// import { useForceUpdate } from "@/hook/useForceUpdate";
// import { useSet } from "@/hook/useSet";
import { View } from "@tarojs/components";
import { isEqual } from "lodash";
import React, { forwardRef, useImperativeHandle } from "react";
import "./index.scss";
import { FRProps } from "./type";
import { getClsOrStyle, getStatus } from "./utils";
import { validate } from "./validate";
import { Widgets } from "./widget/index";

const FormRender = ({ formSchema, formValue = {}, onChange }: FRProps, ref) => {
  useImperativeHandle(ref, () => ({
    validate: _validate,
  }));
  const _validate = () => validate(formValue, formSchema);

  const renderItem = (item, index) => {
    if (!item) return;
    const { type, typeProps, key, title, render, extra } = item || {};
    const { hidden, required, disabled } = getStatus(
      item,
      formValue,
      formSchema
    );
    const { itemCls, itemStyle } = getClsOrStyle(item, formValue);
    if (!type) {
      throw `${title}字段没有 type,无法渲染`;
    }
    if (hidden) {
      return null;
    }

    const value = formValue[key];
    const tempChange = (v) => onChange({ ...formValue, [key]: v }, v, key); // 注入 key
    const compProps = {
      item: { ...item, required, hidden, disabled },
      value,
      formValue,
      formSchema,
      onChange: tempChange,
      ...typeProps,
    };

    let Compoment = Widgets[type];
    // console.log("Compoment: ", Compoment);
    // 自定义
    if (type === "custom") {
      Compoment = render(formValue, formSchema, tempChange);
    }

    return (
      <View className={itemCls} style={itemStyle} key={index}>
        <Compoment {...compProps}></Compoment>
        {extra}
      </View>
    );
  };

  return (
    <View className="com-formRender">
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
