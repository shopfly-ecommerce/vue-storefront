<template>
	<el-table :data="performanceList" style="width: 100%">
		<el-table-column prop="sn" label="Statement no" align="center"/>
		<el-table-column label="Clearing time" align="center">
			<template slot-scope="scope">
				<span class="price">{{ scope.row.end_time | unixToDate('yyyy-MM-dd hh:mm') }}</span>
			</template>
		</el-table-column>
		<el-table-column label="The settlement amount" align="center">
			<template slot-scope="scope">
				<span class="price">{{ scope.row.final_money | unitPrice('¥') }}</span>
			</template>
		</el-table-column>
		<el-table-column label="Operation" align="center">
			<template slot-scope="scope">
				<el-button size="small" @click="$emit('newBill', scope.row)">Check the details</el-button>
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
