<template>
	<div class="container">
		<div class="page-header">
      <h3>新增物料研判</h3>
    </div>

		<!-- 查询 -->
		<el-form ref="formRef" :model="form" :rules="formRules" label-width="auto" class="add-form" v-loading="loading" element-loading-text="提交中..." >
			<el-form-item label="项目名称:" prop="project_name">
				<el-input v-model="form.project_name" placeholder="项目名称"></el-input>
			</el-form-item>

			<!-- 委托单(PDF) -->
			<el-form-item label="委托单(PDF)：" prop="entrust_pdf">
				<div style="display: flex;">
					<el-button type="primary" size="small" :loading="isEntrustPDFUploading" @click="entrustPDFRef.click()">{{ isEntrustPDFUploading ? '上传中...' : '点击上传文件' }}<el-icon v-if="!isEntrustPDFUploading"><UploadFilled /></el-icon></el-button>
					<p class="file-tip">仅支持格式：.pdf（大小总限制100MB）</p>
				</div>
				<div v-if="entrustPDFInfo" class="file-content">
					<p class="file-name">{{ entrustPDFInfo.name }}</p>
					<el-icon @click="removeFileInfo(uploadConfig.EntrustPDF)" class="delIcon"><Delete /></el-icon>
				</div>
			</el-form-item>
			<input ref="entrustPDFRef" type="file" accept=".pdf" hidden @change="(e) => handleFileUpload(e, uploadConfig.EntrustPDF)">

			<!-- 委托单(DOCX) -->
			<el-form-item label="委托单(DOCX)：" prop="entrust_docx">
				<div style="display: flex;">
					<el-button type="primary" size="small" :loading="isEntrustDOCXUploading" @click="entrustDOCXRef.click()">{{ isEntrustDOCXUploading ? '上传中...' : '点击上传文件' }}<el-icon v-if="!isEntrustDOCXUploading"><UploadFilled /></el-icon></el-button>
					<p class="file-tip">仅支持格式：.docx（大小总限制100MB）</p>
				</div>
				<div v-if="entrustDOCXInfo" class="file-content">
					<p class="file-name">{{ entrustDOCXInfo.name }}</p>
					<el-icon @click="removeFileInfo(uploadConfig.entrustDOCX)" class="delIcon"><Delete /></el-icon>
				</div>
			</el-form-item>
			<input ref="entrustDOCXRef" type="file" accept=".docx" hidden @change="(e) => handleFileUpload(e, uploadConfig.entrustDOCX)">

			<!-- 需求规格说明书(DOCX) -->
			<el-form-item label="需求规格说明书(DOCX)：" prop="demand_docx">
				<div style="display: flex;">
					<el-button type="primary" size="small" :loading="isDemandDOCXUploading" @click="demandDOCXRef.click()">{{ isDemandDOCXUploading ? '上传中...' : '点击上传文件' }}<el-icon v-if="!isDemandDOCXUploading"><UploadFilled /></el-icon></el-button>
					<p class="file-tip">仅支持格式：.docx（支持多个文档，大小总限制100MB）</p>
				</div>
				<template v-if="demandDOCXList.length">
					<div v-for="(file, index) in demandDOCXList" :key="index" class="file-content">
						<p class="file-name" :title="file.name">{{ file.name }}</p>
						<el-icon @click="removeDemandDOCX(index)" class="delIcon"><Delete /></el-icon>
					</div>
				</template>
			</el-form-item>
			<input ref="demandDOCXRef" type="file" accept=".docx" multiple hidden @change="handleDemandDOCX">

			<!-- 需求规格说明书(PDF) -->
			<el-form-item label="需求规格说明书(PDF)：" prop="demand_pdf">
				<div style="display: flex;">
					<el-button type="primary" size="small" :loading="isDemandPDFUploading" @click="demandPDFRef.click()">{{ isDemandPDFUploading ? '上传中...' : '点击上传文件' }}<el-icon v-if="!isDemandPDFUploading"><UploadFilled /></el-icon></el-button>
					<p class="file-tip">仅支持格式：.pdf（大小总限制100MB）</p>
				</div>
				<div v-if="demandPDFInfo" class="file-content">
					<p class="file-name">{{ demandPDFInfo.name }}</p>
					<el-icon @click="removeFileInfo(uploadConfig.demandPDF)" class="delIcon"><Delete /></el-icon>
				</div>
			</el-form-item>
			<input ref="demandPDFRef" type="file" accept=".pdf" hidden @change="(e) => handleFileUpload(e, uploadConfig.demandPDF)">

			<!-- 资产收集表(XLSX) -->
			<el-form-item label="资产收集表(XLSX)：" prop="asset_xlsx">
				<div style="display: flex;">
					<el-button type="primary" size="small" :loading="isAssetXLSXUploading" @click="assetXLSXRef.click()">{{ isAssetXLSXUploading ? '上传中...' : '点击上传文件' }}<el-icon v-if="!isAssetXLSXUploading"><UploadFilled /></el-icon></el-button>
					<p class="file-tip">仅支持格式：.xlsx（大小总限制100MB）</p>
				</div>
				<div v-if="assetXLSXInfo" class="file-content">
					<p class="file-name">{{ assetXLSXInfo.name }}</p>
					<el-icon @click="removeFileInfo(uploadConfig.assetXLSX)" class="delIcon"><Delete /></el-icon>
				</div>
			</el-form-item>
			<input ref="assetXLSXRef" type="file" accept=".xlsx" hidden @change="(e) => handleFileUpload(e, uploadConfig.assetXLSX)">

			<!-- 功能测试用例(XLSX) -->
			<el-form-item label="功能测试用例(XLSX)：" prop="case_xlsx">
				<div style="display: flex;">
					<el-button type="primary" size="small" :loading="isCaseXLSXUploading" @click="caseXLSXRef.click()">{{ isCaseXLSXUploading ? '上传中...' : '点击上传文件' }}<el-icon v-if="!isCaseXLSXUploading"><UploadFilled /></el-icon></el-button>
					<p class="file-tip">仅支持格式：.xlsx（大小总限制100MB）</p>
				</div>
				<div v-if="caseXLSXInfo" class="file-content">
					<p class="file-name">{{ caseXLSXInfo.name }}</p>
					<el-icon @click="removeFileInfo(uploadConfig.caseXLSX)" class="delIcon"><Delete /></el-icon>
				</div>
			</el-form-item>
			<input ref="caseXLSXRef" type="file" accept=".xlsx" hidden @change="(e) => handleFileUpload(e, uploadConfig.caseXLSX)">

			<!-- 性能测试清单表(XLSX) -->
			<el-form-item label="性能测试清单(XLSX)：" prop="perf_xlsx">
				<div style="display: flex;">
					<el-button type="primary" size="small" :loading="isPerfXLSXUploading" @click="perfXLSXRef.click()">{{ isPerfXLSXUploading ? '上传中...' : '点击上传文件' }}<el-icon v-if="!isPerfXLSXUploading"><UploadFilled /></el-icon></el-button>
					<p class="file-tip">仅支持格式：.xlsx（大小总限制100MB）</p>
				</div>
				<div v-if="perfXLSXInfo" class="file-content">
					<p class="file-name">{{ perfXLSXInfo.name }}</p>
					<el-icon @click="removeFileInfo(uploadConfig.perfXLSX)" class="delIcon"><Delete /></el-icon>
				</div>
			</el-form-item>
			<input ref="perfXLSXRef" type="file" accept=".xlsx" hidden @change="(e) => handleFileUpload(e, uploadConfig.perfXLSX)">

			<!-- 网络安全设计方案 -->
			<el-form-item label="网络安全设计方案：" prop="cybersecurity">
				<div style="display: flex;">
					<el-button type="primary" size="small" :loading="isCybersecurityUploading" @click="cybersecurityRef.click()">{{ isCybersecurityUploading ? '上传中...' : '点击上传文件' }}<el-icon v-if="!isCybersecurityUploading"><UploadFilled /></el-icon></el-button>
					<p class="file-tip">仅支持格式：.docx,.pdf（大小总限制100MB）</p>
				</div>
				<div v-if="cybersecurityInfo" class="file-content">
					<p class="file-name">{{ cybersecurityInfo.name }}</p>
					<el-icon @click="removeFileInfo(uploadConfig.cybersecurity)" class="delIcon"><Delete /></el-icon>
				</div>
			</el-form-item>
			<input ref="cybersecurityRef" type="file" accept=".docx,.pdf" hidden @change="(e) => handleFileUpload(e, uploadConfig.cybersecurity)">

			<!-- 概要设计说明书 -->
			<!-- <el-form-item label="概要设计说明书：" prop="summary">
				<div style="display: flex;">
					<el-button type="primary" size="small" :loading="isSummaryUploading" @click="summaryRef.click()">{{ isSummaryUploading ? '上传中...' : '点击上传文件' }}<el-icon v-if="!isSummaryUploading"><UploadFilled /></el-icon></el-button>
					<p class="file-tip">大小总限制100MB</p>
				</div>
				<div v-if="summaryInfo" class="file-content">
					<p class="file-name">{{ summaryInfo.name }}</p>
					<el-icon @click="removeFileInfo(uploadConfig.summary)" class="delIcon"><Delete /></el-icon>
				</div>
			</el-form-item>
			<input ref="summaryRef" type="file" accept=".xlsx,.docx,.pdf" hidden @change="(e) => handleFileUpload(e, uploadConfig.summary)"> -->

			<!-- 详细设计说明书 -->
			<!-- <el-form-item label="详细设计说明书：" prop="detailed">
				<div style="display: flex;">
					<el-button type="primary" size="small" :loading="isDetailedUploading" @click="detailedRef.click()">{{ isDetailedUploading ? '上传中...' : '点击上传文件' }}<el-icon v-if="!isDetailedUploading"><UploadFilled /></el-icon></el-button>
					<p class="file-tip">大小总限制100MB</p>
				</div>
				<div v-if="detailedInfo" class="file-content">
					<p class="file-name">{{ detailedInfo.name }}</p>
					<el-icon @click="removeFileInfo(uploadConfig.detailed)" class="delIcon"><Delete /></el-icon>
				</div>
			</el-form-item>
			<input ref="detailedRef" type="file" accept=".xlsx,.docx,.pdf" hidden @change="(e) => handleFileUpload(e, uploadConfig.detailed)"> -->

			<!-- 功能点清单 -->
			<!-- <el-form-item label="功能点清单：" prop="feature">
				<div style="display: flex;">
					<el-button type="primary" size="small" :loading="isFeatureUploading" @click="featureRef.click()">{{ isFeatureUploading ? '上传中...' : '点击上传文件' }}<el-icon v-if="!isFeatureUploading"><UploadFilled /></el-icon></el-button>
					<p class="file-tip">大小总限制100MB</p>
				</div>
				<div v-if="featureInfo" class="file-content">
					<p class="file-name">{{ featureInfo.name }}</p>
					<el-icon @click="removeFileInfo(uploadConfig.feature)" class="delIcon"><Delete /></el-icon>
				</div>
			</el-form-item>
			<input ref="featureRef" type="file" accept=".xlsx,.docx,.pdf" hidden @change="(e) => handleFileUpload(e, uploadConfig.feature)"> -->
			<div class="btn-content">
				<el-button @click="handleCancel">取消</el-button>
				<el-button type="primary" @click="handleSubmit">提交</el-button>
			</div>
			
		</el-form>
	</div>

</template>

<script setup name="materialAdd">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue';
import { uploadFile, deleteFile } from '@/api/file';
import { createMaterial } from '@/api/materialAnalysis';
import { setActivePinia } from 'pinia';

const router = useRouter();
const loading = ref(false)
const formRef = ref(null)
const form = reactive({
	project_name: '',
	entrust_pdf: null,
	entrust_docx: null,
	demand_docx: [],
	demand_pdf: null,
	asset_xlsx: null,
	case_xlsx: null,
	perf_xlsx: null,
	cybersecurity: null,
	summary: null,
	detailed: null,
	feature: null
})

const formFile = reactive({
	entrust_pdf_file: null,
	entrust_docx_file: null,
	demand_docx_file: [],
	demand_pdf_file: null,
	asset_xlsx_file: null,
	case_xlsx_file: null,
	perf_xlsx_file: null,
	cybersecurity_file: null,
	summary_file: null,
	detailed_file: null,
	feature_file: null,
})

const entrustPDFRef = ref(null)
const entrustDOCXRef = ref(null)
const demandDOCXRef = ref(null)
const demandPDFRef = ref(null)
const assetXLSXRef = ref(null)
const caseXLSXRef = ref(null)
const perfXLSXRef = ref(null)
const cybersecurityRef = ref(null)
const summaryRef = ref(null)
const detailedRef = ref(null)
const featureRef = ref(null)

// 文件展示
const entrustPDFInfo = ref(null)
const entrustDOCXInfo = ref(null)
const demandDOCXList = ref([])
const demandPDFInfo = ref(null)
const assetXLSXInfo = ref(null)
const caseXLSXInfo = ref(null)
const perfXLSXInfo = ref(null)
const cybersecurityInfo = ref(null)
const summaryInfo = ref(null)
const detailedInfo = ref(null)
const featureInfo = ref(null)

const isEntrustPDFUploading = ref(false)
const isEntrustDOCXUploading = ref(false)
const isDemandPDFUploading = ref(false)
const isDemandDOCXUploading = ref(false)
const isAssetXLSXUploading = ref(false)
const isCaseXLSXUploading = ref(false)
const isPerfXLSXUploading = ref(false)
const isCybersecurityUploading = ref(false)
const isSummaryUploading = ref(false)
const isDetailedUploading = ref(false)
const isFeatureUploading = ref(false)

// 表单校验规则
const formRules = reactive({
  project_name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  // entrust_pdf: [{ required: true, message: '请上传委托单(PDF)文件', trigger: 'change' }],
  // entrust_docx: [{ required: true, message: '请上传委托单(DOCX)文件', trigger: 'change' }],
  // demand_docx: [{ required: true, message: '请上传需求规格说明书(DOCX)文件', trigger: 'change' }],
	// demand_pdf: [{ required: true, message: '请上传需求规格说明书(PDF)', trigger: 'change' }],
	// asset_xlsx: [{ required: true, message: '请上传资产收集表(XLSX)文件', trigger: 'change' }],
  // case_xlsx: [{ required: true, message: '请上传功能测试用例(XLSX)文件', trigger: 'change' }],
  // perf_xlsx: [{ required: true, message: '请上传性能测试清单(XLSX)文件', trigger: 'change' }],
	// cybersecurity: [{ required: true, message: '请上传网络安全设计方案', trigger: 'change' }]
})

const uploadConfig = {
	// 委托单(PDF)
	EntrustPDF: {
		acceptType: '.pdf',
		maxSize: 100 * 1024 * 1024, // 100MB
		loadingRef: isEntrustPDFUploading,
    fileKey: 'entrust_pdf_file', // formFile
    formKey: 'entrust_pdf', // form
    infoRef: entrustPDFInfo, // 展示文件信息
    domRef: entrustPDFRef,
    errorMsg: '只能上传PDF格式的文件！'
	},
	// 委托单(DOCX)
	entrustDOCX: {
		acceptType: '.docx',
		maxSize: 100 * 1024 * 1024, // 100MB
		loadingRef: isEntrustDOCXUploading,
    fileKey: 'entrust_docx_file', // formFile
    formKey: 'entrust_docx', // form
    infoRef: entrustDOCXInfo, // 展示文件信息
    domRef: entrustDOCXRef,
    errorMsg: '只能上传DOCX格式的文件！'
	},
	// 需求规格说明书(PDF)
	demandPDF: {
		acceptType: '.pdf',
		maxSize: 100 * 1024 * 1024, // 100MB
		loadingRef: isDemandPDFUploading,
    fileKey: 'demand_pdf_file', // formFile
    formKey: 'demand_pdf', // form
    infoRef: demandPDFInfo, // 展示文件信息
    domRef: demandPDFRef,
    errorMsg: '只能上传PDF格式的文件！'
	},
	// 资产收集表(XLSX)
	assetXLSX: {
		acceptType: '.xlsx',
		maxSize: 100 * 1024 * 1024, // 100MB
		loadingRef: isAssetXLSXUploading,
    fileKey: 'case_xlsx_file', // formFile
    formKey: 'asset_xlsx', // form
    infoRef: assetXLSXInfo, // 展示文件信息
    domRef: assetXLSXRef,
    errorMsg: '只能上传XLSX格式的文件！'
	},
	// 功能测试用例(XLSX)
	caseXLSX: {
		acceptType: '.xlsx',
		maxSize: 100 * 1024 * 1024, // 100MB
		loadingRef: isCaseXLSXUploading,
    fileKey: 'asset_xlsx_file', // formFile
    formKey: 'case_xlsx', // form
    infoRef: caseXLSXInfo, // 展示文件信息
    domRef: caseXLSXRef,
    errorMsg: '只能上传XLSX格式的文件！'
	},
	// 性能测试清单表(XLSX)
	perfXLSX: {
		acceptType: '.xlsx',
		maxSize: 100 * 1024 * 1024, // 100MB
		loadingRef: isPerfXLSXUploading,
    fileKey: 'perf_xlsx_file', // formFile
    formKey: 'perf_xlsx', // form
    infoRef: perfXLSXInfo, // 展示文件信息
    domRef: perfXLSXRef,
    errorMsg: '只能上传XLSX格式的文件！'
	},
	// 网络安全设计方案
	cybersecurity: {
		acceptType: '.docx,.pdf',
		maxSize: 100 * 1024 * 1024, // 100MB
		loadingRef: isCybersecurityUploading,
    fileKey: 'cybersecurity_file', // formFile
    formKey: 'cybersecurity', // form
    infoRef: cybersecurityInfo, // 展示文件信息
    domRef: cybersecurityRef,
    errorMsg: '只能上传DOCX或PDF格式的文件！'
	},
	// 概要设计说明书
	summary: {
		acceptType: '.docx,.xlsx,.pdf',
		maxSize: 100 * 1024 * 1024, // 100MB
		loadingRef: isSummaryUploading,
    fileKey: 'summary_file', // formFile
    formKey: 'summary', // form
    infoRef: summaryInfo, // 展示文件信息
    domRef: summaryRef,
    errorMsg: '只能上传DOCX或XLSX或PDF格式的文件！'
	},
	// 详细设计说明书
	detailed: {
		acceptType: '.docx,.xlsx,.pdf',
		maxSize: 100 * 1024 * 1024, // 100MB
		loadingRef: isDetailedUploading,
    fileKey: 'detailed_file', // formFile
    formKey: 'detailed', // form
    infoRef: detailedInfo, // 展示文件信息
    domRef: detailedRef,
    errorMsg: '只能上传DOCX或XLSX或PDF格式的文件！'
	},
	// 功能点清单
	feature: {
		acceptType: '.docx,.xlsx,.pdf',
		maxSize: 100 * 1024 * 1024, // 100MB
		loadingRef: isFeatureUploading,
    fileKey: 'feature_file', // formFile
    formKey: 'feature', // form
    infoRef: featureInfo, // 展示文件信息
    domRef: featureRef,
    errorMsg: '只能上传DOCX或XLSX或PDF格式的文件！'
	},
}

const handleFileUpload = (e, config) => {
	const file = e.target.files[0]
	if (!file) return
	// 校验文件格式
	const acceptTypes = config.acceptType.split(',').map(type => type.trim())
	const fileExt = '.' + file.name.split('.').pop().toLowerCase()
  if (!acceptTypes.includes(fileExt)) {
    ElMessage.error(config.errorMsg)
    config.domRef.value.value = ''  // 清空选择
    return false
	}
	// 校验文件大小
  if (file.size > config.maxSize) {
		ElMessage.error(`文件大小不能超过${config.maxSize / 1024 / 1024}MB`)
		config.domRef.value.value = ''
    return
	}
	config.loadingRef.value = true
	
	formFile[config.fileKey] = file
  const formData = new FormData()
	formData.append('file', formFile[config.fileKey])
	uploadFile(formData).then(res => {
		if (res.code === 200) {
			form[config.formKey] = res.data?.attachmentId
			config.infoRef.value = { name: file.name, size: file.size }
			formRef.value.clearValidate(config.formKey);
			ElMessage.success('上传成功！')
		}else {
			ElMessage.error(res.message || '上传失败，请重新上传!')
		}
	}).catch(() => {}).finally(() => {
		config.domRef.value.value = ''
    config.loadingRef.value = false
  })
}
const removeFileInfo = async (config) => {
	if (!form?.[config.formKey]) {
    return
	}
	try {
		const res = await deleteFile({attachmentId: form[config.formKey]})
		if (res.code === 200) {
			formFile[config.fileKey] = null
			form[config.formKey] = null
			config.infoRef.value = null
			config.domRef.value.value = ''
			ElMessage.success('文件删除成功')
		} else {
      ElMessage.error(res.message || '文件删除失败，请重试！')
    }
	} catch(_) {}
}

// 需求规格说明书(DOCX)
const handleDemandDOCX = (e) => {
	if (isDemandDOCXUploading.value) {
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
		demandDOCXRef.value.value = ''
    return
	}

	const maxSize = 100 * 1024 * 1024   //  100MB
	const totalSize = validFiles.reduce((sum, file) => sum + file.size, 0)  // 本次文件大小
	const alreadySize = demandDOCXList.value.reduce((sum, item) => sum + item.size, 0)  // 已上传
	const allSize = alreadySize + totalSize  // 总大小
	if (allSize > maxSize) {
    ElMessage.error(`文件总大小不能超过100MB！`)
    demandDOCXRef.value.value = ''
    return
  }
	
	isDemandDOCXUploading.value = true
	const uploadPromises = []
  // 存储成功上传的文件ID和文件信息
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
					formRef.value.clearValidate('demand_docx');
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
      form.demand_docx = [...form.demand_docx, ...successAttachmentIds]
      formFile.demand_docx_file = [...formFile.demand_docx_file, ...validFiles]
      demandDOCXList.value = [...demandDOCXList.value, ...successFileInfos]
      ElMessage.success(`成功上传 ${successAttachmentIds.length} 个文件，失败 ${validFiles.length - successAttachmentIds.length} 个`)
    }
  }).finally(() => {
		demandDOCXRef.value.value = ''
    isDemandDOCXUploading.value = false
  })

		// const formData = new FormData()
		// formData.append('file', file)
		// uploadFile(formData).then(res => {
		// 	if (res.code === 200) {
		// 		form.demand_docx = [...form.demand_docx, res.data?.attachmentId]
		// 		// 添加到文件列表
		// 		formFile.demand_docx_file = [...formFile.demand_docx_file, ...validFiles]
		// 		demandDOCXList.value = [...demandDOCXList.value, ...validFiles.map(file => ({
		// 			name: file.name,
		// 			size: file.size
		// 		}))]
		// 		demandDOCXRef.value.value = ''
		// 		ElMessage.success('上传成功！')
		// 	}
		// }).catch((error) => {
		// 	console.log('error：', error)
		// 	// ElMessage.error('上传失败，请重新上传！')
		// })
}

// 删除需求规格说明书(DOCX)
const removeDemandDOCX = async (index) => {
	if (!form?.demand_docx || index < 0 || index >= form.demand_docx.length) {
    return
	}
	try {
		const res = await deleteFile({attachmentId: form.demand_docx[index]})
		if (res.code === 200) {
			formFile.demand_docx_file.splice(index, 1)
			form.demand_docx.splice(index, 1)
			demandDOCXList.value.splice(index, 1)
			demandDOCXRef.value.value = ''
			ElMessage.success('文件删除成功')
		} else {
      ElMessage.error(res.message || '文件删除失败，请重试！')
    }
	} catch(err) {
		console.error('删除文件异常：', err)
	}
}

// 取消按钮
const handleCancel = async () => {
	try {
    const allFileIds = [
      ...([form.entrust_pdf] || []),
      ...([form.entrust_docx] || []),
      ...(form.demand_docx || []),
			...([form.demand_pdf] || []),
      ...([form.asset_xlsx] || []),
      ...([form.case_xlsx] || []),
			...([form.perf_xlsx] || []),
			...([form.cybersecurity] || [])
    ].filter(id => id && id.trim())
		console.log('allFileIds', allFileIds)
    if (allFileIds.length > 0) {
      await deleteFile({ attachmentId: allFileIds.join(',') })
    }
  } catch (err) {
    console.error('删除文件失败：', err)
  } finally {
		Object.values(uploadConfig).forEach(config => {
      formFile[config.fileKey] = null
			form[config.formKey] = null
			if (config.infoRef?.value) {
				config.infoRef.value = null
			}
			if (config.domRef?.value) {
				config.domRef.value.value = ''
			}
		})
		formFile.demand_docx_file = []
		form.demand_docx = []
		demandDOCXList.value = []
		if (demandDOCXRef.value) {
			demandDOCXRef.value.value = ''
		}
		form.project_name = ''
		formRef.value?.clearValidate()
		router.push('/materialAnalysis')
	}
}

const handleSubmit = async () => {
	try {
		// 表单校验
		await formRef.value.validate()
		const allFileIds = [
      ...([form.entrust_pdf] || []),
      ...([form.entrust_docx] || []),
      ...(form.demand_docx || []),
			...([form.demand_pdf] || []),
      ...([form.asset_xlsx] || []),
      ...([form.case_xlsx] || []),
			...([form.perf_xlsx] || []),
			...([form.cybersecurity] || [])
		].filter(id => id && id.trim())
		if (allFileIds.length <= 0) {
			return ElMessage.error('请至少上传一个文件内容！')
		}

		const hasEntrustOrCaseOrPerf = form.entrust_pdf || form.entrust_docx || form.case_xlsx || form.perf_xlsx
		const hasDemandDocx = form.demand_docx.length > 0
		const hasDemandPdf = !!form.demand_pdf
		const hasOneDemand = hasDemandDocx || hasDemandPdf

		if (hasEntrustOrCaseOrPerf) {
			if ((!form.entrust_pdf && form.entrust_docx) || (form.entrust_pdf && !form.entrust_docx)) {
				return ElMessage.error('请同时上传委托单(PDF)和委托单(DOCX)文件！')
			}
			if (!hasDemandDocx || !hasDemandPdf) {
				return ElMessage.error('请同时上传需求规格说明书(DOCX)和需求规格说明书(PDF)文件！')
			}
		} else if (hasOneDemand) {
			if (!hasDemandDocx || !hasDemandPdf) {
				return ElMessage.error('请同时上传需求规格说明书(DOCX)和需求规格说明书(PDF)文件！')
			}
		}
		loading.value = true
		const data = JSON.parse(JSON.stringify(form))
		data.demand_docx = data.demand_docx.join(',')
		const res = await createMaterial(data)
		if (res.code === 200) {
			loading.value = false
			ElMessage.success('新增成功！')
			// router.push({
			// 	path: '/materialAnalysis/detail',
			// 	query: { id: res.data.project_id }
			// })
      router.push('/materialAnalysis')
    } else {
			loading.value = false
      ElMessage.error(res.message)
    }
	} catch (error) {
		loading.value = false
    console.error('表单校验失败：', error)
  }
}

// 重置表单（核心方法）
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 页面挂载时重置表单（解决返回新增页提示残留）
onMounted(() => {
  resetForm()
})

</script>

<style lang="scss" scoped>
.page-header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e6e6e6;
}
.add-form {
	margin-top: 20px;
}
.upload-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.file-list {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
  width: fit-content;
}
.search-btn {
	margin-right: 0;
}
.btn-group {
	padding: 20px 0;
	display: flex;
	justify-content: flex-end;
}
.file-tip {
	font-size: 12px;
	color: #606266;
	//margin-top: 7px;
  margin-left: 15px;
	// line-height: 1;
}
.file-content {
	display: flex;
	align-items: center;
	// justify-content: space-between;
	// line-height: normal;
}
.file-name {
	margin: 4px 0;
	// width: 88%;
	// white-space: nowrap;
	// overflow: hidden;
	// text-overflow: ellipsis;
}
.delIcon {
	margin-left: 20px !important;
	font-size: 18px !important;
	cursor: pointer;
}
:deep(.el-form-item__content) {
	flex-direction: column;
	align-items: start;
}
.btn-content {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 20px 0
}
.el-icon {
	margin-left: 4px;
	font-size: 16px;
}
</style>
