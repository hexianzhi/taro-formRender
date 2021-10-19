import { useSet } from "@/hook/useSet";
import { useForceUpdate } from "@/hook/useForceUpdate";
import { Input, Picker, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import PropTypes from "prop-types";
import React, { forwardRef, useImperativeHandle, useRef, useMemo } from "react";
import { AtTextarea } from "taro-ui";
import { debounce } from "debounce";
import {
  isEmptyValue,
  requiredRuleMsg,
  DefaultValidateTypeMsgMap,
} from "./validate";
import "./index.scss";

const SupportFunctionStatus = ['hidden', 'required', 'disabled']


const initTableData = {
  tableList: [],
  tableTitle: "",
  tableType: "",
  tableInitValue: [],
  activeTableItem: "",
};

const FormRender = (
  {
    formSchema,
    formValue = {},
    onChange,
    onPickerColumnChange,
    onJumpToNewPage,
  },
  ref
) => {
  const [state, setState] = useSet({
    isOpenLayout: false,

    /** 弹框数据 */
    ...initTableData,
  });

  const { update } = useForceUpdate();

  const {
    isOpenLayout,
    /** 弹框数据 */
    tableList,
    tableTitle,
    tableType,
    tableInitValue,
    activeTableItem,
  } = state;

  const showTableValue = useRef();

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
 
  const getClsOrStyle = (item) => {
    const { type, key, style = {}, className = "", disabled } = item;
    let itemCls = `com-formRender-item ${type} ${className}`;
    if (disabled) {
      itemCls += " disabled";
    }
    const itemStyle = style;
    const value = formValue[key];
    const phStyle = { color: value ? "#000" : "rgba(0, 0, 0, 0.3)" };

    return { itemCls, itemStyle, phStyle };
  };
  const getStatus = (obj) => {
    let result = {}
    Object.keys(obj).forEach(v => {
      if (!SupportFunctionStatus.includes(v)) return
      if (typeof obj[v] === 'function') result[v] = obj[v](formValue, formSchema)
      else result[v] = obj[v]
    })
    console.log('result: ', result);
    return result
  }
 
  const onDebounceChange = debounce(onChange, 200);

  const onPickerClick = (item) => {
    const { checkWidgetShow } = item;
    if (checkWidgetShow && !checkWidgetShow(formValue)) return;
 
    if (item.widget === "new-page") {
      const { url, urlParams } = item.widgetProps;
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

  const onPickerChange = (e, item, isPickerItem) => {
    const value = e.detail.value;
    let { key, widgetProps } = item;
    if (isPickerItem) {
      key = widgetProps.widgetKey;
    }
    const { mode, range } = widgetProps || {};
    if (mode === "multiSelector") {
      const [left, right] = value;
      onChange(key, [range[0][left], range[1][right]]);
    }
    if (mode === "selector") {
      onChange(key, range[value]);
    }
  };

  
  const onDebounceInputRangeChange = debounce(onInputRangeChange, 100);

  
  // 可以提前成单独的子组件。。但是我懒
  const renderItem = (item) => {
    if (!item) return;
    const { type, typeProps, key, name, required, render, extra } = item;
    const { unit } = typeProps || {};
    const { itemCls, itemStyle } = getClsOrStyle(item);
    const value = formValue[key];
    if (!type) {
      throw `${name}字段没有 type,无法渲染`;
    }
    let itemContent = <></>;
    // TODO 切换成at 做成样例
    if (type === "picker") {
      itemContent = renderPicker(item);
    }
   
 
    if (type === "input") {
      itemContent = (
      
      );
    }
    if (type === "textarea") {
      itemContent = (
        <>
          <View className="textarea-title">
            {name}
            {required && <Text style={{ color: "red" }}>*</Text>}
          </View>
          <AtTextarea
            className="textarea-content"
            value={value || ""}
            onChange={(v) => onDebounceChange(key, v)}
            {...typeProps}
          />
        </>
      );
    }

    // 自定义
    if (type === "custom") {
      itemContent = render(value, item, onChange);
    }

    return (
      <View className={itemCls} style={itemStyle}>
        {itemContent}
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
      <Card cardLeft={name} isMust={required}>
        <View
          className="card-content ellipsisText"
          onClick={() => onPickerClick(item)}
        >
          {widget === "picker" ? (
            <Picker
              className="picker-com"
              onChange={(e) => onPickerChange(e, item)}
              onColumnChange={(e) => onPickerColumnChange(e, item)}
              // value={pickerValue} // 完全不用啊！！组件自己会记录的
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
      </Card>
    );
  };

  

  
   

  
  return (
    <View className="com-formRender">
      <View className="item-wrap">
        {formSchema.map((v, index) => renderItem(v, index))}
      </View>
      <FloatLayout
        isOpened={isOpenLayout}
        onClose={onConfirmFloat}
        title={tableTitle}
        onCancel={onCancelFloat}
      >
        {/* 或许还有其他内容 */}
        {tableList && !!tableList.length && renderFloatLayoutTableList()}
      </FloatLayout>
    </View>
  );
};

FormRender.propTypes = {
  formSchema: PropTypes.arrayOf(
    PropTypes.shape({
      /** 匹配 value*/
      key: PropTypes.string.isRequired,
      /** 显示名称*/
      name: PropTypes.string.isRequired,
      /** 是否必填项 */
      required: PropTypes.bool,
      /** 表单项的类名 */
      className: PropTypes.string,
      /** 验证规则*/
      rules: PropTypes.arrayOf(
        PropTypes.shape({
          validate: PropTypes.func,
          pattern: PropTypes.object, // 正则
          message: PropTypes.string,
        })
      ),
      /** 基础组件类型 */
      type: PropTypes.string.isRequired,
      /** 基础组件 props*/
      typeProps: PropTypes.object,
      /** 扩展组件类型 */
      widget: PropTypes.string,
      /** 扩展组件 props*/
      widgetProps: PropTypes.object,
    })
  ),
};

export default React.memo(forwardRef(FormRender));
