<template>
  <div id="shipping-address">
    <div class="member-nav">
      <ul class="member-nav-list">
        <li class="active">
          <a href="./shipping-address">收货地址管理</a>
        </li>
      </ul>
      <el-button size="mini" class="add-address-btn" @click="handleAddAddress($refs.addressForm)">添加地址</el-button>
    </div>
    <div class="address-list">
      <el-alert
        title="友情提示"
        type="warning"
        description="最多只能保存20个收货地址"
        close-text="我知道了"
        show-icon>
      </el-alert>
      <el-table
        :data="addressList"
        :header-cell-style="{textAlign: 'center'}"
        cell-class-name="address-cell"
        style="width: 100%"
      >
        <el-table-column prop="name" label="收货人" width="100"/>
        <el-table-column label="所在地区" width="200" :formatter="areaFormatter"/>
        <el-table-column prop="addr" label="详细地址" width="280" align="left"/>
        <el-table-column prop="ship_address_name" label="地址别名" width="100" align="left"/>
        <el-table-column prop="mobile" label="联系方式" width="120"/>
        <el-table-column label="默认" width="60">
          <template slot-scope="scope">{{ scope.row.def_addr ? '是' : '否' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="110">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleEaitAddress(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" class="delete-btn" @click="handleDeleteAddress(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div id="addressForm" style="display: none">
      <el-form :model="addressForm" :rules="addressRules" ref="addressForm" label-width="100px" style="width: 450px">
        <el-form-item label="收货人姓名" prop="name">
          <el-input v-model="addressForm.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="mobile">
          <el-input v-model="addressForm.mobile" size="small" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="收货地区" prop="region">
          <en-region-picker :api="MixinRegionApi" :default="regions" @changed="(object) => { this.addressForm.region = object.last_id }" ref="regionPicker"/>
        </el-form-item>
        <el-form-item label="详细地址" prop="addr">
          <el-input v-model="addressForm.addr" size="small"></el-input>
        </el-form-item>
        <el-form-item label="地址别名" prop="ship_address_name">
          <el-input v-model="addressForm.ship_address_name" size="small" placeholder="公司、家里、学校或其它"></el-input>
        </el-form-item>
        <el-form-item label="设置为默认">
          <el-checkbox v-model="addressForm.def_addr" :true-label="1" :false-label="0">默认</el-checkbox>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import addressMixin from './addressMixin'
  export default {
    name: 'shipping-address',
    head() {
      return {
        title: `我的收货地址-${this.site.title}`
      }
    },
    mixins: [addressMixin]
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/styles/color";
  .add-address-btn {
    position: absolute;
    top: 0;
    right: 0;
  }
  .address-list {
    /deep/ .el-alert { margin: 10px 0}
    /deep/ .delete-btn { color: $color-main }
    /deep/ .address-cell {
      text-align: center;
    }
  }
  #addressForm{
    padding: 10px 20px;
    /deep/ .app-address { margin-top: 7px }
  }
</style>
