<template>
	<div class="container">
		<!-- 查询 -->
		<el-form :inline="true" :model="searchForm" label-width="80px" class="search-form">
			<div class="collapse_show_item">
				<el-form-item label="方案名称:">
					<el-input v-model="searchForm.name" placeholder="方案名称"></el-input>
				</el-form-item>
				<el-form-item label="状态:">
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
			<el-button type="primary" @click="onAdd">生成测试方案</el-button>
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
					label="方案名称"
					min-width="140"
					align='center'>
				</el-table-column>
				<el-table-column
					prop="radio"
					label="是否涉及移动端"
					width="110"
					align='center'>
					<template #default="scope">
            {{ scope.row.radio === 2 ? '否' : '是' }}
          </template>
				</el-table-column>
				<el-table-column
					prop="status"
					label="状态"
					width="100"
					align='center'>
					<template #default="scope">
            <el-tag size="small" :type="statusType[+(scope.row.status-1)].type">{{statusType[+(scope.row.status-1)].label}}</el-tag>
          </template>
				</el-table-column>			
				<el-table-column
					prop="failed_reason"
					label="失败原因"
					min-width="100"
					align='center'
					show-overflow-tooltip>
					<template #default="scope">
            {{ scope.row.failed_reason ? scope.row.failed_reason : '--' }}
          </template>
				</el-table-column>
				<el-table-column
					prop="created_at"
					label="创建时间"
					width="140"
					:formatter="dayFormatter"
					align='center'>
				</el-table-column>
				<el-table-column
					fixed="right"
					label="操作"
					width="200"
					align='center'>
					<template v-slot="scope">
						<el-button
							@click="previewFile(scope.row.final_word)"
							type="primary"
							size="small"
							:disabled="!scope.row.final_word">
							预览
						</el-button>
            <el-button
							@click="handleDownLoad(scope.row)"
							type="success"
							size="small"
							:disabled="!scope.row.final_word">
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
		</div>

		<!-- 生成测试方案 -->
		<el-dialog
			v-model="dialogVisible"
			title="生成测试方案"
			width="56%"
			:before-close="handleClose"
			:close-on-click-modal="false"
			destroy-on-close
			class="inner-scroll-dialog" 
		>
			<el-form label-width="140px" :model="form" :rules="formRules" ref="formRef" v-loading="generateLoading" element-loading-text="生成测试方案中...">
				<div class="tips-contant">
					<p class="highlight">温馨提示：</p>
					<p class="highlight">1、如文档格式不一致，请手动用WPS打开文档，另存为对应的文档格式！如：.doc转.docx  .xls转.xlsx</p>
					<p>2、《委托单》《需求规格说明书》《资产收集表》必传！缺一不可！</p>
					<p class="highlight">3、需规存在多分册情况下，请注意手动将文档名称调整为“XXX说明书-XX分册”，分册名放在横行“-”最后！</p>
					<p>4、性能清单表：如《委托单》文档中的《测试需求》没涉及性能，可以不上传，反之，必传！！</p>
					<p>5、Excel表格中《表头》需保持一致，案例模板：性能清单表： <el-button text type="primary" @click="downloadTemplate(1)">性能清单表模板</el-button>  资产收集表：<el-button text type="primary" @click="downloadTemplate(2)" style="margin-left: 0;">资产收集表模板</el-button></p>
					<p class="highlight">6、如果《安全用例范围》有变动，则需要上传更改模板：安全范围：<el-button text type="primary" @click="downloadTemplate(3)">安全用例模板</el-button> 上传更改模板：<el-button text type="primary" @click="secureDialog=true" style="margin-left: 0;">上传文档</el-button></p>
				</div>

				<el-form-item label="是否涉及移动端：" prop="radio" required>
					<el-radio-group v-model="form.radio">
						<el-radio value="1">是</el-radio>
						<el-radio value="2">否</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="文档模板：" prop="modelFile" required>
					<el-select v-model="form.modelFile" placeholder="请选择文档模板" style="width: 56%;">
						<el-option
							v-for="item in documentList"
							:key="item.file_id"
							:label="item.name"
							:value="item.file_id"
						/>
					</el-select>
				</el-form-item>

				<el-form-item label="委托单文档：" prop="commissionFile" required>
					<el-upload
						ref="commissionRef"
						class="drag-upload-area"
						drag
						:auto-upload="false"
						:multiple="false"
						:show-file-list="false"
						accept=".docx"
						:on-change="(uploadFile, uploadFiles) => handleFileChange(uploadFile, uploadFiles, uploadConfig.commissionFile)"
						:disabled="commissionLoading"
					>
						<el-icon class="upload-icon"><UploadFilled /></el-icon>
						<div class="upload-text">
							将文件拖到此处，或 <em>点击上传</em>
						</div>
						<div class="upload-hint">
							仅支持格式：.docx，文件总大小不超过 {{ maxSize }}MB
						</div>
					</el-upload>

					<div v-if="formFile.commission_file" class="uploaded-file-info">
						<div class="file-card">
							<el-icon class="file-icon"><Document /></el-icon>
							<div class="file-details">
								<span class="file-name">{{ formFile.commission_file.name }}</span>
								<span class="file-size">{{ formatFileSize(formFile.commission_file.size) }}</span>
							</div>
							<div class="file-actions">
								<!-- <el-button link type="primary" @click="handleDownloadFile('commissionFile', 'commission_file')">
									<el-icon><Download /></el-icon> 下载
								</el-button> -->
								<el-button link type="danger" @click="removeFile(uploadConfig.commissionFile)">
									<el-icon><Delete /></el-icon> 删除
								</el-button>
							</div>
						</div>
					</div>

					<div v-if="commissionLoading" class="upload-loading">
						<el-icon class="is-loading"><Loading /></el-icon>
						<span>文件上传中...</span>
					</div>
				</el-form-item>

				<el-form-item label="需求规格说明书：" prop="demandFile" required>
					<el-upload
						ref="demandRef"
						class="drag-upload-area"
						drag
						:auto-upload="false"
						:multiple="true"
						:show-file-list="false"
						accept=".docx"
						:on-change="multipleFileChange"
						:disabled="demandLoading"
					>
						<el-icon class="upload-icon"><UploadFilled /></el-icon>
						<div class="upload-text">
							将文件拖到此处，或 <em>点击上传</em>
						</div>
						<div class="upload-hint">
							仅支持格式：.docx，支持多个文件,总大小不超过 {{ maxSize }}MB
						</div>
					</el-upload>

					<div v-if="formFile.demand_file.length" class="uploaded-file-info">
						<div class="file-card" v-for="(file, index) in formFile.demand_file" :key="index" style="margin-bottom: 10px;">
							<el-icon class="file-icon"><Document /></el-icon>
							<div class="file-details">
								<span class="file-name">{{ file.name }}</span>
								<span class="file-size">{{ formatFileSize(file.size) }}</span>
							</div>
							<div class="file-actions">
								<!-- <el-button link type="primary" @click="demandFileDownload(index)">
									<el-icon><Download /></el-icon> 下载
								</el-button> -->
								<el-button link type="danger" @click="removeDemandFile(index)">
									<el-icon><Delete /></el-icon> 删除
								</el-button>
							</div>
						</div>
					</div>

					<div v-if="demandLoading" class="upload-loading">
						<el-icon class="is-loading"><Loading /></el-icon>
						<span>文件上传中...</span>
					</div>
				</el-form-item>

				<el-form-item label="性能清单表：" prop="performanceFile" required>
					<el-upload
						ref="performanceRef"
						class="drag-upload-area"
						drag
						:auto-upload="false"
						:multiple="false"
						:show-file-list="false"
						accept=".xlsx"
						:on-change="(uploadFile, uploadFiles) => handleFileChange(uploadFile, uploadFiles, uploadConfig.performanceFile)"
						:disabled="performanceLoading"
					>
						<el-icon class="upload-icon"><UploadFilled /></el-icon>
						<div class="upload-text">
							将文件拖到此处，或 <em>点击上传</em>
						</div>
						<div class="upload-hint">
							仅支持格式：.xlsx，文件总大小不超过 {{ maxSize }}MB
						</div>
					</el-upload>

					<div v-if="formFile.performance_file" class="uploaded-file-info">
						<div class="file-card">
							<el-icon class="file-icon"><Document /></el-icon>
							<div class="file-details">
								<span class="file-name">{{ formFile.performance_file.name }}</span>
								<span class="file-size">{{ formatFileSize(formFile.performance_file.size) }}</span>
							</div>
							<div class="file-actions">
								<!-- <el-button link type="primary" @click="handleDownloadFile('performanceFile', 'performance_file')">
									<el-icon><Download /></el-icon> 下载
								</el-button> -->
								<el-button link type="danger" @click="removeFile(uploadConfig.performanceFile)">
									<el-icon><Delete /></el-icon> 删除
								</el-button>
							</div>
						</div>
					</div>

					<div v-if="performanceLoading" class="upload-loading">
						<el-icon class="is-loading"><Loading /></el-icon>
						<span>文件上传中...</span>
					</div>
				</el-form-item>

				<el-form-item label="资产收集表：" prop="assetFile" required>
					<el-upload
						ref="assetRef"
						class="drag-upload-area"
						drag
						:auto-upload="false"
						:multiple="false"
						:show-file-list="false"
						accept=".xlsx"
						:on-change="(uploadFile, uploadFiles) => handleFileChange(uploadFile, uploadFiles, uploadConfig.assetFile)"
						:disabled="assetLoading"
					>
						<el-icon class="upload-icon"><UploadFilled /></el-icon>
						<div class="upload-text">
							将文件拖到此处，或 <em>点击上传</em>
						</div>
						<div class="upload-hint">
							仅支持格式：.xlsx，文件总大小不超过 {{ maxSize }}MB
						</div>
					</el-upload>

					<div v-if="formFile.asset_file" class="uploaded-file-info">
						<div class="file-card">
							<el-icon class="file-icon"><Document /></el-icon>
							<div class="file-details">
								<span class="file-name">{{ formFile.asset_file.name }}</span>
								<span class="file-size">{{ formatFileSize(formFile.asset_file.size) }}</span>
							</div>
							<div class="file-actions">
								<!-- <el-button link type="primary" @click="handleDownloadFile('assetFile', 'asset_file')">
									<el-icon><Download /></el-icon> 下载
								</el-button> -->
								<el-button link type="danger" @click="removeFile(uploadConfig.assetFile)">
									<el-icon><Delete /></el-icon> 删除
								</el-button>
							</div>
						</div>
					</div>

					<div v-if="assetLoading" class="upload-loading">
						<el-icon class="is-loading"><Loading /></el-icon>
						<span>文件上传中...</span>
					</div>
				</el-form-item>
			</el-form>

			<template #footer>
				<div class="dialog-footer">
					<el-button @click="personnelDialog=true">人员安排</el-button>
					<el-button
						type="primary"
						@click="handleGenerate"
					>
						生成测试方案
					</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 人员安排 -->
		<el-dialog
			v-model="personnelDialog"
			title="人员安排"
			width="38%"
			:close-on-click-modal="false"
			destroy-on-close
		>
			<el-form label-width="102px" :model="form" ref="personnelFormRef">
				<el-tag type="info" size="large" style="margin-bottom: 20px; font-size: 14px;">温馨提示：人员名称填写，请注意用、隔开，例如：张三、李四</el-tag>
				<el-form-item label="测试组长:" prop="groupLeader">
					<el-input v-model="form.groupLeader" placeholder="请填写测试组长名称"></el-input>
				</el-form-item>
				<el-form-item label="功能测试人员:" prop="functionStaff">
					<el-input v-model="form.functionStaff" placeholder="请填写功能测试人员名称"></el-input>
				</el-form-item>
				<el-form-item label="性能测试人员:" prop="behaviorStaff">
					<el-input v-model="form.behaviorStaff" placeholder="请填写性能测试人员名称"></el-input>
				</el-form-item>
				<el-form-item label="安全测试人员:" prop="secureStaff">
					<el-input v-model="form.secureStaff" placeholder="请填写安全测试人员名称"></el-input>
				</el-form-item>
			</el-form>

			<template #footer>
				<div class="dialog-footer">
					<el-button @click="personnelDialog=false">取消</el-button>
					<el-button type="primary" @click="personnelDialog=false">确定</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 安全测试用例范围更新 -->
		<el-dialog
			v-model="secureDialog"
			title="安全测试用例范围更新"
			width="38%"
			:close-on-click-modal="false"
			destroy-on-close
		>
			<el-form label-width="140px" :model="secureForm" ref="secureFormRef" v-loading="secureFormLoading" element-loading-text="提交中..." >
				<el-form-item 
					label="安全测试用例表："
					prop="secureRange"
					required
					:rules="{ required: true, message: '请上传安全测试用例表', trigger: 'change' }"
				>
					<el-upload
						ref="secureFileRef"
						class="drag-upload-area"
						drag
						:auto-upload="false"
						:multiple="false"
						:show-file-list="false"
						accept=".xlsx"
						:on-change="handleSecureFile"
						style="width: 80%;"
					>
						<el-icon class="upload-icon"><UploadFilled /></el-icon>
						<div class="upload-text">
							将文件拖到此处，或 <em>点击上传</em>
						</div>
						<div class="upload-hint">
							仅支持格式：.xlsx，文件总大小不超过 {{ maxSize }}MB
						</div>
					</el-upload>

					<div v-if="secureForm.secureRange" class="uploaded-file-info">
						<div class="file-card">
							<el-icon class="file-icon"><Document /></el-icon>
							<div class="file-details">
								<span class="file-name">{{ secureForm.secureRange.name }}</span>
								<span class="file-size">{{ formatFileSize(secureForm.secureRange.size) }}</span>
							</div>
							<div class="file-actions">
								<!-- <el-button link type="primary" @click="handleDownloadFile('performanceFile', 'performance_file')">
									<el-icon><Download /></el-icon> 下载
								</el-button> -->
								<el-button link type="danger" @click="removeSecureFile()">
									<el-icon><Delete /></el-icon> 删除
								</el-button>
							</div>
						</div>
					</div>
				</el-form-item>
			</el-form>

			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="handleSave">确定</el-button>
				</div>
			</template>
		</el-dialog>

		<el-dialog 
      v-model="previewVisible" 
      title="文档预览" 
      width="90%"
      :close-on-click-modal="false"
			append-to-body
      @close="handlePreviewClose"
			class="docx-preview-dialog"
    >
			<div v-loading="innerLoading" element-loading-text="文档加载中，请稍候..." style="height: 100%;">
				<vue-office-docx v-if="previewFileData" :src="previewFileData" />
			</div>
			<!-- <vue-office-docx :src="previewFileData" /> -->
    </el-dialog>
	</div>
</template>

<script setup name="testPlan">
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted, watch, onUnmounted, onActivated, onDeactivated, nextTick, computed } from 'vue';
import { timeFormatter } from '@/utils/day.js';
import { getList, downloadTemplateFile, generateTestPlan, deletePlan, updatesecureFile } from '@/api/testPlan';
import { getDocumentList } from '@/api/templateManagement';
import { uploadFile, deleteFile, getFileUrl, downloadFile } from '@/api/file';
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'

import { UploadFilled } from '@element-plus/icons-vue'

const isFirstActivated = ref(true)
const timer = ref(null)

const searchForm = reactive({
	name: '',
	status: ''
})
const statusOptions = ref([{
  value: 1,
  label: '完成'
}, {
  value: 2,
  label: '进行中'
}, {
  value: 3,
  label: '失败'
}])
const statusType = ref([{
	type: 'success',
	label: '完成',
},{
	type: 'primary',
	label: '进行中',
},{
	type: 'danger',
	label: '失败',
}])

const isSubmitting = ref(false)
const loading = ref(false)
const tableHeight = ref(null)
const isListeningResize = ref(false)
const tableData = ref([])
const pagination = reactive({
	total: 0,
	pageNum: 1,
	pageSize: 20,
	lastPage: 0,
	background: true,
	layout: 'total, sizes, prev, pager, next, ->, jumper'
})

const dialogVisible = ref(false)
const formRef = ref(null)
const initFormData = () => ({
	radio: '2',
	modelFile: '',
	commissionFile: null,
	demandFile: [],
	performanceFile: null,
	assetFile: null,
	groupLeader: '',
	functionStaff: '',
	behaviorStaff: '',
	secureStaff: ''
})
const form = reactive({ ...initFormData() })
const formFile = reactive({
	commission_file: null,
	performance_file: null,
	demand_file: [],
	asset_file: null
})
const generateLoading = ref(false)
const documentList = ref([])
const maxSize = 100
const commissionRef = ref(null)
const demandRef = ref(null)
const performanceRef = ref(null)
const assetRef = ref(null)
const commissionLoading = ref(false)
const demandLoading = ref(false)
const performanceLoading = ref(false)
const assetLoading = ref(false)

const uploadConfig = {
	commissionFile: {
		loadingRef: commissionLoading,
    fileKey: 'commission_file',
    formKey: 'commissionFile',
    infoRef: commissionRef,
		accept: '.docx'
	},
	performanceFile: {
		loadingRef: performanceLoading,
    fileKey: 'performance_file',
    formKey: 'performanceFile',
    infoRef: performanceRef,
		accept: '.xlsx'
	},
	assetFile: {
		loadingRef: assetLoading,
    fileKey: 'asset_file',
    formKey: 'assetFile',
    infoRef: assetRef,
		accept: '.xlsx'
	}
}

const formRules = reactive({
  radio: [{ required: true, message: '请选择是否涉及移动端', trigger: 'change' }],
  modelFile: [{ required: true, message: '请选择文档模板', trigger: 'change' }],
  commissionFile: [{ required: true, message: '请上传委托单文档', trigger: 'change' }],
  demandFile: [{ required: true, message: '请上传需求规格说明书', trigger: 'change' }],
	performanceFile: [{ required: true, message: '请上传性能清单表', trigger: 'change' }],
	assetFile: [{ required: true, message: '请上传资产收集表', trigger: 'change' }]
})

const personnelDialog = ref(false)
const personnelFormRef = ref(null)
const secureDialog = ref(false)
const secureForm = reactive({
	secureRange: null
})
const secureFormRef = ref(null)
const secureFileRef = ref(null)
const secureFormLoading = ref(false)

// 预览的文件数据
const previewVisible = ref(false)
const previewFileData = ref(null)
const isPreviewReady = ref(false)
const innerLoading = ref(false)

const formatFileSize = (bytes) => {
  if (!bytes) return ''
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const validateFile = (file, accept) => {
	console.log('file', file, accept)
  const acceptTypes = file.name.endsWith(accept)
  if (!acceptTypes) {
    ElMessage.error(`只能上传${accept} 格式的文件！`)
    return false
  }
  const isLtMaxSize = file.size / 1024 / 1024 < maxSize
  if (!isLtMaxSize) {
    ElMessage.error(`文件大小不能超过 ${maxSize} MB！`)
    return false
  }
  return true
}

const handleFileChange = async (file, fileList, config) => {
	if (!file || !file.raw) return
	if (config.loadingRef.value) {
    ElMessage.warning('文件正在上传中，请稍后再试')
    return
	}
	if (!validateFile(file.raw, config.accept)) {
		if (config.infoRef.value) config.infoRef.value?.clearFiles()
		formFile[config.fileKey] = null
		form[config.formKey] = null
    return
	}
	formFile[config.fileKey] = null
	form[config.formKey] = null
	config.loadingRef.value = true
	try {
		const formData = new FormData()
		formData.append('file', file.raw)
		const res = await uploadFile(formData)
		if (res.code === 200) {
			form[config.formKey] = res.data?.attachmentId
			formFile[config.fileKey] = { name: file.raw.name, size: file.raw.size }
			formRef.value?.clearValidate(config.formKey);
			ElMessage.success('上传成功！')
		}else {
			ElMessage.error(res.message || '上传失败，请重新上传!')
		}
	} catch(error) {
		ElMessage.error('上传失败，请重新上传!')
	} finally {
		config.loadingRef.value = false
    config.infoRef.value?.clearFiles()
	}
}

const handleDownloadFile = async (formKey, fileKey) => {
	const fileId = form[formKey]
	if (!fileId) {
    ElMessage.warning('文件链接不存在！')
    return
	}
	ElMessage.info(`文件正在下载中，请稍候！`);
	try {
    const response = await downloadFile(fileId);
    const contentType = response.headers['content-type'];
    if (contentType.includes('application/json')) {
			const reader = new FileReader();
			reader.onload = () => {
				try {
					const jsonResponse = JSON.parse(reader.result);
					if (jsonResponse.code === 404) {
						ElMessage.warning(jsonResponse.message || '下载失败')
					} else {
						ElMessage.error(jsonResponse.message || '下载失败')
					}
				} catch (e) {
					ElMessage.error('解析响应失败')
				}
			};
			reader.readAsText(response.data);
		} else {
			const blob = new Blob([response.data]);
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = formFile[fileKey].name;
			link.click();
			URL.revokeObjectURL(link.href);
      ElMessage.success(`文件下载已触发，请在浏览器下载列表查看！`);
		}
  } catch (error) {
		console.log('error:', error);
		ElMessage.error('下载失败，请重试')
  }
}

const removeFile = async (config) => {
	if (!form?.[config.formKey]) {
    return
	}
	try {
		const res = await deleteFile({attachmentId: form[config.formKey]})
		if (res.code === 200) {
			formFile[config.fileKey] = null
			form[config.formKey] = null
			config.infoRef.value?.clearFiles()
			ElMessage.success('文件删除成功')
		} else {
      ElMessage.error(res.message || '文件删除失败，请重试！')
    }
	} catch(_) {}
}

const multipleFileChange = async (file, fileList) => {
	if (!fileList.lenght <= 0) return
	if (demandLoading.value) {
    ElMessage.warning('文件正在上传中，请稍后再试')
    return
	}
	const validFiles = fileList.filter(file => {
    if (!file.name.endsWith('.docx')) {
      ElMessage.warning(`${file.name} 不是DOCX格式，已过滤`)
      return false
    }
    return true
	})
	if (validFiles.length === 0) {
		ElMessage.info('无有效DOCX文件可上传')
		demandRef.value?.clearFiles()
    return
	}
	const maxSize = 100 * 1024 * 1024   //  100MB
	const totalSize = validFiles.reduce((sum, file) => sum + file.size, 0)  // 本次文件大小
	const alreadySize = formFile.demand_file.reduce((sum, item) => sum + item.size, 0)  // 已上传
	const allSize = alreadySize + totalSize  // 总大小
	if (allSize > maxSize) {
    ElMessage.error(`文件总大小不能超过100MB！`)
    demandRef.value?.clearFiles()
    return
	}
	demandLoading.value = true
	const uploadPromises = []
  // 存储成功上传的文件ID和文件信息
  const successAttachmentIds = []
	const successFileInfos = []
	validFiles.forEach(file => {
    const formData = new FormData()
    formData.append('file', file.raw)
    
    // 每个文件的上传Promise
    const uploadPromise = uploadFile(formData)
      .then(res => {
        if (res.code === 200) {
          successAttachmentIds.push(res.data?.attachmentId)
					successFileInfos.push({ name: file.raw.name, size: file.raw.size })
					formRef.value.clearValidate('demandFile');
          return true
        } else {
          ElMessage.error(`${file.name} 上传失败：${res.message || '服务器处理异常'}`)
          return false
        }
      })
      .catch((error) => {
        console.log(`${file.name} 上传错误：`, error)
        return false
      })
    uploadPromises.push(uploadPromise)
	})

	Promise.allSettled(uploadPromises).then(() => {
    if (successAttachmentIds.length > 0) {
      form.demandFile = [...form.demandFile, ...successAttachmentIds]
      formFile.demand_file= [...formFile.demand_file, ...successFileInfos]
      ElMessage.success(`成功上传 ${successAttachmentIds.length} 个文件，失败 ${validFiles.length - successAttachmentIds.length} 个`)
    }
  }).finally(() => {
		demandRef.value?.clearFiles()
    demandLoading.value = false
  })
}

const demandFileDownload = async (index) => {
	const fileId = form.demandFile[index]
	if (!fileId) {
    ElMessage.warning('文件链接不存在！')
    return
	}
	ElMessage.info(`文件正在下载中，请稍候！`);
	try {
    const response = await downloadFile(fileId);
    const contentType = response.headers['content-type'];
    if (contentType.includes('application/json')) {
			const reader = new FileReader();
			reader.onload = () => {
				try {
					const jsonResponse = JSON.parse(reader.result);
					if (jsonResponse.code === 404) {
						ElMessage.warning(jsonResponse.message || '下载失败')
					} else {
						ElMessage.error(jsonResponse.message || '下载失败')
					}
				} catch (e) {
					ElMessage.error('解析响应失败')
				}
			};
			reader.readAsText(response.data);
		} else {
			const blob = new Blob([response.data]);
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = formFile.demand_file[index].name;
			link.click();
			URL.revokeObjectURL(link.href);
      ElMessage.success(`文件下载已触发，请在浏览器下载列表查看！`);
		}
  } catch (error) {
		console.log('error:', error);
		ElMessage.error('下载失败，请重试')
  }
}

const removeDemandFile = async (index) => {
	if (!form?.demandFile || index < 0 || index >= form.demandFile.length) {
    return
	}
	try {
		const res = await deleteFile({attachmentId: form.demandFile[index]})
		if (res.code === 200) {
			formFile.demand_file.splice(index, 1)
			form.demandFile.splice(index, 1)
			demandRef.value?.clearFiles()
			ElMessage.success('文件删除成功')
		} else {
      ElMessage.error(res.message || '文件删除失败，请重试！')
    }
	} catch(err) {
		console.error('删除文件异常：', err)
	}
}

/**
 * 关闭弹窗前确认
 */
const handleClose = () => {
  // if (isSubmitting.value) {
  //   ElMessage.warning('正在上传中，请稍后关闭')
  //   return
  // }
	dialogVisible.value = false
}

watch(dialogVisible, (newVal) => {
  if (!newVal && formRef.value) {
		formRef.value.resetFields()
	}
	Object.values(uploadConfig).forEach(config => {
		formFile[config.fileKey] = null
		form[config.formKey] = null
		if (config.infoRef?.value) {
			config.infoRef.value?.clearFiles()
		}
	})
	formFile.demand_file = []
	form.demandFile = []
	if (demandRef.value) {
		demandRef.value?.clearFiles()
	}
	form.radio = '2'
	form.modelFile = ''
	form.groupLeader = ''
	form.functionStaff = ''
	form.behaviorStaff = ''
	form.secureStaff = ''
	secureForm.secureRange = null
	secureFileRef.value?.clearFiles()
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
			page: pagination.pageNum,
      page_size: pagination.pageSize,
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
const dayFormatter = (row) => {
	return timeFormatter(row.created_at)
}

const handleDelete = async (row) => {
	try {
    await ElMessageBox.confirm('确定删除选中的数据吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const res = await deletePlan(row.id)
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
	if (!row.final_word) {
		ElMessage.warning('文件链接不存在！')
    return
	}
	try {
    const response = await downloadFile(row.final_word)
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
      link.download = `${row.name}.docx`
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

const handlePreviewClose = async () => {
  if (previewFileData.value) {
    URL.revokeObjectURL(previewFileData.value)
    previewFileData.value = null
  }
}

const previewFile = async (id) => {
	if (innerLoading.value) return
	if (previewFileData.value) {
		URL.revokeObjectURL(previewFileData.value)
		previewFileData.value = null
	}
	innerLoading.value = true
	previewVisible.value = true
	const res = await getFileUrl(id)
	const contentType = res.headers['content-type'] || res.headers['Content-Type']
	const blob = new Blob([res.data], { type: contentType })
	const url = URL.createObjectURL(blob)
  console.log('url', url)
	previewFileData.value = url
	if (!previewFileData.value) {
		innerLoading.value = false
		return ElMessage.error('预览失败')
	}

  innerLoading.value = false
}

const getDocument = async () => {
	const params = { type: 1, status: 1, page: 1, page_size: 99999 }
	const res = await getDocumentList(params)
	if (res.code === 200) {
		documentList.value = res.data
	}
}

const onAdd = async () => {
	dialogVisible.value = true
	getDocument()
}

const downloadTemplate = async (type) => {
	try {
    const response = await downloadTemplateFile({model: type})
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
			const name = type === 1 ? '性能清单表模板' : type === 2 ? '资产收集表模板' : '安全用例模板'
      const blob = new Blob([response.data], { type: contentType })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${name}.xlsx`
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

const handleSecureFile = (file, fileList) => {
	if (!file || !file.raw) return
	if (!validateFile(file.raw, '.xlsx')) {
    return
	}
	secureForm.secureRange = file.raw
	secureFileRef.value?.clearFiles()
}

const removeSecureFile = () => {
	secureForm.secureRange = null
}

const handleSave = async() => {
	if (!secureFormRef.value) return
	try {
		await secureFormRef.value.validate()
		secureFormLoading.value = true
		const formData = new FormData()
		formData.append('secureRange', secureForm.secureRange)
		const res = await updatesecureFile(formData)
		if (res.code === 200) {
			secureFormLoading.value = false
			ElMessage.success('更新成功！')
			secureDialog.value = false
		}else {
			secureFormLoading.value = false
			ElMessage.error(res.message || '更新失败，请重试!')
		}
	} catch(_) {
		
	}
}

const handleGenerate = async () => {
	if (!formRef) return
	try {
		await formRef.value.validate()
		generateLoading.value = true
		const data = JSON.parse(JSON.stringify(form))
		const res = await generateTestPlan(data)
		if (res.code === 200) {
			generateLoading.value = false
			dialogVisible.value = false
			ElMessage.success('生成测试方案成功！')
			getDataList()
    } else {
			generateLoading.value = false
      ElMessage.error(res.message)
    }
	} catch (error) {
		generateLoading.value = false
    console.error('表单校验失败：', error)
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
	if (isFirstActivated.value) {
    isFirstActivated.value = false
    return
	}
	getDataList()
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
}
.search-btn {
	margin-right: 0;
}
.btn-group {
	padding: 20px 0;
	display: flex;
	justify-content: flex-end;
}

// 弹窗内部滚动样式优化
:deep(.inner-scroll-dialog) {
	display: flex;
	flex-direction: column;
	max-height: 92vh;
	margin: 4vh auto !important;
	border-radius: 8px;
	overflow: hidden;

	.el-dialog__body {
		flex: 1;
		overflow-y: auto;
		padding: 10px;
		
		&::-webkit-scrollbar {
			width: 6px;
		}
		&::-webkit-scrollbar-thumb {
			background: #c1c1c1;
			border-radius: 3px;
		}
		&::-webkit-scrollbar-track {
			background: #f1f1f1;
		}
	}
}

:root {
  body {
    overflow: auto !important;
  }
}

.tips-contant {
	padding: 10px;
	background: #ececec;
	border-radius: 5px;
	font-size: 16px;
	margin-bottom: 10px;
	line-height: 1.6;
}

.highlight {
	color: #f56c6c;
}

.el-button.is-text {
	font-size: 16px;
	padding: 0px;
}
.el-button.is-text:hover {
  background-color: transparent !important;
}

.drag-upload-area {
  width: 56%;
	line-height: 1.5;

  :deep(.el-upload-dragger) {
    border-radius: 12px;
    background-color: #fafcff;
    border: 1px dashed #d9d9d9;
    transition: all 0.2s;
    width: 100%;
		padding: 10px 0px;

    &:hover {
      border-color: #409eff;
      background-color: #ecf5ff;
    }
  }

  .upload-icon {
    font-size: 40px;
    color: #909399;
  }

  .upload-text {
    font-size: 14px;
    color: #606266;

    em {
      color: #409eff;
      font-style: normal;
    }
  }

  .upload-hint {
    font-size: 12px;
    color: #909399;
    margin-top: 8px;
  }
}

.uploaded-file-info {
  margin-top: 16px;
	width: 100%;
}
.file-card {
  display: flex;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 10px;
  border: 1px solid #e4e7ed;
}
.file-icon {
  font-size: 22px;
  color: #409eff;
  margin-right: 6px;
}
.file-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.file-name {
  font-size: 14px;
	line-height: 1.8;
  color: #303133;
  word-break: break-all;
}
.file-size {
  font-size: 12px;
  color: #909399;
}
.file-actions {
  display: flex;
}
.upload-loading {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #409eff;
  font-size: 14px;
}
.upload-loading .is-loading {
  animation: rotating 2s linear infinite;
}
@keyframes rotating {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-empty) {
  padding: 16px 0;
}
</style>
<style lang="scss">
.docx-preview-dialog {
		display: flex;
    flex-direction: column;
    height: 96vh;
    margin: 2vh auto !important;

  // 弹窗body 滚动
  .el-dialog__body {
    flex: 1;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    min-height: 0;
  }
}
</style>