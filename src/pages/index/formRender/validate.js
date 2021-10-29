import Taro from '@tarojs/taro'


/**
 * 1. 验证必填项
 * 2. 验证 rules: 1. pattern 正则 2. validate 自定义方法
 *
 * @returns
 */
 export const validate = (formValue, formSchema) => {
  try {
    formSchema.forEach(schema => {
      let isSuccess = true
      const value = formValue[schema.key]
      // required单独拿出来处理
      if (schema.required) {
        if (Array.isArray(value)) {
          isSuccess = value.length > 0 && value.every(vv => !isEmptyValue(vv))
        }
        if (isEmptyValue(value)) {
          isSuccess = false
        }
        if (!isSuccess) {
          const msg =
            requiredRuleMsg(schema) ||
            DefaultValidateTypeMsgMap[schema.type] + schema.name ||
            schema.name + '必填'

          throw msg
          // 抛出是为了从第一个开始提示
          // TODO 或者是全都提示?分别给错误样式？？
          // 实时校验？
        }
      }

      // 有值才判断正则
      if (value && schema.rules && schema.rules.length) {
        schema.rules.some(rule => {
          if (rule.pattern && !new RegExp(rule.pattern).test(value)) isSuccess = false
          if (rule.validate && !rule.validate(value)) isSuccess = false
          if (!isSuccess) throw rule.message
        })
      }
    })
  } catch (e) {
    Taro.showToast({ title: e, icon: 'none' })
    return false
  }
  return true
}

// 值是是否为空
export const isEmptyValue = value => {
  // boolean里的false, number里的0, 都不要认为是空值
  if (value === 0 || value === false) {
    return false
  }
  return !value
}

export const requiredRuleMsg = schema => {
  if (!schema.rules) return ''
  const rule = schema.rules.find(v => v.required)
  if (!rule) return ''
  return rule.message
}



export const DefaultValidateTypeMsgMap = {
  picker: '请选择',
  inputTableList: '请选择',
  'input-range': '请输入',
  input: '请输入',
  textarea: '请输入',
  'input-picker': '请输入',
}

export const defaultValidateMessagesCN = {
  default: '${title}未通过校验',
  required: '${title}必填',
  whitespace: '${title}不能为空',
  date: {
    format: '${title}的格式错误',
    parse: '${title}无法被解析',
    invalid: '${title}数据不合法',
  },
  // types: {
  //   string: typeTemplate,
  //   method: typeTemplate,
  //   array: typeTemplate,
  //   object: typeTemplate,
  //   number: typeTemplate,
  //   date: typeTemplate,
  //   boolean: typeTemplate,
  //   integer: typeTemplate,
  //   float: typeTemplate,
  //   regexp: typeTemplate,
  //   email: typeTemplate,
  //   url: typeTemplate,
  //   hex: typeTemplate,
  // },
  // string: {
  //   len: '${title}长度不是${len}',
  //   min: '${title}长度不能小于${min}',
  //   max: '${title}长度不能大于${max}',
  //   range: '${title}长度需在${min}于${max}之间',
  // },
  // number: {
  //   len: '${title}不等于${len}',
  //   min: '${title}不能小于${min}',
  //   max: '${title}不能大于${max}',
  //   range: '${title}需在${min}与${max}之间',
  // },
  // array: {
  //   len: '${title}长度不是${len}',
  //   min: '${title}长度不能小于${min}',
  //   max: '${title}长度不能大于${max}',
  //   range: '${title}长度需在${min}于${max}之间',
  // },
  // pattern: {
  //   mismatch: '${title}未通过正则判断${pattern}',
  // },
}
