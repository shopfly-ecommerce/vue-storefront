<template>
	<el-table :data="performanceList" style="width: 100%">
		<el-table-column prop="sn" label="结算单编号" align="center"/>
		<el-table-column label="结算时间" align="center">
			<template slot-scope="scope">
				<span class="price">{{ scope.row.end_time | unixToDate('yyyy-MM-dd hh:mm') }}</span>
			</template>
		</el-table-column>
		<el-table-column label="结算金额" align="center">
			<template slot-scope="scope">
				<span class="price">{{ scope.row.final_money | unitPrice('¥') }}</span>
			</template>
		</el-table-column>
		<el-table-column label="操作" align="center">
			<template slot-scope="scope">
				<el-button size="small" @click="$emit('newBill', scope.row)">查看详情</el-button>
			</template>
		</el-table-column>
	</el-table>
</template>

<script>
  import Vue from 'vue'
  import { Table, TableColumn, Pagination } from 'element-ui'
  Vue.use(Table).use(TableColumn).use(Pagination);
  export default {
    name: 'performance-history',
	  props: ['performanceList']
  }
</script>

<style scoped>

</style>