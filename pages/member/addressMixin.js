/**
 * Created by Andste on 2018/6/13.
 * 地址相关mixin
 * 个人中心和结算页复用
 */

import * as API_Address from '@/api/address'
import { RegExp } from '@/ui-utils'
export default {
  data() {
    return {
      // 地址列表
      addressList: [],
      // 添加、编辑地址 表单
      addressForm: {},
      // 添加、编辑地址 表单规则
      addressRules: {
        name: [
          this.MixinRequired('请输入收货人姓名！'),
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        mobile: [
          this.MixinRequired('请输入联系方式！'),
          { validator: (rule, value, callback) => {
              if (!RegExp.mobile.test(value)) {
                callback(new Error('手机格式有误！'))
              } else {
                callback()
              }
            }, trigger: 'blur' }
        ],
        region: [this.MixinRequired('请选择地址地区！')],
        addr: [
          this.MixinRequired('请输入详细地址！'),
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      },
      // 编辑地址时，暂存操作的地址
      regions: null
    }
  },
  mounted() {
    this.GET_AddressList()
  },
  methods: {
    areaFormatter(row) {
      return row.province + row.city + row.county + row.town
    },
    /** 添加地址 */
    handleAddAddress(_refs) {
      if (!this.regions) {
        const $regionPicker = this.$refs['regionPicker']
        $regionPicker && $regionPicker['initAddressSelect']()
      }
      this.addressForm = {
        def_addr: 0,
        ship_address_name: ''
      }
      this.regions = new Date().getTime()
      this.openLayer({
        title: '添加地址',
        yes: index => {
          this.submitAddressForm('add', index)
        }
      })
      this.$nextTick(()  => {
        if (_refs) {
          _refs.clearValidate()
        }
      })
    },
    /** 编辑地址 */
    handleEaitAddress(row) {
      this.addressForm = JSON.parse(JSON.stringify(row))
      this.regions = [row.province_id, row.city_id, row.county_id || -1, row.town_id || -1]
      this.openLayer({
        yes: index => {
          this.submitAddressForm('edit', index)
        }
      })
    },
    /** 删除地址 */
    handleDeleteAddress(row) {
      this.$confirm('确定要删除这个地址吗？', () => {
        API_Address.deleteAddress(row.addr_id).then(() => {
          this.$message.success('删除成功！')
          this.GET_AddressList()
        })
      })
    },
    /** 设置默认地址 */
    handleSetDefaultAddress(item) {
      API_Address.setDefaultAddress(item.addr_id).then(() => {
        this.$message.success('设置成功！')
        this.GET_AddressList()
      })
    },
    /** 提交地址表单 */
    submitAddressForm(type, index) {
      this.$refs['addressForm'].validate((valid) => {
        if (valid) {
          const { addr_id } = this.addressForm
          if (!addr_id) {
            API_Address.addAddress(this.addressForm).then(() => {
              this.$message.success('保存成功！')
              this.$layer.close(index)
              this.GET_AddressList()
            })
          } else {
            API_Address.editAddress(addr_id, this.addressForm).then(response => {
              this.$message.success('保存成功！')
              this.$layer.close(index)
              this.GET_AddressList()
            })
          }
        } else {
          this.$message.error('表单填写有误，请检查！')
          return false
        }
      })
    },
    /** 打开layer弹窗 */
    openLayer(params) {
      this.$layer.open({
        type: 1,
        title: '编辑地址',
        zIndex: 200,
        area: '550px',
        scrollbar: false,
        content: $('#addressForm'),
        btn: ['确认', '取消'],
        ...params
      })
    },
    /** 获取地址列表 */
    GET_AddressList() {
      API_Address.getAddressList().then(response => {
        this.addressList = response
      })
    }
  }
}
