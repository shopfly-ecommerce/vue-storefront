/**
 * Created by Andste on 2018/6/13.
 * Personal center and settlement page reuse
 */

import * as API_Address from '@/api/address'
import * as API_Country from '@/api/country'

import { RegExp } from '@/ui-utils'
import el from 'element-ui/src/locale/lang/el.js'
export default {
  data() {
    return {
      // Address list
      addressList: [],
      // Add and edit address forms
      addressForm: {
        name: '',
        mobile: '',
        country_code: '',
        state_code: '',
        city: '',
        zip_code: ''
      },
      // Add and edit address form rules
      addressRules: {
        name: [
          this.MixinRequired('Please enter the name of consignee'),
          { min: 2, max: 20, message: 'The length of2 to20 A character', trigger: 'blur' }
        ],
        mobile: [this.MixinRequired('Please enter contact information！')],
        country_code: [{ required: true, message: 'Please select a country', trigger: 'change' }],
        state_code: [{ required: false, message: 'Please select a state', trigger: 'change' }],
        city: [this.MixinRequired('Please enter the city')],
        zip_code: [this.MixinRequired('Please enter the zip code')],
        addr: [
          this.MixinRequired('Please enter the detailed address！'),
          { min: 1, max: 50, message: 'The length of1 to50 A character', trigger: 'blur' }
        ]
      },
      countries: [],
      states: [],
      stateLoading: false
    }
  },
  mounted() {
    this.getAllCountries()
    this.GET_AddressList()
  },
  methods: {
    areaFormatter(row) {
      return row.country + row.state_name + row.city + row.addr
    },
    /** Add the address*/
    handleAddAddress(_refs) {
      this.addressForm = {
        name: '',
        mobile: '',
        country_code: '',
        state_code: '',
        city: '',
        addr: '',
        zip_code: '',
        ship_address_name: '',
        def_addr: 0
      }
      this.addressRules.state_code[0].required = false
      this.openLayer({
        title: 'Add the address',
        yes: index => {
          this.submitAddressForm('add', index)
        }
      })
    },
    /** Edit the address*/
    handleEditAddress(row) {
      this.addressForm = JSON.parse(JSON.stringify(row))
      this.getCountryState(this.addressForm.country_code)
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
    },
    /** Handle country changed */
    handleCountryChange(code) {
      const country = this.countries.find(item => item.code === code)
      this.addressForm.country = country.name
      this.addressForm.state_name = ''
      this.addressForm.state_code = ''
      this.getCountryState(code)
    },
    /** Handle state changed */
    handleStateChange(code) {
      const state = this.states.find(item => item.code === code)
      this.addressForm.state_name = state.name
    },
    /** Get all countries */
    getAllCountries() {
      API_Country.getCountries().then(res => {
        this.countries = res
      })
    },
    /** Get country state */
    getCountryState(code) {
      this.stateLoading = true
      this.states = []
      API_Country.getStates(code).then(res => {
        if (res && res.length) {
          this.addressRules.state_code[0].required = true
          this.states = res
        } else {
          this.addressRules.state_code[0].required = false
        }
      }).finally(() => {
        this.stateLoading = false
      })
    }
  }
}
