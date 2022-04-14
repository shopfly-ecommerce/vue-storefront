<template>
  <div id="shipping-address">
    <div class="member-nav">
      <ul class="member-nav-list">
        <li class="active">
          <a href="./shipping-address">Delivery address management</a>
        </li>
      </ul>
      <el-button size="mini" class="add-address-btn" @click="handleAddAddress($refs.addressForm)">Add the address</el-button>
    </div>
    <div class="address-list">
      <el-alert
        title="Helpful hints"
        type="warning"
        description="Save at most20A shipping address"
        close-text="I know the"
        show-icon>
      </el-alert>
      <el-table
        :data="addressList"
        :header-cell-style="{textAlign: 'center'}"
        cell-class-name="address-cell"
        style="width: 100%"
      >
        <el-table-column prop="name" label="The consignee" width="100"/>
        <el-table-column label="In the area" width="200" :formatter="areaFormatter"/>
        <el-table-column prop="addr" label="Detailed address" width="280" align="left"/>
        <el-table-column prop="ship_address_name" label="Address the alias" width="100" align="left"/>
        <el-table-column prop="mobile" label="contact" width="120"/>
        <el-table-column label="default" width="60">
          <template slot-scope="scope">{{ scope.row.def_addr ? 'is' : 'no' }}</template>
        </el-table-column>
        <el-table-column label="Operation" width="110">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleEaitAddress(scope.row)">edit</el-button>
            <el-button type="text" size="mini" class="delete-btn" @click="handleDeleteAddress(scope.row)">delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div id="addressForm" style="display: none">
      <el-form :model="addressForm" :rules="addressRules" ref="addressForm" label-width="100px" style="width: 450px">
        <el-form-item label="Name of consignee" prop="name">
          <el-input v-model="addressForm.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="contact" prop="mobile">
          <el-input v-model="addressForm.mobile" size="small" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="Receiving area" prop="region">
          <en-region-picker :api="MixinRegionApi" :default="regions" @changed="(object) => { this.addressForm.region = object.last_id }" ref="regionPicker"/>
        </el-form-item>
        <el-form-item label="Detailed address" prop="addr">
          <el-input v-model="addressForm.addr" size="small"></el-input>
        </el-form-item>
        <el-form-item label="Address the alias" prop="ship_address_name">
          <el-input v-model="addressForm.ship_address_name" size="small" placeholder="The company、In the home、School or something"></el-input>
        </el-form-item>
        <el-form-item label="Set to default">
          <el-checkbox v-model="addressForm.def_addr" :true-label="1" :false-label="0">default</el-checkbox>
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
        title: `My shipping address-${this.site.title}`
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
