 
export const getClsOrStyle = (item, formValue) => {
  const { type, key, style = {}, className = "", disabled } = item;
  let itemCls = `fr-item ${type} ${className}`;
  if (disabled) {
    itemCls += " disabled";
  }
  const itemStyle = style;
  const value = formValue[key];
  const phStyle = { color: value ? "#000" : "rgba(0, 0, 0, 0.3)" };

  return { itemCls, itemStyle, phStyle };
};

// 执行函数式
export const transformFunctionItem = (item, formValue, formSchema, SupportFunctionItem) => {
  let result = {};
  Object.keys(item).forEach((v) => {
    if (!SupportFunctionItem.includes(v)) return;
    if (typeof item[v] === "function") result[v] = item[v](formValue, formSchema);
    else result[v] = item[v];
  });
  return result as any;
};


function stringContains(str, text) {
  return str.indexOf(text) > -1;
}

export const isObject = a =>
  stringContains(Object.prototype.toString.call(a), 'Object');
