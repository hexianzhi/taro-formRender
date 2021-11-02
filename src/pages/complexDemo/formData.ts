// import Taro from '@tarojs/taro'
import { IFormSchema } from "../index/formRender/type";

export function getFormData(changeSingleFormData) {
  const formData: IFormSchema[] = [
    {
      key: "a",
      title: "名字1",
      type: "input",
      typeProps: {
        name: "a1",
        maxLength: 10,
        title: "名字1",
        placeholder: "请输入2",
        type: "text",
      },
    },
    {
      key: "b",
      title: "名字",
      required: true,
      type: "input",
      rules: [
        {
          pattern: /^\w+$/,
          message: "名字必须为英文",
        },
      ],
      typeProps: {
        // name 必传！！不然出现莫名bug！
        name: "a",
        maxLength: 10,
        title: "名字",
        placeholder: "请输入1",
        required: true,
        type: "text",
      },
    },
    {
      key: "c",
      title: "国家",
      type: "picker",
      typeProps: {
        mode: "selector",
        range: ["美国", "中国", "巴西", "日本"],
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
          // 因为是获取到 value 左侧值，所以 allRangeObj 设计数据结构成 {a: ["a1", 'a2'], b: ['b1', 'b2']}}
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
      key: "e",
      title: "备注",
      required: true,
      type: "textarea",
      typeProps: {
        maxLength: 100,
      },
      className: "textarea",
    },
  ];
  return formData;
}
