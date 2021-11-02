// import Taro from '@tarojs/taro'
import { View, Text, Input } from "@tarojs/components";
import { IFormSchema } from "../../compoments/formRender/type";

export function getFormData(changeSingleFormData) {
  const formData: IFormSchema[] = [
    {
      key: "a",
      title: "名字",
      type: "input",
      className: "test-input",
      typeProps: {
        name: "a",
        maxLength: 10,
        placeholder: "请输入",
        type: "text",
      },
    },
    {
      key: "b",
      title: "爱好",
      required: true,
      type: "input",
      rules: [
        {
          pattern: /^[a-zA-Z]+$/,
          message: "爱好必须为英文",
        },
        {
          validate: (value: string) => value.length > 2,
          message: "爱好必须大于两个字",
        },
      ],
      typeProps: {
        // ATinput 必须有name
        name: "b",
        maxLength: 10,
        placeholder: "请输入",
        required: true,
        type: "text",
      },
    },

    {
      key: "d",
      title: "地区",
      type: "picker",
      typeProps: {
        mode: "multiSelector",
        range: [
          ["广东", "广西"],
          ["深圳", "广州"],
        ],
        // 箭头函数绑定 this
        onColumnChange: (e) => {
          // 因为是获取到 value 左侧值，所以 allRangeObj 设计数据结构成 {a: ["a1", 'a2'], b: ['b1', 'b2']}}。 当然随意设计
          const allRangeObj = {
            广东: ["深圳", "广州"],
            广西: ["桂林", "北海"],
          };
          const { column, value } = e.detail;
          if (column === 0) {
            // 第一列
            changeSingleFormData(
              "d",
              [
                Object.keys(allRangeObj),
                allRangeObj[Object.keys(allRangeObj)[value]],
              ],
              "typeProps",
              "range"
            );
          }
        },
      },
    },

    {
      key: "f",
      title: "自定义输入框",
      type: "custom",
      render: (formValue, formSchema, onChange) => {
        return (
          <>
            <Text className="fr-item-label">自定义输入框 </Text>
            <Input placeholder="请输入" onInput={(e) => onChange(e.detail.value)}>
              {formValue.f}
            </Input>
          </>
        );
      },
      extra: (
        <View style={{ flexBasis: "100vw" }}>我是自定义组件的底部元素</View>
      ),
    },
  ];
  return formData;
}
