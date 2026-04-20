<template>
	<div class="container">
		<!-- 查询 -->
		<el-form :inline="true" :model="searchForm" label-width="80px" class="search-form">
			<div class="collapse_show_item">
				<el-form-item label="项目名称:">
					<el-input v-model="searchForm.name" placeholder="项目名称"></el-input>
				</el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" clearable placeholder="请选择状态" style="width: 200px">
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
				<el-button type="primary" @click="onSearch">查询</el-button>
				<el-button @click="onReset">重置</el-button>
			</el-form-item>
		</el-form>

		<div class="btn-group">
			<el-button type="primary" @click="onAdd">新增</el-button>
		</div>

		<!-- 列表 -->
    <div>
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
          prop="status"
          label="状态"
          width="100"
          align='center'>
          <template #default="scope">
            <el-tag size="small" :type="statusType[+(scope.row.status-1)]">{{scope.row.statusText}}</el-tag>
          </template>
        </el-table-column>
				<el-table-column
					prop="failedReason"
					label="失败原因"
					min-width="110"
					align='center'
					show-overflow-tooltip>
				</el-table-column>
				<!-- <el-table-column
					prop="size"
					label="需规文档大小"
					width="100"
					align='center'
					show-overflow-tooltip>
				</el-table-column> -->
				<el-table-column
					prop="funcCont"
					label="功能点数"
					width="100"
					align='center'
					show-overflow-tooltip>
				</el-table-column>
				<el-table-column
					prop="caseCount"
					label="用例条数"
					width="100"
					align='center'
					show-overflow-tooltip>
				</el-table-column>
				<el-table-column
					prop="timeConsuming"
					label="总耗时"
					width="120"
					align='center'
					show-overflow-tooltip>
				</el-table-column>
				<el-table-column
					prop="created_at"
					label="创建时间"
					width="140"
					:formatter="timeFormatter"
					align='center'>
				</el-table-column>
				<el-table-column
					fixed="right"
					label="操作"
					width="220"
					align='center'>
					<template v-slot="scope">
						<el-button
							@click="handleDetail(scope.row)"
							type="primary"
							size="small">
							详情
						</el-button>
            <el-button
							@click="handleDownLoad(scope.row)"
							type="success"
							size="small">
							下载
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
        title="新增"
        width="58%"
        :center="true"
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <el-form :model="addForm" ref="formRef" :rules="formRules" v-loading="formLoading" label-width="164px">
          <el-form-item label="模型选择：" required prop="model">
            <el-select v-model="addForm.model" filterable placeholder="请选择模型">
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
          <el-form-item label="需求规格说明书：" required prop="requirementFile">
            <div style="display: flex; align-items: center;">
              <el-button type="primary" :loading="isUploading" @click="docxFile.click()">{{ isUploading ? '上传中...' : '点击上传文件' }}<el-icon v-if="!isUploading"  style="margin-left: 4px; font-size: 18px;"><UploadFilled /></el-icon></el-button>
              <p class="file-tip">仅支持格式：.docx（支持多个文档，大小总限制100MB）</p>
            </div>
            <template v-if="requirementFileList.length">
              <div v-for="(file, index) in requirementFileList" :key="index" class="file-content">
                <p class="file-name" :title="file.name">{{ file.name }}</p>
                <el-icon @click="removeDOCX(index)" class="delIcon"><Delete /></el-icon>
              </div>
            </template>
          </el-form-item>
          <input ref="docxFile" type="file" accept=".docx" multiple hidden @change="handleFileUpload">
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

			<el-dialog 
				v-model="previewVisible1" 
				title="文档预览" 
				width="80%"
				append-to-body
				:close-on-click-modal="false"
				@opened="handlePreviewOpened"
			>
				<div style="height: 70vh; overflow: auto;">
					<vue-office-docx :src="previewFileData" />
				</div>
			</el-dialog>
    </div>
	</div>
</template>

<script setup name="testCases">
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, onMounted, watch, onUnmounted, onActivated, onDeactivated, nextTick } from 'vue';
import { getList, getModel, getKnowledge, addTest, deleteCase, downloadCase } from '@/api/testCases';
import { uploadFile, deleteFile, getFileUrl, downloadFile } from '@/api/file';
import dayjs from 'dayjs';
import { VueDraggable } from 'vue-draggable-plus'
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'

const router = useRouter()
const route = useRoute()

const searchForm = reactive({
  name: '',
	status: null
})
const statusOptions = ref([{
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
}])
const statusType = ref(['success', 'primary', 'warning', 'danger'])

const loading = ref(false)
const tableHeight = ref(null)
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
  model: '',
	requirementFile: [],   // 物料研判传【id】
	scene_order: ['正向场景', '负向场景', '边界值场景'],
	positive_ratio: 30,
	negative_ratio: 40,
	boundary_ratio: 30,
	is_knowledge: false,   // 0 false  1 true
	knowledgeId: null,
	user_info: '',
	type: 1    // 1 生成用例   0 物料研判
})
const addForm = reactive({ ...initFormData() })
const models = ref([])
const knowledgeList = ref([])
const isUploading = ref(false)
const docxFile = ref(null)
const requirementFileList = ref([])
const fileSize = ref(0)

// 表单校验规则
const formRules = reactive({
  model: [{ required: true, message: '请选择模型', trigger: 'blur' }],
  requirementFile: [{ required: true, message: '请上传需求规格说明书', trigger: 'change' }],
  positive_ratio: [{ required: true, message: '正常场景用例占比率为必填', trigger: ['blur', 'change'] }],
  negative_ratio: [{ required: true, message: '异常场景用例占比率为必填', trigger: ['blur', 'change'] }],
	boundary_ratio: [{ required: true, message: '边界值用例占比率为必填', trigger: ['blur', 'change'] }],
	is_knowledge: [{ required: true, message: '请选择是否启用知识库', trigger: 'change' }],
  knowledgeId: [{ required: true, message: '请选择知识库', trigger: 'change' }],
  scene_order: [{ required: true, message: '场景顺序为必填', trigger: ['blur', 'change'] }]
})

const timer = ref(null)
const isListeningResize = ref(false)

const previewVisible = ref(false)

const previewVisible1 = ref(false)
// 预览的文件数据
const previewFileData = ref(null)
const isPreviewReady = ref(false)

const handlePreviewOpened = async () => {
  await nextTick()
  isPreviewReady.value = true
}

const previewFile = async (index) => {
	const res = await getFileUrl(addForm.requirementFile[index])
	const contentType = res.headers['content-type'] || res.headers['Content-Type']
	const blob = new Blob([res.data], { type: contentType })
	const link = document.createElement('a')
	link.href = URL.createObjectURL(blob)
	console.log('link.href', link.href)
	previewFileData.value = link.href
	if (!previewFileData.value) {
		return ElMessage.error('预览失败')
	}
  previewVisible1.value = true
}

const onSearch = () => {
	pagination.pageNum = 1
	getDataList()
}

const onReset = () => {
  searchForm.name = ''
  searchForm.status = null
	getDataList()
}

const startTimer = () => {
	if (timer.value) return;
  timer.value = setInterval(() => {
    getDataList()
  }, 30000)
}

const clearTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

const getDataList = async () => {
	try {
    // 构造请求参数
    const params = {
			page: pagination.pageNum,
      per_page: pagination.pageSize,
      name: searchForm.name,
      status: searchForm.status
		}
		const res = await getList(params)
		if (res.code === 200) {
			tableData.value = res.data || []
    	pagination.total = res.total_records || 0
		}
  } catch (error) {
    console.error('获取列表数据失败：', error)
    tableData.value = [] // 失败时清空列表
    pagination.total = 0
  }
}

// 日期转换
const timeFormatter = (row) => {
	return dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')
}

const handleDetail = (row) => {
	router.push({
    path: '/testCases/detail',
		query: {
			projectId: row.id,
			projectName: row.name
		}
  })
}

const handleDelete = async (row) => {
	try {
    await ElMessageBox.confirm('确定删除选中的数据吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const res = await deleteCase({ id: row.id })
    if (res.code === 200) {
      ElMessage.success('删除成功！')
      getDataList()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch (error) {
    if (error === 'cancel') {
      ElMessage.info('已取消删除！')
    }
  }
}

const handleDownLoad = async (row) => {
	try {
    const response = await downloadCase(row.id)
		const contentType = response.headers['content-type'] || response.headers['Content-Type']
    if (contentType.includes('application/json')) {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const jsonResponse = JSON.parse(reader.result)
          if (jsonResponse.code === 404) {
            ElMessage.warning(jsonResponse.message || '没有用例数据，下载失败')
          } else {
            ElMessage.error(jsonResponse.message || '下载失败')
          }
        } catch (e) {
          ElMessage.error('解析响应失败')
        }
      }
      reader.readAsText(response.data)
    } else {
      const blob = new Blob([response.data], { type: contentType })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${row.name}-测试用例.xlsx`
      document.body.appendChild(link) // 必须添加到 body 防止部分浏览器不触发
      link.click()
      link.remove()
      URL.revokeObjectURL(link.href)
    }
  } catch (error) {
    ElMessage.error('服务异常！')
    console.error('下载异常：', error)
  }
}

const getModels = async () => {
	const res = await getModel()
	if (res.code === 200) {
		models.value = res.model
		addForm.model = res.model.length > 0 ? res.model[0].model : ''
	}
}

const getKnowledges = async () => {
	const res = await getKnowledge()
	if (res.code === 200) {
		knowledgeList.value = res.data
	}
}

const onAdd = async () => {
	visibleShow.value = true
	await getModels()
	await getKnowledges()
}

// 旧方法
// const handleFileUpload = (event) => {
//   const files = Array.from(event.target.files)
// 	if (files.length === 0) return
	
// 	isUploading.value = true
// 	const validFile = []
// 	for (const file of files) {
// 		if (fileCheck(file)) {
// 			validFile.push(file)
// 		}
// 	}

// 	if (validFile.length === 0) {
// 		isUploading.value = false
// 		docxFile.value.value = ''
// 		return
// 	}
// 	requirementFileList.value = [...requirementFileList.value, ...validFile]
// 	isUploading.value = false
// 	docxFile.value.value = ''
// 	addForm.fileList = requirementFileList.value
// 	formRef.value?.clearValidate('fileList');
// }

// const fileCheck = (file) => {
//   if (!file.name.endsWith('.docx')) {
//     ElMessage.warning('仅支持.docx格式文件');
//     return false
//   }

//   const maxSize = 100 * 1024 * 1024   //  100MB

//   fileSize.value += file.size

//   if (fileSize.value > maxSize) {
//     ElMessage.warning.error('文件总大小不能超过100MB');
//     return false
//   }
//   return true
// }

const handleFileUpload = (e) => {
	if (isUploading.value) {
    ElMessage.warning('当前有文件正在上传中，请稍等！')
    return
	}
	const files = Array.from(e.target.files)
  if (files.length === 0) return

	// 过滤并校验文件格式
	const validFiles = files.filter(file => {
    if (!file.name.endsWith('.docx')) {
      ElMessage.warning(`${file.name} 不是DOCX格式，已过滤`)
      return false
    }
    return true
  })

  if (validFiles.length === 0) {
		ElMessage.info('无有效DOCX文件可上传')
		docxFile.value.value = ''
    return
	}

	const maxSize = 100 * 1024 * 1024   //  100MB
	const totalSize = validFiles.reduce((sum, file) => sum + file.size, 0)  // 本次文件大小
	const alreadySize = requirementFileList.value.reduce((sum, item) => sum + item.size, 0)  // 已上传
	const allSize = alreadySize + totalSize  // 总大小
	fileSize.value = allSize
	if (allSize > maxSize) {
    ElMessage.error(`文件总大小不能超过100MB！`)
    docxFile.value.value = ''
    return
  }
	
	isUploading.value = true
	const uploadPromises = []
  const successAttachmentIds = []
	const successFileInfos = []
	validFiles.forEach(file => {
    const formData = new FormData()
    formData.append('file', file)
    
    // 每个文件的上传Promise
    const uploadPromise = uploadFile(formData)
      .then(res => {
        if (res.code === 200) {
          successAttachmentIds.push(res.data?.attachmentId)
					successFileInfos.push({ name: file.name, size: file.size })
					formRef.value.clearValidate('requirementFile');
          return true
        } else {
          ElMessage.error(`${file.name} 上传失败：${res.message || '服务器处理异常'}`)
          return false
        }
      })
      .catch(() => {
        return false
      })
    uploadPromises.push(uploadPromise)
	})
	
	Promise.allSettled(uploadPromises).then(() => {
    if (successAttachmentIds.length > 0) {
      addForm.requirementFile = [...addForm.requirementFile, ...successAttachmentIds]
      requirementFileList.value = [...requirementFileList.value, ...successFileInfos]
      ElMessage.success(`成功上传 ${successAttachmentIds.length} 个文件，失败 ${validFiles.length - successAttachmentIds.length} 个`)
    }
  }).finally(() => {
		docxFile.value.value = ''
    isUploading.value = false
  })
}

const removeDOCX = async (index) => {
	if (!addForm?.requirementFile || index < 0 || index >= addForm.requirementFile.length) {
    return
	}
	try {
		const res = await deleteFile({attachmentId: addForm.requirementFile[index]})
		if (res.code === 200) {
			fileSize.value = fileSize.value - requirementFileList.value[index].size
			requirementFileList.value.splice(index, 1)
			addForm.requirementFile.splice(index, 1)
			ElMessage.success('文件删除成功')
		} else {
      ElMessage.error(res.message || '文件删除失败，请重试！')
    }
	} catch(err) {
		console.error('删除文件异常：', err)
	}
}

const handleClose = async () => {
	try {
		if (addForm.requirementFile.length > 0 && requirementFileList.value.length > 0) {
			const fileId = addForm.requirementFile.join(',')
			await deleteFile({attachmentId: fileId})
		}
	} catch (err) {
		console.error('文件删除失败：', err)
	} finally {
		requirementFileList.value = []
		docxFile.value.value = ''
		fileSize.value = 0
		Object.assign(addForm, initFormData())
		formRef.value?.clearValidate()
		visibleShow.value = false
	}
}

const countSize = (bytes) => {
	if (bytes === 0)  return  '0KB'

	const mb = bytes / (1024 * 1024)

	if (mb < 1) {
		const kb = bytes / 1024
		return `${Math.round(kb)}KB`
	} else {
		return `${mb.toFixed(1)}MB`
	}
}

const handleSave = async () => {
	if (!formRef) return
	await formRef.value.validate()
	
	if (requirementFileList.value.length <= 0) {
		return ElMessage.error('需求规格说明书不能为空！');
	}
	if ((addForm.positive_ratio + addForm.negative_ratio + addForm.boundary_ratio) !== 100) {
		return ElMessage.error('三个场景用例占比率总和必须等于 100%！');
	}
	formLoading.value = true
	const data = JSON.parse(JSON.stringify(addForm))
	const size = countSize(fileSize.value)
	data.is_knowledge = data.is_knowledge ? 1 : 0
	if (!data.is_knowledge) {
		delete data.knowledgeId
	}
	data.size = size
	// const formData = new FormData()
	// for (const key in data) {
	// 	formData.append(key, data[key])
	// }
	// const size = countSize(fileSize.value)
	// requirementFileList.value.forEach((file) => {
	// 	formData.append('requirementFile', file)
	// })
	// formData.append('size', size)
	try {
		addTest(data).then(response => {
			if (response.code === 200) {
				formLoading.value = false
				requirementFileList.value = []
				addForm.requirementFile = []
				docxFile.value.value = ''
				visibleShow.value = false;
				getDataList()
				ElMessage.success('新增成功！');
			}
		}).catch((err) => {
			console.log('err', err)
			formLoading.value = false
		})
	} catch (error) {
		console.log('error', error)
		formLoading.value = false
		ElMessage.error('新增失败，请重试！');
	}
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

const bindResize = () => {
  if (isListeningResize.value) return

  window.addEventListener('resize', calcTableHeight)
  isListeningResize.value = true
}

const unbindResize = () => {
  window.removeEventListener('resize', calcTableHeight)
	isListeningResize.value = false
}

onMounted(() => {
	getDataList()
	calcTableHeight()
	startTimer()
	bindResize()
})

onUnmounted(() => {
	clearTimer()
  unbindResize()
})

onActivated(() => {
	startTimer()
	bindResize()
})

onDeactivated(() => {
	clearTimer()
	unbindResize()
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
.el-form--inline .el-form-item {
  margin-right: 10px;
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
  width: 100%;
}
.file-name {
	margin: 4px 0;
	width: 88%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
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
  background: #F3F4F6;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: move;
}
</style>