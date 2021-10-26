// import Taro from '@tarojs/taro'
import { IFormSchema } from "./formRender/type";

// const fckBuxian = (ranges, ranges1) => {
//   ranges1.unshift(['不限', ranges.concat(['不限'])])
//   return Object.fromEntries(ranges1)
// }

// const floorRange = floor('楼', 1, 1, 100)
// const floorRange1 = floorRange.map((v, index, arr) => [
//   `${v}`,
//   floor('楼', getNum(v) + 1, 1, 100).concat(['不限']),
// ])
// //  allRangeObj 数据结构: {a: ["a1", 'a2'], b: ['b1', 'b2']}
// const floorObj = fckBuxian(floorRange, floorRange1)

export function getFormData() {
  console.log("getFormData this: ", this);
  const formData: IFormSchema[] = [
    {
      key: "a",
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
      key: "a1",
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
      key: "ff",
      title: "国家",
      type: "picker",
      typeProps: {
        mode: "selector",
        range: ["美国", "中国", "巴西", "日本"],
      },
    },
    {
      key: "c",
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
            this.changeSingleFormData(
              "c",
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
    // {
    //   key: "d",
    //   title: "是否开启",

    //   type: "atSwitch",
    //   typeProps: {
    //     title: "是否开启",
    //     // checked: (value) => value.d,
    //   },
    // },

    {
      key: "b",
      title: "备注",
      required: true,
      type: "textarea",
      typeProps: {
        maxLength: 100,
      },
      className: "textarea",
      // hidden: (formValue) => {
      //   return formValue.type ==='aa';
      // },
    },

    // {
    //   key: 'prefer_region',
    //   title: '意向区域',
    //   type: 'picker',
    //   required: true, // 前端写死
    //   typeProps: {},
    //   className: 'marginBottom',
    //   checkWidgetShow: formValue => {
    //     if (formValue.type === '求购' && !formValue.client_demand_type) {
    //       taroToast('请先选择类型')
    //       return false
    //     }
    //     return true
    //   },
    //   widget: 'new-page',
    //   widgetProps: {
    //     onJumpToNewPage: (formValue, item) => {
    //       const url = '/enterCustomerPage/pages/inputCustomersRegion/index'
    //       const urlParams = `client_demand_type=${formValue.client_demand_type}`
    //       Taro.navigateTo({
    //         url: `${url}?${urlParams}`,
    //       })
    //     },
    //   },
    // },
  ];
  return formData;
}
