<template>
	<div class="container">
		页面1
		<!-- 查询 -->
		<el-form :inline="true" :model="searchForm" label-width="80px" class="search-form">
			<div class="collapse_show_item">
				<el-form-item label="项目名称">
					<el-input v-model="searchForm.name" placeholder="项目名称"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="searchForm.status" clearable placeholder="请选择状态">
						<el-option
							v-for="item in statusOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
			</div>
			<el-form-item class="search-btn">
				<el-button type="primary" size="mini" @click="onSearch">查询</el-button>
				<el-button size="mini" @click="onReset">重置</el-button>
			</el-form-item>
		</el-form>

		<div class="btn-group">
			<el-button type="primary" size="mini" @click="onAdd">新增</el-button>
		</div>
	</div>
</template>

<script setup name="pageone">
import { reactive } from 'vue';

const searchForm = reactive({
	name: '',
  status: ''
})

const statusOptions =  reactive(
	[{
		value: 1,
		label: '完成'
	}, {
		value: 2,
		label: '进行中'
	}, {
		value: 3,
		label: '等待中'
	}, {
		value: 4,
		label: '失败'
	}]
)

const onSearch = () => {}

const onReset = () => {}
</script>

<style lang="scss" scoped>
.search-form {
	display: flex;
	border-bottom: 1px solid #cbd1dc;
	:deep(.el-input__inner) {
		height: 28px;
		line-height: 28px;
	}
}
.collapse_show_item {
	display: flex;
	flex: 1;
	margin-right: 28px;
}
.search-btn {
	margin-right: 0;
}
.btn-group {
	padding: 20px 0;
	display: flex;
	justify-content: flex-end;
}
.el-table {
	:deep(.tableHeaderStyle) {
		background: #f5f5f5;
		font-size: 12px;
		color: #606266;
	}
}
.file-tip {
	font-size: 12px;
	color: #606266;
	//margin-top: 7px;
  margin-left: 15px;
	line-height: 1;
}
.file-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	line-height: normal;
}
.file-name {
	margin: 4px 0;
	width: 88%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.common-table {
  height: 90%;
}
::v-deep .el-table__fixed-right-patch {
	position: absolute;
	top: -1px;
	right: 0;
	background-color: #f5f5f5;
}
</style>
