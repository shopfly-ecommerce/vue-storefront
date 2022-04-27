<template>
  <div id="my-profile">
    <div class="member-nav">
      <ul class="member-nav-list">
        <li class="active">
          <a href="./my-profile">The personal data</a>
        </li>
      </ul>
    </div>
    <div class="profile-container">
      <div class="avatar-box">
        <el-upload
          :action="MixinUploadApi"
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleFaceChange"
          :on-success="(res) => { profileForm.face = res.url }"
        >
          <img v-if="profileForm.face" :src="profileForm.face" class="avatar">
          <img v-else src="../../assets/images/icon-noface.jpg" title="Seek the truth" class="avatar">
          <div class="eidt-mask">
            <i class="el-icon-edit-outline"></i>
            <p>Modify the picture</p>
          </div>
        </el-upload>
        <p>The avatar changes take effect after being saved</p>
      </div>
      <el-form :model="profileForm" :rules="profileRules" ref="profileForm" label-width="100px" style="width:350px">
        <el-form-item label="username" prop="uname">
          <span>{{ profileForm.uname }}</span>
        </el-form-item>
        <el-form-item label="nickname" prop="nickname">
          <el-input v-model="profileForm.nickname" placeholder="nicknamed2-20A character" minLength="2" maxlength="20" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="gender" required>
          <el-radio v-model="profileForm.sex" :label="1">male</el-radio>
          <el-radio v-model="profileForm.sex" :label="0">female</el-radio>
        </el-form-item>
        <el-form-item label="birthday">
          <el-date-picker
            v-model="profileForm.birthday"
            type="date"
            placeholder="Please choose your birthday"
            :editable="false"
            :picker-options="{disabledDate(time) { return (time.getTime() > Date.now() || time.getTime() < -2208988800000) }}"
            size="small"
            clearable
            value-format="timestamp"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Country" prop="country_code">
          <el-select
            v-model="profileForm.country_code"
            size="small"
            filterable
            clearable
            placeholder="Select country"
            style="width: 100%"
            @change="handleCountryChange"
          >
            <el-option
              v-for="item in countries"
              :key="item.code"
              :value="item.code"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="profileRules.state_code[0].required" label="State / Province / Region" prop="state_code">
          <el-select
            v-model="profileForm.state_code"
            v-loading="stateLoading"
            size="small"
            filterable
            clearable
            placeholder="Select state"
            style="width: 100%"
            @change="handleStateChange"
          >
            <el-option
              v-for="item in states"
              :key="item.code"
              :value="item.code"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Detailed address" prop="address">
          <el-input v-model="profileForm.address" placeholder="most50A character" maxlength="50" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input v-model="profileForm.email" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button @click="submitProfile">Save the data</el-button>
        </el-form-item>
      </el-form>
      <span class="clr"></span>
    </div>
    <el-dialog
      title="Modify the picture"
      :visible.sync="dialogFaceVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="432px"
      class="edit-face-dialog"
    >
      <vueCropper
        ref="cropper"
        :img="cropperImg"
        :fixed="true"
        :autoCrop="true"
        :autoCropWidth="200"
        :autoCropHeight="200"
        :centerBox="true"
        :info="false"
        outputType="png"
      ></vueCropper>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFaceVisible = false">cancel</el-button>
        <el-button size="mini" type="primary" @click="handleCropperCrop">save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { Select, Option, DatePicker, Upload, Dialog } from 'element-ui'
  import { mapGetters, mapActions } from 'vuex'
  import EnRegionPicker from "@/components/RegionPicker"
  import { RegExp } from '@/ui-utils'
  import * as API_Country from '@/api/country'
  import request from '@/utils/request'
  export default {
    name: 'my-profile',
    head() {
      return {
        title: `My profile-${this.site.title}`
      }
    },
    components: {
      EnRegionPicker,
      'el-date-picker': DatePicker,
      'el-upload': Upload,
      'el-dialog': Dialog,
      'el-select': Select,
      'el-option': Option
    },
    data() {
      return {
        /** Personal Information Form*/
        profileForm: {},
        /** Profile form rules*/
        profileRules: {
          nickname: [
            this.MixinRequired('Please enter a nickname！'),
            { min: 2, max: 20, message: 'Please enter the2～20A nickname' },
            {
              validator: (rule, value, callback) => {
                if (!RegExp.userName.test(value)) {
                  callback(new Error('Support only Chinese characters、The letter、digital、“-”、“_The combination of"！'))
                } else {
                  callback()
                }
              }
            }
          ],
          email: [
            { validator: (rule, value, callback) => {
              if (value === undefined || value === null || value === '') {
                callback()
              } else if (!RegExp.email.test(value)) {
                callback(new Error('The mailbox format is incorrect！'))
              } else {
                callback()
              } },
              trigger: 'blur'
            }
          ],
          state_code: [{ required: false, message: 'Please select a state', trigger: 'change' }]
        },
        // Modify avatar dialog
        dialogFaceVisible: false,
        // Cropped picture address
        cropperImg: '',
        countries: [],
        states: [],
        stateLoading: false
      }
    },
    mounted() {
      this.getAllCountries()
    },
    watch: {
      user: {
        immediate: true,
        handler(newVal) {
          this.profileForm = newVal ? JSON.parse(JSON.stringify(newVal)) : {}
          if (newVal.country_code) {
            this.getCountryState(newVal.country_code)
          }
        }
      }
    },
    computed: {
      ...mapGetters({ user: 'user' })
    },
    methods: {
      /** The profile picture file is changed. Procedure*/
      handleFaceChange(file) {
        const isImage = file.raw.type === 'image/jpeg' || file.raw.type === 'image/jpg' || file.raw.type === 'image/png'
        if (!isImage) {
          this.$message.error('Profile pictures can only be uploadedJPG、JPEGorPNGFormat!')
          return
        }
        this.dialogFaceVisible = true
        this.cropperImg = file.url
      },
      /** Cutting head*/
      handleCropperCrop() {
        this.$refs.cropper.getCropData(async data => {
          const formData = new FormData()
          formData.append('file', this.MixinBase64toBlob(data))
          this.handleUploadFace(formData)
        })
      },
      /** Upload a file*/
      handleUploadFace(formData) {
        request({
          url: this.MixinUploadApi,
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          this.profileForm.face = response.url
          this.dialogFaceVisible = false
          this.$message.success('The upload is successful and takes effect after being saved！')
        })
      },
      /** Save the data submission form*/
      submitProfile() {
        this.$refs['profileForm'].validate((valid) => {
          if (valid) {
            const params = JSON.parse(JSON.stringify(this.profileForm))
            params.birthday /= 1000
            this.saveUserInfo(params).then(() => {
              this.$message.success('Modify the success！')
            })
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
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
            this.profileRules.state_code[0].required = true
            this.states = res
          } else {
            this.profileRules.state_code[0].required = false
          }
        }).finally(() => {
          this.stateLoading = false
        })
      },
      /** Handle country changed */
      handleCountryChange(code) {
        const country = this.countries.find(item => item.code === code)
        if (!country) return
        this.profileForm.country = country.name
        this.profileForm.state_name = ''
        this.profileForm.state_code = ''
        this.getCountryState(code)
      },
      /** Handle state changed */
      handleStateChange(code) {
        const state = this.states.find(item => item.code === code)
        if (!state) return
        this.profileForm.state_name = state.name
      },
      ...mapActions({
        saveUserInfo: 'user/saveUserInfoAction'
      })
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .profile-container {
    padding-top: 15px;
    .avatar-box {
      float: left;
      position: relative;
      margin-left: 20px;
      margin-right: 50px;
      p { text-align: center }
      .eidt-mask {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 20;
        background-color: rgba(0,0,0,.3);
        opacity: 0;
        transition: opacity .2s ease-in;
        color: #f5f7fa;
        i { font-size: 24px }
        p { font-size: 14px }
      }
      &:hover { .eidt-mask { opacity: 1 } }
      .avatar-uploader {
        /deep/ .el-upload {
          border: 1px dashed #d9d9d9;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          border-radius: 100%;
          :hover { border-color: #409EFF }
        }
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 135px;
        height: 135px;
        line-height: 135px;
        text-align: center;
      }
      .avatar {
        width: 135px;
        height: 135px;
        display: block;
      }
    }
    /deep/ .el-form { float: left }
    /deep/ .el-date-editor.el-input { width: 100% }
    /deep/ .app-address { margin-top: 7px }
  }
  /deep/ .edit-face-dialog {
    .el-dialog__header {
      padding: 10px 10px 0 10px;
    }
    .el-dialog__body {
      padding: 10px;
      height: 350px;
    }
    .el-dialog__footer {
      padding: 10px;
    }
  }
  /deep/ {
    .el-form-item__label {
      word-break: break-word;
    }
  }
</style>
