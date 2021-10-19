import { taroToast } from '@/utils/openPage'
import { buildingAgeRange, floor, getNum, roomRange } from '@/utils/utils'
import Taro from '@tarojs/taro'

const demandTypeList = [{ name: '一手' }, { name: '二手' }]

const fckBuxian = (ranges, ranges1) => {
  ranges1.unshift(['不限', ranges.concat(['不限'])])
  return Object.fromEntries(ranges1)
}

const floorRange = floor('楼', 1, 1, 100)
const floorRange1 = floorRange.map((v, index, arr) => [
  `${v}`,
  floor('楼', getNum(v) + 1, 1, 100).concat(['不限']),
])
//  allRangeObj 数据结构: {a: ["a1", 'a2'], b: ['b1', 'b2']}
const floorObj = fckBuxian(floorRange, floorRange1)

const RoomRange = roomRange('室')
const RoomRange1 = RoomRange.map((v, index, arr) => [
  `${v}`,
  roomRange('室', getNum(v) + 1).concat(['不限']),
])
const roomObj = fckBuxian(RoomRange, RoomRange1)

const buildRanges = buildingAgeRange('年')
const buildRanges1 = buildRanges.map((v, index, arr) => [
  `${v}`,
  buildingAgeRange('年', getNum(v) + 1).concat(['不限']),
])
const buildObj = fckBuxian(buildRanges, buildRanges1)

export const purposeList = [
  { name: '住宅' },
  { name: '写字楼' },
  { name: '别墅' },
  { name: '厂房' },
  { name: '商住' },
  { name: '商铺' },
  { name: '仓库' },
  { name: '车位' },
]
export const formData = [
  {
    key: 'client_demand_type',
    name: '类型',
    required: true,
    type: 'inputTableList',
    className: 'demand_type_item marginBottom',
    hidden: formValue => {
      console.log('formValue.type: ', formValue.type);
      return formValue.type !== '求购'
    },
    typeProps: {
      list: demandTypeList,
    },
  },
  {
    key: 'purpose',
    name: '房屋用途',
    type: 'picker',
    typeProps: {},
    required: true, // 前端写死
    widget: 'tableList',
    widgetProps: {
      type: 'single',
      list: purposeList,
    },
  },
  {
    key: 'prefer_region',
    name: '意向区域',
    type: 'picker',
    required: true, // 前端写死
    typeProps: {},
    className: 'marginBottom',
    checkWidgetShow: formValue => {
      if (formValue.type === '求购' && !formValue.client_demand_type) {
        taroToast('请先选择类型')
        return false
      }
      return true
    },
    widget: 'new-page',
    widgetProps: {
      onJumpToNewPage: (formValue, item) => {
        const url = '/enterCustomerPage/pages/inputCustomersRegion/index'
        const urlParams = `client_demand_type=${formValue.client_demand_type}`
        Taro.navigateTo({
          url: `${url}?${urlParams}`,
        })
      },
    },
  },
  {
    key: 'pay',
    name: '价格范围',
    type: 'input-range',
    required: true,
    typeProps: {
      className: 'low_select',
      type: 'number',
      // onlyTwoDigit: true,
      maxlength: 9,
      placeholder: '请输入',
      'placeholder-class': 'phClass',
      unit: '元',
    },
  },
  {
    key: 'room',
    name: '意向户型',
    required: false,
    type: 'picker',
    typeProps: {},
    widget: 'picker',
    widgetProps: {
      mode: 'multiSelector',
      order: true,
      linkSymbol: '-',
      range: [['不限'].concat(RoomRange), RoomRange.concat(['不限'])],
      isColumnChange: true,
      allRangeObj: roomObj,
    },
  },
  {
    key: 'area',
    name: '面积范围',
    required: true,
    type: 'input-range',
    className: 'marginBottom',
    typeProps: {
      className: 'low_select',
      type: 'number',
      // onlyTwoDigit: true,
      maxlength: 9,
      placeholder: '请输入',
      'placeholder-class': 'phClass',
      unit: '平米',
    },
  },
  {
    key: 'floor',
    name: '楼层范围',
    type: 'picker',
    required: false,
    widget: 'picker',
    widgetProps: {
      mode: 'multiSelector',
      order: true,
      linkSymbol: '-',
      range: [['不限'].concat(floorRange), floorRange.concat(['不限'])],
      isColumnChange: true,
      allRangeObj: floorObj,
    },
  },
  {
    key: 'direction',
    name: '朝向要求',
    type: 'picker',
    typeProps: {},
    required: false,
    widget: 'tableList',
    // 对应后端接口数据名称，
    profileListValue: '朝向',
    widgetProps: {
      type: 'muti',
    },
  },
  {
    key: 'building_age',
    name: '房龄范围',
    type: 'picker',
    typeProps: {},
    required: false,
    widget: 'picker',
    widgetProps: {
      mode: 'multiSelector',
      order: true,
      linkSymbol: '-',
      range: [['不限'].concat(buildRanges), buildRanges.concat(['不限'])],
      isColumnChange: true,
      allRangeObj: buildObj,
    },
  },
  {
    key: 'decoration',
    name: '装修要求',
    type: 'picker',
    typeProps: {},
    required: false,
    profileListValue: '装修情况',
    widget: 'tableList',
    widgetProps: {
      type: 'muti',
    },
  },
  {
    key: 'fitment',
    name: '配套要求',
    type: 'picker',
    typeProps: {},
    required: false,
    widget: 'tableList',
    widgetProps: {
      type: 'muti',
    },
    checkWidgetShow: formValue => {
      if (!formValue.purpose) {
        taroToast('请先选择房屋用途')
        return false
      }
      return true
    },
  },
  {
    key: 'building_type',
    name: '类型要求',
    type: 'picker',
    typeProps: {},
    required: false,
    className: 'marginBottom',
    widget: 'tableList',
    widgetProps: {
      type: 'muti',
    },
    checkWidgetShow: formValue => {
      if (!formValue.purpose) {
        taroToast('请先选择房屋用途')
        return false
      }
      return true
    },
  },
  {
    key: 'source',
    name: '客户来源',
    type: 'picker',
    typeProps: {},
    required: false,
    widget: 'picker',
    widgetProps: {
      isColumnChange: true,
      // 应该存起来，避免每次修改
      allRangeObj: [],
      mode: 'multiSelector',
      order: true,
      linkSymbol: '-',
    },
  },
  {
    key: 'stage',
    name: '沟通阶段',
    type: 'picker',
    typeProps: {},
    required: false,
    widget: 'tableList',
    profileListValue: '沟通阶段',
    widgetProps: {
      type: 'single',
    },
  },
  {
    key: 'detailStr',
    name: '客户详情',
    type: 'picker',
    required: false,
    typeProps: {},
    widget: 'new-page',
    className: 'marginBottom',
    widgetProps: {
      // 参数传递问题
      url: '/enterCustomerPage/pages/inputCustomersDetail/index',
    },
  },
  {
    key: 'remark',
    name: '备注',
    type: 'textarea',
    typeProps: {
      maxLength: 500,
      placeholder: '请输入...',
    },
  },
]
