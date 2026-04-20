<template>
	<div class="container">
		<!-- 查询 -->
		<el-form :inline="true" :model="searchForm" label-width="80px" class="search-form">
			<div class="collapse_show_item">
				<el-form-item label="项目名称:">
					<el-input v-model="searchForm.name" placeholder="项目名称"></el-input>
				</el-form-item>
			</div>
			<el-form-item class="search-btn">
				<el-button type="primary" @click="onSearch">查询</el-button>
				<el-button @click="onReset">重置</el-button>
			</el-form-item>
		</el-form>

		<div class="btn-group">
			<el-button type="primary" @click="onAdd">新增</el-button>
		</div>

		<!-- 列表 -->
    <div class="common-table">
      <el-table v-loading="loading"
				element-loading-text="拼命加载中"
				:data="tableData"
				:height="tableHeight"
				size="small"
				border
				style="width: 100%">
				<el-table-column
					type="index"
					label="序号"
					width="60"
					align='center'>
				</el-table-column>
				<el-table-column
					prop="name"
					label="项目名称"
					min-width="140"
					align='center'>
				</el-table-column>
				<el-table-column
					prop="entrust"
					label="委托单"
					width="110"
					align='center'>
					<template #default="scope">
						<div style="height: 100%; display: flex; align-items: center; justify-content: center;">
							<el-icon 
								size="18"
								:color="scope.row.entrust ? '#67c23a' : '#F56C6C'"
							>
								<Check v-if="scope.row.entrust" />
								<Close v-else />
							</el-icon>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="demand"
					label="需求规格说明书"
					width="110"
					align='center'>
					<template #default="scope">
						<div style="height: 100%; display: flex; align-items: center; justify-content: center;">
							<el-icon 
								size="18"
								:color="scope.row.demand ? '#67c23a' : '#F56C6C'"
							>
								<Check v-if="scope.row.demand" />
								<Close v-else />
							</el-icon>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="asset"
					label="资产收集表"
					width="110"
					align='center'>
					<template #default="scope">
						<div style="height: 100%; display: flex; align-items: center; justify-content: center;">
							<el-icon 
								size="18"
								:color="scope.row.asset ? '#67c23a' : '#F56C6C'"
							>
								<Check v-if="scope.row.asset" />
								<Close v-else />
							</el-icon>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="case"
					label="功能测试用例"
					width="110"
					align='center'>
					<template #default="scope">
						<div style="height: 100%; display: flex; align-items: center; justify-content: center;">
							<el-icon 
								size="18"
								:color="scope.row.case ? '#67c23a' : '#F56C6C'"
							>
								<Check v-if="scope.row.case" />
								<Close v-else />
							</el-icon>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="perf"
					label="性能测试清单"
					width="110"
					align='center'>
					<template #default="scope">
						<div style="height: 100%; display: flex; align-items: center; justify-content: center;">
							<el-icon 
								size="18"
								:color="scope.row.perf ? '#67c23a' : '#F56C6C'"
							>
								<Check v-if="scope.row.perf" />
								<Close v-else />
							</el-icon>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="cybersecurity"
					label="网络安全设计方案"
					width="120"
					align='center'>
					<template #default="scope">
						<div style="height: 100%; display: flex; align-items: center; justify-content: center;">
							<el-icon 
								size="18"
								:color="scope.row.cybersecurity ? '#67c23a' : '#F56C6C'"
							>
								<Check v-if="scope.row.cybersecurity" />
								<Close v-else />
							</el-icon>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					fixed="right"
					label="操作"
					width="220"
					align='center'>
					<template v-slot="scope">
						<!-- 传project_name 项目名称  type:0  需求规格说明书(DOCX)[id, id] -->
						<el-button
							@click="addCases(scope.row)"
							type="success"
							size="small"
							v-if="scope.row.demand_docx">
							生成用例
						</el-button>
						<el-button
							@click="handleDetail(scope.row)"
							type="primary"
							size="small">
							详情
						</el-button>
						<el-button
							@click="handleDelete(scope.row)"
							type="danger"
							size="small">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="pagination.pageNum"
				:page-sizes="[10, 20, 30, 40, 50, 100]"
				:total="pagination.total"
				:page-size="pagination.pageSize"
				:firstPage="1"
				:layout="pagination.layout"
				style="margin-top:20px; text-align:right;">
			</el-pagination>

			<el-dialog
        v-model="visibleShow"
        title="生成用例"
        width="58%"
        :center="true"
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <el-form :model="addForm" ref="formRef" :rules="formRules" v-loading="formLoading" label-width="164px">
          <el-form-item label="模型选择：" required prop="modelValue">
            <el-select v-model="addForm.modelValue" filterable placeholder="请选择模型">
              <el-option
                v-for="item in models"
                :key="item.model"
                :label="item.name"
                :value="item.model">
              </el-option>
            </el-select>
          </el-form-item>
					<el-form-item required prop="scene_order" class="flex-center">
						<template #label>
							<span>场景顺序</span>
							<el-tooltip content="💡长按拖动选项，可调整场景顺序" placement="top" >
								<el-icon class="tip-icon"><Warning /></el-icon>
							</el-tooltip>:
						</template>
           <VueDraggable v-model="addForm.scene_order" ghostClass="ghost" class="drag-container">
						<div v-for="item in addForm.scene_order" :key="item" class="drag-item">
							{{ item }}
						</div>
					</VueDraggable>
          </el-form-item>
					<el-form-item label="正常场景用例占比率：" required prop="positive_ratio">
						<el-slider v-model="addForm.positive_ratio" show-input :step="10" />
					</el-form-item>
					<el-form-item label="异常场景用例占比率：" required prop="negative_ratio">
						<el-slider v-model="addForm.negative_ratio" show-input :step="10" />
					</el-form-item>
					<el-form-item label="边界值用例占比率：" required prop="boundary_ratio">
						<el-slider v-model="addForm.boundary_ratio" show-input :step="10" />
					</el-form-item>
					<el-form-item label="是否启用知识库：" required prop="is_knowledge">
						<el-switch v-model="addForm.is_knowledge" active-text="启用" inactive-text="不启用" />
					</el-form-item>
					<el-form-item label="知识库：" required prop="knowledgeId" v-if="addForm.is_knowledge">
						<el-select
							v-model="addForm.knowledgeId"
							multiple
							placeholder="请选择知识库"
						>
							<el-option
								v-for="item in knowledgeList"
								:key="item.id"
								:label="item.name"
								:value="item.id"
							/>
						</el-select>
					</el-form-item>
					<el-form-item label="用户输入的信息：" prop="user_info">
						<el-input
							v-model="addForm.user_info"
							maxlength="200"
							placeholder="用户输入的信息"
							show-word-limit
							:autosize="{ minRows: 3 }"
							type="textarea"
						/>
					</el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="handleClose">取消</el-button>
            <el-button 
              type="primary" @click="handleSave">
              保存
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
	</div>
</template>

<script setup name="materialAnalysis">
import { VueDraggable } from 'vue-draggable-plus'
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, onMounted, watch, onUnmounted } from 'vue';
import { getList, deleteMaterial } from '@/api/materialAnalysis';
import { getModel, getKnowledge, addTest } from '@/api/testCases';

const router = useRouter()
const route = useRoute()

const tableHeight = ref(null)

const searchForm = reactive({
	name: ''
})
const loading = ref(false)
const tableData = ref([])

const pagination = reactive({
	total: 0,
	pageNum: 1,
	pageSize: 20,
	lastPage: 0,
	background: true,
	layout: 'total, sizes, prev, pager, next, ->, jumper'
})

const visibleShow = ref(false)
const formRef = ref(null)
const formLoading = ref(false)
const initFormData = () => ({
	project_name: '',
  modelValue: '',
	requirementFile: [],   // 物料研判传【id】
	scene_order: ['正向场景', '负向场景', '边界值场景'],
	positive_ratio: 30,
	negative_ratio: 40,
	boundary_ratio: 30,
	is_knowledge: false,   // 0 false  1 true
	knowledgeId: null,
	user_info: '',
	type: 0    // 1 生成用例   0 物料研判
})
const addForm = reactive({ ...initFormData() })
const models = ref([])
const knowledgeList = ref([])
// 表单校验规则
const formRules = reactive({
  modelValue: [{ required: true, message: '请选择模型', trigger: 'blur' }],
  positive_ratio: [{ required: true, message: '正常场景用例占比率为必填', trigger: ['blur', 'change'] }],
  negative_ratio: [{ required: true, message: '异常场景用例占比率为必填', trigger: ['blur', 'change'] }],
	boundary_ratio: [{ required: true, message: '边界值用例占比率为必填', trigger: ['blur', 'change'] }],
	is_knowledge: [{ required: true, message: '请选择是否启用知识库', trigger: 'change' }],
  knowledgeId: [{ required: true, message: '请选择知识库', trigger: 'change' }],
  scene_order: [{ required: true, message: '场景顺序为必填', trigger: ['blur', 'change'] }]
})

const onSearch = () => {
	pagination.pageNum = 1
	getDataList()
}

const onReset = () => {
	searchForm.name = ''
	getDataList()
}

const getDataList = async () => {
	try {
    // 构造请求参数
    const params = {
			name: searchForm.name,
			page: pagination.pageNum,
			page_size: pagination.pageSize,
		}
		
		// for (let i = 1; i <= 15; i++) {
		// 	tableData.value.push({
		// 		id: i,
		// 		name: `用户${i}`
		// 	})
		// }
    
    // 调用接口获取数据
		const res = await getList(params)
    
    if (res.code === 200) {
			tableData.value = res.data || []
    	pagination.total = res.total_records || 0
		}
  } catch (error) {
    tableData.value = [] // 失败时清空列表
    pagination.total = 0
  }
}

// 删除
const handleDelete = (row) => {
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
	.then(async () => {
		deleteMaterial(row.id).then((res) => {
			if (res.code === 200) {
				getDataList()
				ElMessage.success('删除成功！')
			} else {
				ElMessage.error(res.message);
			}
		}).catch(() => {});
	})
	.catch(() => {});
}

const onAdd = () => {
	router.push('/materialAnalysis/add')
}

const handleDetail = (row) => {
	router.push({
    path: '/materialAnalysis/detail',
    query: { id: row.id }
  })
}

// 处理页数改变
const handleCurrentChange = (val) => {
	pagination.pageNum = val
	getDataList()
}

const handleSizeChange = (val) => {
	pagination.pageSize = val
	pagination.pageNum = 1
	getDataList()
}

const calcTableHeight = () => {
	const clientHeight = document.documentElement.clientHeight
	tableHeight.value = clientHeight - 350
}

const getModels = async () => {
	const res = await getModel()
	if (res.code === 200) {
		models.value = res.model
		addForm.modelValue = res.model.length > 0 ? res.model[0].model : ''
	}
}

const getKnowledges = async () => {
	const res = await getKnowledge()
	if (res.code === 200) {
		knowledgeList.value = res.data
	}
}

const addCases = async (row) => {
	visibleShow.value = true
	await getModels()
	await getKnowledges()
	addForm.project_name = row.name
	addForm.requirementFile = row.demand_docx ? row.demand_docx.split(',') : []
}

const handleClose = () => {
	Object.assign(addForm, initFormData())
  formRef.value?.clearValidate()
  visibleShow.value = false
}

const handleSave = async () => {
	if (!formRef) return
	await formRef.value.validate()
	
	if (addForm.requirementFile.length <= 0) {
		return ElMessage.error('需求规格说明书不能为空！');
	}
	if ((addForm.positive_ratio + addForm.negative_ratio + addForm.boundary_ratio) !== 100) {
		return ElMessage.error('三个场景用例占比率总和必须等于 100%！');
	}
	formLoading.value = true
	const data = JSON.parse(JSON.stringify(addForm))
	data.is_knowledge = data.is_knowledge ? 1 : 0
	if (!data.is_knowledge) {
		delete data.knowledgeId
	}
	try {
		addTest(data).then(response => {
			if (response.code === 200) {
				formLoading.value = false
				handleClose()
				ElMessage.success('用例新增成功！可到【用例生成】页面查看详情');
			}
		}).catch((err) => {
			console.log('err', err)
			formLoading.value = false
		})
	} catch (error) {
		console.log('error', error)
		formLoading.value = false
		ElMessage.error('用例新增失败，请重试！');
	}
}

onMounted(() => {
	getDataList()
	calcTableHeight()

  window.addEventListener('resize', calcTableHeight)
})

watch(
  // 监听路由路径变化
  () => route.path,
  () => { getDataList() },
  { immediate: true }
)

onUnmounted(() => {
  window.removeEventListener('resize', calcTableHeight)
})
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
:deep(.el-table__fixed-right-patch) {
	position: absolute;
	top: -1px;
	right: 0;
	background-color: #f5f5f5;
}
.flex-center {
	align-items: center;
	padding-top: 10px;
}
.tip-icon {
  margin-left: 2px;
  cursor: help;
  font-size: 16px;
  vertical-align: middle;
}
.ghost {
	opacity: 0.5 !important;
  background: #c8ebfb !important;
}
.drag-container {
	display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 20px;
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  box-sizing: border-box;
}
.drag-item {
	padding: 10px 16px;
  border: 1px solid #dcdfe6;
	background: #F3F4F6;
  border-radius: 4px;
  cursor: move;
}
</style>
