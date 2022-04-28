<template>
  <div id="shipping-address">
    <div class="member-nav">
      <ul class="member-nav-list">
        <li class="active">
          <a href="./shipping-address">Delivery address management</a>
        </li>
      </ul>
      <el-button size="mini" class="add-address-btn" @click="handleAddAddress">
        Add the address
      </el-button>
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
            <el-button type="text" size="mini" @click="handleEditAddress(scope.row)">edit</el-button>
            <el-button type="text" size="mini" class="delete-btn" @click="handleDeleteAddress(scope.row)">delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div id="addressForm" style="display: none">
      <el-form :model="addressForm" :rules="addressRules" ref="addressForm">
        <el-form-item label="Full name (First and Last name)" prop="name">
          <el-input v-model="addressForm.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="Contact" prop="mobile">
          <el-input v-model="addressForm.mobile" size="small"></el-input>
        </el-form-item>
        <el-form-item label="Country" prop="country_code">
          <el-select
            v-model="addressForm.country_code"
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
        <el-form-item v-if="addressRules.state_code[0].required" label="State / Province / Region" prop="state_code">
          <el-select
            v-model="addressForm.state_code"
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
        <el-form-item label="City" prop="city">
          <el-input v-model="addressForm.city" size="small"></el-input>
        </el-form-item>
        <el-form-item label="Detailed address" prop="addr">
          <el-input v-model="addressForm.addr" size="small"></el-input>
        </el-form-item>
        <el-form-item label="Zip code" prop="zip_code">
          <el-input v-model="addressForm.zip_code" size="small"></el-input>
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
import { Select, Option } from 'element-ui'
import addressMixin from './addressMixin'

export default {
  name: 'shipping-address',
  components: { 'el-select': Select, 'el-option': Option },
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
  /deep/ .el-alert {
    margin: 10px 0
  }
  /deep/ .delete-btn {
    color: $color-main
  }
  /deep/ .address-cell {
    text-align: center;
  }
}
#addressForm {
  padding: 10px 20px;
  /deep/ .app-address {
    margin-top: 7px
  }
  /deep/ {
    .el-form-item__label,
    .el-form-item__content {
      line-height: 25px;
    }
  }
}
</style>
