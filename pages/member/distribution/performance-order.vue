<template>
	<div>
		<el-table :data="performanceList" style="width: 100%">
			<el-table-column prop="sn" label="订单编号" align="center" width="200"/>
			<el-table-column label="订单金额" align="center">
				<template slot-scope="scope">
					<span class="price">{{ scope.row.order_price | unitPrice('¥') }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="member_name" label="会员名称" align="center"/>
			<el-table-column label="返利金额" align="center">
				<template slot-scope="scope">
					<span class="price">{{ scope.row.price | unitPrice('¥') }}</span>
				</template>
			</el-table-column>
			<el-table-column label="下单时间" align="center" width="200">
				<template slot-scope="scope">
					<span class="price">{{ scope.row.create_time | unixToDate('yyyy-MM-dd hh:mm') }}</span>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
  import Vue from 'vue'
  import { Table, TableColumn, Pagination } from 'element-ui'
  Vue.use(Table).use(TableColumn).use(Pagination);
  export default {
    name: 'performance-order',
	  props: ['performanceList']
  }
</script>

<style scoped>

</style>