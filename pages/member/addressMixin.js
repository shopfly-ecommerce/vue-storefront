/**
 * Created by Andste on 2018/6/13.
 * Address associatedmixin
 * Personal center and settlement page reuse
 */

import * as API_Address from '@/api/address'
import { RegExp } from '@/ui-utils'
export default {
  data() {
    return {
      // Address list
      addressList: [],
      // Add and edit address forms
      addressForm: {},
      // Add and edit address form rules
      addressRules: {
        name: [
          this.MixinRequired('Please enter the name of consignee！'),
          { min: 2, max: 20, message: 'The length of2 to20 A character', trigger: 'blur' }
        ],
        mobile: [
          this.MixinRequired('Please enter contact information！'),
          { validator: (rule, value, callback) => {
              if (!RegExp.mobile.test(value)) {
                callback(new Error('Incorrect phone format！'))
              } else {
                callback()
              }
            }, trigger: 'blur' }
        ],
        // region: [this.MixinRequired('Please select the address region！')],
        addr: [
          this.MixinRequired('Please enter the detailed address！'),
          { min: 1, max: 50, message: 'The length of1 to50 A character', trigger: 'blur' }
        ]
      },
      // The address of the operation is temporarily saved while editing the address
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
    /** Add the address*/
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
        title: 'Add the address',
        yes: index => {
          this.submitAddressForm('add', index)
        }
      })
      this.$nextTick(()  => {
        if (_refs) {
          // _refs.clearValidate()
        }
      })
    },
    /** Edit the address*/
    handleEaitAddress(row) {
      this.addressForm = JSON.parse(JSON.stringify(row))
      this.regions = [row.province_id, row.city_id, row.county_id || -1, row.town_id || -1]
      this.openLayer({
        yes: index => {
          this.submitAddressForm('edit', index)
        }
      })
    },
    /** Delete the address*/
    handleDeleteAddress(row) {
      this.$confirm('Are you sure you want to delete this address？', () => {
        API_Address.deleteAddress(row.addr_id).then(() => {
          this.$message.success('Delete the success！')
          this.GET_AddressList()
        })
      })
    },
    /** Setting the Default address*/
    handleSetDefaultAddress(item) {
      API_Address.setDefaultAddress(item.addr_id).then(() => {
        this.$message.success('Set up the success！')
        this.GET_AddressList()
      })
    },
    /** Submit address form*/
    submitAddressForm(type, index) {
      this.$refs['addressForm'].validate((valid) => {
        if (valid) {
          const { addr_id } = this.addressForm
          if (!addr_id) {
            API_Address.addAddress(this.addressForm).then(() => {
              this.$message.success('Save success！')
              this.$layer.close(index)
              this.GET_AddressList()
            })
          } else {
            API_Address.editAddress(addr_id, this.addressForm).then(response => {
              this.$message.success('Save success！')
              this.$layer.close(index)
              this.GET_AddressList()
            })
          }
        } else {
          this.$message.error('The form is filled incorrectly, please check！')
          return false
        }
      })
    },
    /** Open thelayerPopup window*/
    openLayer(params) {
      this.$layer.open({
        type: 1,
        title: 'Edit the address',
        zIndex: 200,
        area: '550px',
        scrollbar: false,
        content: $('#addressForm'),
        btn: ['confirm', 'cancel'],
        ...params
      })
    },
    /** Get address list*/
    GET_AddressList() {
      API_Address.getAddressList().then(response => {
        this.addressList = response
      })
    }
  }
}
