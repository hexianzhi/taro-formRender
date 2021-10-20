// import Taro from '@tarojs/taro'

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

export const formData = [
  {
    key: "text",
    title: "文本",
    required: true,
    type: "input",
    typeProps: {
      maxLength: 10,
      title: "标准五个字",
      placeholder: "请输入",
    },
    className: "input",
  },
  {
    key: "remark",
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
