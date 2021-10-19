import { useForceUpdate } from "@/hook/useForceUpdate";
import { useSet } from "@/hook/useSet";
import { Picker, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { debounce } from "debounce";
import React, { forwardRef, useImperativeHandle } from "react";
import "./index.scss";
import { getClsOrStyle } from "./utils";
import {
  DefaultValidateTypeMsgMap, isEmptyValue,
  requiredRuleMsg
} from "./validate";
import Widget from "./widget";

const FormRender = ({ formSchema, formValue = {}, onChange }, ref) => {
  const [state, setState] = useSet({
    isOpenLayout: false,
  });

  const { update } = useForceUpdate();

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
              DefaultValidateTypeMsgMap[schema.type] + schema.name ||
              schema.name + "必填";

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

  const onDebounceChange = debounce(onChange, 200);

  const onPickerClick = (item) => {
    const { checkWidgetShow } = item;
    if (checkWidgetShow && !checkWidgetShow(formValue)) return;

    if (item.widget === "new-page") {
      const { url, urlParams, onJumpToNewPage } = item.widgetProps;
      // 数据传输支持回调形式/参数
      if (onJumpToNewPage) {
        onJumpToNewPage(item);
        return;
      }
      Taro.navigateTo({
        url: `${url}?${urlParams}`,
      });
    }
  };

  const onPickerChange = (e, item) => {
    const value = e.detail.value;
    let { key, widgetProps } = item;
    const { mode, range } = widgetProps || {};
    if (mode === "multiSelector") {
      const [left, right] = value;
      onChange(key, [range[0][left], range[1][right]]);
    }
    if (mode === "selector") {
      onChange(key, range[value]);
    }
  };

  // const onDebounceInputRangeChange = debounce(onInputRangeChange, 100);

  // 可以提前成单独的子组件。。但是我懒
  const renderItem = (item) => {
    if (!item) return;
    const { type, typeProps, key, name, required, render, extra } = item;
    const { unit } = typeProps || {};
    const { itemCls, itemStyle } = getClsOrStyle(item, formValue);
    const value = formValue[key];

    const compProps = { item, formValue, formSchema };
    if (!type) {
      throw `${name}字段没有 type,无法渲染`;
    }
    const Compoment = Widget[type];
    console.log("Compoment: ", Compoment);
    // TODO 切换成at 做成样例
    // if (type === "picker") {
    //   itemContent = renderPicker(item);
    // }
    // // 自定义
    // if (type === "custom") {
    //   itemContent = render(value, item, onChange);
    // }

    return (
      <View className={itemCls} style={itemStyle}>
        <Compoment {...compProps}></Compoment>
        {extra}
      </View>
    );
  };

  const renderPicker = (item) => {
    const { widget, widgetProps, key, name, required } = item;
    let { mode, widgetUnit } = widgetProps || {};
    const value = formValue[key];
    if (!widgetUnit) widgetUnit = "";
    let showValue = "";

    const cls = value ? "ellipsisText" : "ellipsisText phClass";

    return (
      <View
        className="card-content ellipsisText"
        onClick={() => onPickerClick(item)}
      >
        {widget === "picker" ? (
          <Picker
            className="picker-com"
            onChange={(e) => onPickerChange(e, item)}
            // onColumnChange={(e) => onPickerColumnChange(e, item)}
            {...widgetProps}
          >
            <Text className={showValue === "请选择" ? "phClass" : ""}>
              {showValue}
            </Text>
          </Picker>
        ) : (
          <Text className={cls}>{showValue || "请选择"}</Text>
        )}
      </View>
    );
  };

  return (
    <View className="com-formRender">
      <View className="item-wrap">{formSchema.map((v) => renderItem(v))}</View>
    </View>
  );
};

export default React.memo(forwardRef(FormRender));
