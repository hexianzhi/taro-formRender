const SupportFunctionStatus = ["hidden", "required", "disabled"];

export const getClsOrStyle = (item, formValue) => {
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

export const getStatus = (obj, formValue, formSchema) => {
  let result = {};
  Object.keys(obj).forEach((v) => {
    if (!SupportFunctionStatus.includes(v)) return;
    if (typeof obj[v] === "function") result[v] = obj[v](formValue, formSchema);
    else result[v] = obj[v];
  });
  return result as any;
};
