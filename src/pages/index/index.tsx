import { clientCreate, clientModify, getClientDetail, getSource } from '@/api/client'
import { getRequired } from '@/api/common'
import { getAllProfileList } from '@/api/house'
import FormRender from '@/components/formRender'
import NextButton2 from '@/components/nextButton2'
import { set as setGlobalData, get as getGlobalData } from '@/utils/global_data'
import { backWithParam, switchTab, taroToast } from '@/utils/openPage'
import { View } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { Component } from 'react'
import { addInlineClientRelation } from '@/api/inlineClient'
import { formData as detailFormData } from '../inputCustomersDetail/formData'
import { formData } from './formData'
import cloneDeep from 'lodash.clonedeep'
import './index.scss'
import { getNum, getLastRegion } from '@/utils/utils'

export default class CustomersInfo extends Component {
  params = getCurrentInstance().router.params
  entrustInfo = {}
  formRef = React.createRef()

  userInfo = Taro.getStorageSync('user_info')
  customer_info = Taro.getStorageSync('customer_info') || {}
  allProfileList = []

  constructor(props) {
    super(props)
    // console.log('this.params: ', this.params)
    this.state = {
      isNew: !this.params.client_id,
      /** 表单数据。 所有 storage 中的数据都要放到 customerInfo 中 */
      customerInfo: this.params.client_id ? {} : this.customer_info,
      allFormData: cloneDeep(formData),
    }
  }

  async componentDidMount() {
    await this.checkIsDetail()
    // this.showClientDemandType()
    await this.getAllProfileList()
    await this.getSourceList()
    this.getRequired()
    this.initFormData()
  }

  componentDidShow() {
    this.getOtherPagesData()
  }

  getOtherPagesData = () => {
    let pages = Taro.getCurrentPages()
    let currPage = pages[pages.length - 1] // 获取当前页面
    const { isRegion, isDetail, region, newInfo } = currPage.data
    // console.log('getOtherPagesData currPage.data: ', currPage.data)
    if (isRegion || isDetail) {
      const newData = isRegion ? region : isDetail ? newInfo : {}
      this.setState(
        {
          customerInfo: {
            ...this.state.customerInfo,
            ...newData,
          },
        },
        () => {
          Taro.setStorageSync('customer_info', this.state.customerInfo)
        }
      )
      delete currPage.data.isRegion
      delete currPage.data.isDetail
      delete currPage.data.region
      delete currPage.data.newInfo
    }
  }

  checkIsDetail = async () => {
    const { updateType } = this.params
    if (!updateType) return
    if (updateType == 'update') {
      await this.getDetail()
    }
  }

  // 修改客源时初始化信息
  async getDetail() {
    const client_id = this.params.client_id
    if (!client_id) return
    let params = {
      clientId: client_id,
      city: this.userInfo.city_id,
      phone: this.userInfo.mobile,
    }
    try {
      let res = await getClientDetail(params)
      if (res.result) {
        const detail = res.result
        console.log('detail: ', detail)

        const keys = detailFormData.map(v => v.key).concat(['carType', 'webCat', 'identityCard'])
        let detailStr = ''
        let label = ''
        if (detail.ifUrgent) {
          detailStr += '急切;'
          label += '急切;'
        }
        if (detail.allMoney) {
          detailStr += '全款;'
          label += '全款;'
        }
        detailStr += keys
          .map(key => detail[key])
          .filter(v => v)
          .join(';')
        // console.log('detailStr: ', detailStr)

        const info = {
          // 传递给

          clientId: detail.clientId,
          pub: detail.public,
          type: detail.type,
          customer_name: detail.customerName,
          purpose: detail.purpose,
          // 好像都没有
          tel: detail.tel,
          relation: detail.relation,

          building_type: detail.buildingType,
          client_demand_type: detail.clientDemandType,
          prefer_region: getLastRegion(detail.preferRegion),
          prefer_region_json: JSON.parse(detail.preferRegionJson),
          source: [detail.source, detail.sourceTwo],
          pay: [detail.payMin, detail.payMax],
          area: [detail.areaMin, detail.areaMax],
          building_age: [
            detail.buildingAgeMin
              ? detail.buildingAgeMin + '年'
              : detail.buildingAgeMin === 0
              ? '不限'
              : '',
            detail.buildingAgeMax
              ? detail.buildingAgeMax === 2200
                ? '不限'
                : detail.buildingAgeMax + '年'
              : '',
          ],
          direction: detail.orientation,
          decoration: detail.decoration,
          fitment: detail.fitment,
          stage: detail.stage,

          concept: detail.concept,
          nationality: detail.nationality,
          car: detail.car,
          qq: detail.qq,
          email: detail.email,
          remark: detail.remark,

          identity_card: detail.identityCard,
          car_type: detail.carType,
          ethnicity: detail.ethnicity,
          web_cat: detail.webCat,
          detailStr: detailStr,
          if_urgent: detail.ifUrgent,
          all_money: detail.allMoney,
          label: label,
        }

        if (detail.roomMin || detail.roomMax) {
          info.room = [
            detail.roomMin ? detail.roomMin + '室' : detail.roomMin === 0 ? '不限' : '',
            detail.roomMax ? (detail.roomMax === 100 ? '不限' : detail.roomMax + '室') : '',
          ]
        }
        if (detail.floorMin || detail.floorMax) {
          info.floor = [
            detail.floorMin ? detail.floorMin + '楼' : detail.floorMin === 0 ? '不限' : '',
            detail.floorMax ? (detail.floorMax === 200 ? '不限' : detail.floorMax + '楼') : '',
          ]
        }

        this.setState({ customerInfo: info })
        Taro.setStorageSync('customer_info', info)
      }
    } catch (e) {
      taroToast(e.desc, 1000, 'none')
    }
  }

  // 联动数据列表
  initFormData() {
    const { customerInfo } = this.state
    this.changeFormRange('purpose', this.state.customerInfo.purpose)
    if (customerInfo.type === '求购') {
      this.changeSingleFormData('pay', '万', 'typeProps', 'unit')
    }
  }

  //查询必填项
  async getRequired() {
    try {
      let res = await getRequired({
        type: this.customer_info.type,
      })
      if (res.data) {
        let requiredKeys = []
        res.data.map(item => {
          requiredKeys.push(item.value)
        })

        const { allFormData } = this.state
        const _allFormData = allFormData.slice()
        _allFormData.forEach(v => {
          if (requiredKeys.some(r => v.key === r)) v.required = true
        })
        this.setState({ allFormData: _allFormData })
      }
    } catch (e) {
      taroToast(e.desc, 1000, 'none')
    }
  }

  // 根据后端配置设置可选值
  getAllProfileList = async () => {
    const { updateType } = this.params

    if (updateType == 'update') {
      const { result } = await getAllProfileList({ companyId: this.userInfo.company_id })
      this.allProfileList = result
      setGlobalData('allProfileList', result)
    } else {
      this.allProfileList = getGlobalData('allProfileList')
    }
    console.log('this.allProfileList: ', this.allProfileList)

    const { allFormData } = this.state
    const _allFormData = allFormData.slice()
    _allFormData.forEach(item => {
      if (!item.profileListValue) return
      const listItem = this.allProfileList.find(v => v.name === item.profileListValue)

      if (!listItem) return
      item.widgetProps = item.widgetProps || {}
      if (item.type === 'picker' && item.widget === 'picker') {
        if (item.widgetProps.range) return
        item.widgetProps.range = listItem.value
      }
      if (item.type === 'picker' && item.widget === 'tableList') {
        item.widgetProps = item.widgetProps || {}
        if (item.widgetProps.list) return
        item.widgetProps.list = listItem.value.map(v => ({ name: v }))
      }
    })
  }

  // 不知道为啥要独立获取，
  // 获取客源类型列表
  async getSourceList() {
    let { city_id } = Taro.getStorageSync('user_info')
    let res = await getSource({ cityId: city_id })
    let allRangeObj = res.result.map(v => [v.sourceName, v.levelData.map(l => l.sourceName)])
    allRangeObj = Object.fromEntries(allRangeObj)
    //  allRangeObj 数据结构: {a: ["a1", 'a2'], b: ['b1', 'b2']}

    // let source = '物业客'
    const { source, inlineId } = this.params
    let initRange = []
    if (inlineId) {
      // 进线管理
      initRange = [['网络客'], ['安居客', '58同城', '赶集网']]
      this.changeSingleFormData('source', initRange, 'widgetProps', 'range')
    } else if (source) {
      // 房客领取
      let [first, last] = source.split('-')
      initRange[0] = [first]
      if (last) {
        initRange[1] = [last]
      } else {
        initRange[1] = allRangeObj[first]
      }
      this.changeSingleFormData('source', initRange, 'widgetProps', 'range')
    } else {
      // 设置默认客户来源
      const last = allRangeObj[Object.keys(allRangeObj)[0]] // 取第一个字段的值
      initRange = [Object.keys(allRangeObj), last]
      this.changeSingleFormData('source', initRange, 'widgetProps', 'range')
      this.changeSingleFormData('source', allRangeObj, 'widgetProps', 'allRangeObj')
    }
  }

  getPreferRegion = regions => {
    if (!regions || !regions.length) return ''
    let prefer_region = ''
    // 构造后端参数
    regions.map(v => {
      const temp_prefer_region =
        (v.district || '') +
        (v.region ? '-' + v.region : '') +
        (v.community ? '-' + v.community : '')
      prefer_region += temp_prefer_region ? temp_prefer_region + ';' : ''
    })
    return prefer_region
  }

  //新增客源
  submit = async () => {
    const { updateType } = this.params
    const { customerInfo } = this.state
    const canSubmit = this.formRef.current.validate()
    console.log('canSubmit: ', canSubmit)
    if (!canSubmit) return

    const params = {
      // 上一步数据
      type: customerInfo.type,
      public: customerInfo.pub,
      customer_name: customerInfo.customer_name,
      tel: customerInfo.tel,
      gender: customerInfo.gender,
      relation: customerInfo.relation,
      // 本一页数据
      client_demand_type: customerInfo.client_demand_type || '二手', // 给个默认值避免无数据
      // client_demand_type: '二手',
      decoration: customerInfo.decoration,
      fitment: customerInfo.fitment,
      building_type: customerInfo.building_type,
      purpose: customerInfo.purpose,
      direction: customerInfo.direction,

      // 需求详情
      if_urgent: customerInfo.label && customerInfo.label.includes('急切') ? 1 : 0,
      all_money: customerInfo.label && customerInfo.label.includes('全款') ? 1 : 0,
      stage: customerInfo.stage,
      concept: customerInfo.concept,
      nationality: customerInfo.nationality,
      car: customerInfo.car,
      identity_card: customerInfo.identity_card,
      qq: customerInfo.qq,
      email: customerInfo.email,
      remark: customerInfo.remark,
      car_type: customerInfo.car_type,
      web_cat: customerInfo.web_cat,
      ethnicity: customerInfo.ethnicity,
      // 详情时后端返回太多数据了，不能强制展开
      // ...customerInfo,

      prefer_region: this.getPreferRegion(customerInfo.prefer_region_json),
      prefer_region_json: JSON.stringify(customerInfo.prefer_region_json),
      source: customerInfo.source ? customerInfo.source[0] : '',
      source_two: customerInfo.source ? customerInfo.source[1] : '',
      area_min: customerInfo.area ? getNum(customerInfo.area[0]) : '',
      area_max: customerInfo.area ? getNum(customerInfo.area[1]) : '',
      pay_min: customerInfo.pay ? getNum(customerInfo.pay[0]) : '',
      pay_max: customerInfo.pay ? getNum(customerInfo.pay[1]) : '',
      room_min: customerInfo.room ? getNum(customerInfo.room[0]) : '',
      room_max: customerInfo.room ? this.getMaxValue(customerInfo.room[1], 'room') : '',
      floor_min: customerInfo.floor ? getNum(customerInfo.floor[0]) : '',
      floor_max: customerInfo.floor ? this.getMaxValue(customerInfo.floor[1], 'floor') : '',
      building_age_min: customerInfo.building_age ? getNum(customerInfo.building_age[0]) : '',
      building_age_max: customerInfo.building_age
        ? this.getMaxValue(customerInfo.building_age[1], 'building_age')
        : '',
    }

    if (params.type === '求租') delete params.client_demand_type

    console.log('params: ', params)
    if (updateType == 'add') {
      this.create(params)
    } else if (updateType == 'update') {
      this.modify(params)
    }
  }

  create = async param => {
    param.recommender_id = this.entrustInfo.recommender_id || ''
    param.entrust_id =
      this.params.fromSource && this.params.fromSource == 'entrust' ? this.params.fromEntrustId : ''

    try {
      const { data } = await clientCreate(param)
      Taro.removeStorageSync('customer_info')
      taroToast('保存成功', 1000)

      if (this.params.fromSource == 'entrust') {
        const { fromEntrustId, fromSource } = this.params
        //从委托页面过来
        setTimeout(() => {
          setGlobalData('customer_refresh', true)
          const baseUrl = '/pages/receive/tenantDetails/tenantDetails'
          const url = `${baseUrl}?barTitle=客源&id=${fromEntrustId}&fromSource=${fromSource}`
          Taro.reLaunch({
            url,
          })
        }, 1000)
      } else if (this.params.inlineId) {
        // 进线管理关联客源
        const user_info = Taro.getStorageSync('user_info')
        const { code, message } = await addInlineClientRelation({
          cityId: user_info.city_id,
          clientId: data.id,
          inlineId: this.params.inlineId,
        })
        if (!code) {
          taroToast('关联成功', 1000, 'none', () => {
            const url = `/pages/customersDetails/customersDetails?id=${data.id}&isFromInline=1`
            Taro.navigateTo({
              url,
            })
          })
        } else {
          taroToast(message)
        }
      } else {
        setTimeout(function() {
          setGlobalData('customer_refresh', true)
          switchTab('customers')
        }, 1000)
      }
    } catch (e) {
      taroToast(e.desc, 1000)
    }
  }

  modify = async param => {
    const { customerInfo } = this.state
    param.id = customerInfo.clientId

    try {
      await clientModify(param)
      taroToast('保存成功', 1000)
      var pages = Taro.getCurrentPages()
      var prevPage = pages[pages.length - 2] //上一个页面
      if (prevPage.route == 'pages/dataDetails/dataDetails') {
        setTimeout(() => {
          backWithParam(1, { customersInfo: 1 })
        }, 1000)
      } else {
        setTimeout(() => {
          switchTab('customers')
        }, 1000)
      }
    } catch (e) {
      taroToast(e.desc, 1000)
    }
  }

  onChange = (key, value) => {
    const { customerInfo } = this.state
    const oldValue = customerInfo[key]
    this.setState(
      {
        customerInfo: { ...customerInfo, [key]: value },
      },
      () => {
        Taro.setStorageSync('customer_info', this.state.customerInfo)
        const isChangeValue = oldValue !== value ? true : false
        if (isChangeValue) {
          this.changeFormRange(key, value, true)
        }
        // if (key === 'type' || key === 'client_demand_type') {
        //   this.showClientDemandType()
        // }
      }
    )
  }

  showClientDemandType = () => {
    const { allFormData, customerInfo } = this.state
    const _formData = allFormData.slice(0)
    const item = _formData.find(v => v.key === 'client_demand_type')
    if (customerInfo.type === '求购') {
      item.required = true
    } else {
      item.required = false
    }
    this.setState({ formData: _formData })
  }

  changeFormRange = (key, value, isResetValue) => {
    const { customerInfo } = this.state
    if (key === 'purpose') {
      if (isResetValue) {
        // 重置数据
        this.setState({ customerInfo: { ...customerInfo, building_type: '', fitment: '' } })
      }
      const type = value + '类型'
      const listItem = this.allProfileList.find(v => v.name === type)
      if (listItem) {
        this.changeSingleFormData(
          'building_type',
          listItem.value.map(v => ({ name: v })),
          'widgetProps',
          'list'
        )
      }
      const type2 = value + '配套'
      const listItem2 = this.allProfileList.find(v => v.name === type2)
      if (listItem2) {
        this.changeSingleFormData(
          'fitment',
          listItem2.value.map(v => ({ name: v })),
          'widgetProps',
          'list'
        )
      }
    }
  }

  onPickerColumnChange = (e, item) => {
    const { key, widgetProps } = item
    if (!widgetProps.isColumnChange) return
    // 因为是获取到 value 左侧值，所以 allRangeObj 设计数据结构成 {a: ["a1", 'a2'], b: ['b1', 'b2']}
    //  allRangeObj eg: {a: ["a1", 'a2'], b: ['b1', 'b2']}
    const { allRangeObj } = widgetProps
    // console.log('allRangeObj: ', allRangeObj)
    const { column, value } = e.detail
    if (!column) {
      this.changeSingleFormData(
        key,
        [Object.keys(allRangeObj), allRangeObj[Object.keys(allRangeObj)[value]]],
        'widgetProps',
        'range'
      )
    }
  }

  // 改变某个数据源数据
  changeSingleFormData = (key, newData, name, childName) => {
    const { allFormData } = this.state
    const _allFormData = allFormData.slice()
    const item = _allFormData.find(i => i.key === key)
    if (!item) return
    if (childName && name) {
      if (!item[name]) item[name] = {}
      item[name][childName] = newData
    } else if (name) {
      item[name] = newData
    }
    // console.log('changeSingleFormData item: ', item)
    this.setState({ allFormData: _allFormData })
  }

  //获取最大值
  getMaxValue(value, type) {
    if (!value) return ''
    if (value.includes('不限')) {
      // if (type == 'area') {
      //   return '10000'
      // } else if (type == 'pay') {
      //   return '10000000'
      // } else
      if (type == 'room') {
        return 100
      } else if (type == 'building_age') {
        return 2200
      } else if (type == 'floor') {
        return 200
      }
      return 0
    } else {
      return getNum(value)
    }
  }

  render() {
    const { customerInfo, allFormData } = this.state
    console.log('customerInfo: ', customerInfo)
    // console.log('allFormData: ', allFormData)
    // console.log('this.state: ', this.state)

    return (
      <View className='customer_info'>
        <FormRender
          ref={this.formRef}
          formValue={customerInfo}
          formSchema={allFormData}
          onChange={this.onChange}
          onPickerColumnChange={this.onPickerColumnChange}
        ></FormRender>
        <NextButton2 onClick={() => this.submit()}>完成</NextButton2>
      </View>
    )
  }
}
