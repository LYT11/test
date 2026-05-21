<template>
	<div class="container">
		<!-- 查询 -->
		<el-form :inline="true" :model="searchForm" class="search-form">
			<div class="collapse_show_item">
				<el-form-item label="报告名称:" label-width="80px">
					<el-input v-model="searchForm.name" placeholder="方案名称" style="width: 180px"></el-input>
				</el-form-item>
				<el-form-item label="状态:" label-width="50px">
          <el-select v-model="searchForm.status" clearable placeholder="请选择状态" style="width: 180px">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
				<el-form-item label="报告模板分类:" label-width="100px">
          <el-select v-model="searchForm.type" clearable placeholder="请选择报告模板分类" style="width: 180px">
            <el-option
              v-for="item in typeOptions"
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
			<el-button type="primary" @click="onAdd">生成测试报告</el-button>
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
					label="报告名称"
					min-width="140"
					align='center'>
				</el-table-column>
				<el-table-column
					prop="is_type"
					label="报告模板分类"
					width="120"
					align='center'>
					<template #default="scope">
            {{ scope.row.is_type === 1 ? '出厂/验收报告': scope.row.is_type === 2 ? '入网安评' : '源码审计' }}
          </template>
				</el-table-column>
				<el-table-column
					prop="status"
					label="状态"
					width="100"
					align='center'>
					<template #default="scope">
            <el-tag size="small" :type="statusOptions[+(scope.row.status-1)].type">{{statusOptions[+(scope.row.status-1)].label}}</el-tag>
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

		<!-- 生成测试报告 -->
		<el-dialog
			v-model="dialogVisible"
			title="生成测试报告"
			width="56%"
			:before-close="handleClose"
			:close-on-click-modal="false"
			destroy-on-close
			class="inner-scroll-dialog" 
		>
			<el-form label-width="164px" :model="form" :rules="formRules" ref="formRef" v-loading="generateLoading" element-loading-text="生成测试报告中...">
				<div class="tips-contant">
					<p class="highlight">温馨提示：</p>
					<p class="highlight">1、如文档格式不一致，请手动用WPS打开文档，另存为对应的文档格式！如：.doc转.docx    xls转.xlsx</p>
					<p v-if="form.type === 1">2、《委托单》《测试方案》必传！缺一不可！《功能/性能/安全测试数据汇总》三者至少要传其一（上传哪个数据就生成哪部分报告）！</p>
					<p class="highlight" v-if="form.type !== 3">{{ form.type === 2 ? '2、' : '3、' }}测试数据汇总表格中《表头》需保持一致，模板下载：</p>
					<p v-if="form.type === 1">功能测试数据汇总表： <el-button text type="primary" @click="downloadTemplate(1)">功能测试数据汇总表模板</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;性能测试数据汇总表：<el-button text type="primary" @click="downloadTemplate(2)" style="margin-left: 0;">性能测试数据汇总表模板</el-button></p>
					<p v-if="form.type === 1">安全测试数据汇总表： <el-button text type="primary" @click="downloadTemplate(3)">安全测试数据汇总表模板</el-button></p>
					<p v-if="form.type === 2">测试记录文档： <el-button text type="primary" @click="downloadTemplate(5)">入网安评测试记录模板</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;问题单文档：<el-button text type="primary" @click="downloadTemplate(4)" style="margin-left: 0;">入网安评测试问题集模板</el-button></p>
				</div>

				<el-form-item label="报告模板分类：" prop="type" required>
					<el-radio-group v-model="form.type" @change="handleModeChange">
						<el-radio
							v-for="item in typeOptions"
              :key="item.value"
							:value="item.value"
						>{{item.label}}</el-radio>
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

				<el-form-item label="委托单文档：" prop="commission" required>
					<el-upload
						ref="commissionRef"
						class="drag-upload-area"
						drag
						:auto-upload="false"
						:multiple="false"
						:show-file-list="false"
						accept=".docx"
						:on-change="(uploadFile, uploadFiles) => handleFileChange(uploadFile, uploadFiles, uploadConfig.commission)"
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
								<!-- <el-button link type="primary" @click="handleDownloadFile('commission', 'commission_file')">
									<el-icon><Download /></el-icon> 下载
								</el-button> -->
								<el-button link type="danger" @click="removeFile(uploadConfig.commission)">
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

				<el-form-item label="测试方案文档：" prop="plan" required v-if="form.type === 1">
					<el-upload
						ref="planRef"
						class="drag-upload-area"
						drag
						:auto-upload="false"
						:multiple="false"
						:show-file-list="false"
						accept=".docx"
						:on-change="(uploadFile, uploadFiles) => handleFileChange(uploadFile, uploadFiles, uploadConfig.plan)"
						:disabled="planLoading"
					>
						<el-icon class="upload-icon"><UploadFilled /></el-icon>
						<div class="upload-text">
							将文件拖到此处，或 <em>点击上传</em>
						</div>
						<div class="upload-hint">
							仅支持格式：.docx，文件总大小不超过 {{ maxSize }}MB
						</div>
					</el-upload>

					<div v-if="formFile.plan_file" class="uploaded-file-info">
						<div class="file-card">
							<el-icon class="file-icon"><Document /></el-icon>
							<div class="file-details">
								<span class="file-name">{{ formFile.plan_file.name }}</span>
								<span class="file-size">{{ formatFileSize(formFile.plan_file.size) }}</span>
							</div>
							<div class="file-actions">
								<!-- <el-button link type="primary" @click="handleDownloadFile('plan', 'plan_file')">
									<el-icon><Download /></el-icon> 下载
								</el-button> -->
								<el-button link type="danger" @click="removeFile(uploadConfig.plan)">
									<el-icon><Delete /></el-icon> 删除
								</el-button>
							</div>
						</div>
					</div>

					<div v-if="planLoading" class="upload-loading">
						<el-icon class="is-loading"><Loading /></el-icon>
						<span>文件上传中...</span>
					</div>
				</el-form-item>

				<el-form-item label="功能测试数据汇总表：" prop="functionCollect" required v-if="form.type === 1">
					<el-upload
						ref="functionCollectRef"
						class="drag-upload-area"
						drag
						:auto-upload="false"
						:multiple="false"
						:show-file-list="false"
						accept=".xlsx"
						:on-change="(uploadFile, uploadFiles) => handleFileChange(uploadFile, uploadFiles, uploadConfig.functionCollect)"
						:disabled="functionCollectLoading"
					>
						<el-icon class="upload-icon"><UploadFilled /></el-icon>
						<div class="upload-text">
							将文件拖到此处，或 <em>点击上传</em>
						</div>
						<div class="upload-hint">
							仅支持格式：.xlsx，文件总大小不超过 {{ maxSize }}MB
						</div>
					</el-upload>

					<div v-if="formFile.functionCollect_file" class="uploaded-file-info">
						<div class="file-card">
							<el-icon class="file-icon"><Document /></el-icon>
							<div class="file-details">
								<span class="file-name">{{ formFile.functionCollect_file.name }}</span>
								<span class="file-size">{{ formatFileSize(formFile.functionCollect_file.size) }}</span>
							</div>
							<div class="file-actions">
								<!-- <el-button link type="primary" @click="handleDownloadFile('functionCollect', 'functionCollect_file')">
									<el-icon><Download /></el-icon> 下载
								</el-button> -->
								<el-button link type="danger" @click="removeFile(uploadConfig.functionCollect)">
									<el-icon><Delete /></el-icon> 删除
								</el-button>
							</div>
						</div>
					</div>

					<div v-if="functionCollectLoading" class="upload-loading">
						<el-icon class="is-loading"><Loading /></el-icon>
						<span>文件上传中...</span>
					</div>
				</el-form-item>

				<el-form-item label="性能测试数据汇总表：" prop="performanceCollect" required v-if="form.type === 1">
					<el-upload
						ref="performanceCollectRef"
						class="drag-upload-area"
						drag
						:auto-upload="false"
						:multiple="false"
						:show-file-list="false"
						accept=".xlsx"
						:on-change="(uploadFile, uploadFiles) => handleFileChange(uploadFile, uploadFiles, uploadConfig.performanceCollect)"
						:disabled="performanceCollectLoading"
					>
						<el-icon class="upload-icon"><UploadFilled /></el-icon>
						<div class="upload-text">
							将文件拖到此处，或 <em>点击上传</em>
						</div>
						<div class="upload-hint">
							仅支持格式：.xlsx，文件总大小不超过 {{ maxSize }}MB
						</div>
					</el-upload>

					<div v-if="formFile.performanceCollect_file" class="uploaded-file-info">
						<div class="file-card">
							<el-icon class="file-icon"><Document /></el-icon>
							<div class="file-details">
								<span class="file-name">{{ formFile.performanceCollect_file.name }}</span>
								<span class="file-size">{{ formatFileSize(formFile.performanceCollect_file.size) }}</span>
							</div>
							<div class="file-actions">
								<!-- <el-button link type="primary" @click="handleDownloadFile('performanceCollect', 'performanceCollect_file')">
									<el-icon><Download /></el-icon> 下载
								</el-button> -->
								<el-button link type="danger" @click="removeFile(uploadConfig.performanceCollect)">
									<el-icon><Delete /></el-icon> 删除
								</el-button>
							</div>
						</div>
					</div>

					<div v-if="performanceCollectLoading" class="upload-loading">
						<el-icon class="is-loading"><Loading /></el-icon>
						<span>文件上传中...</span>
					</div>
				</el-form-item>

				<el-form-item label="安全测试数据汇总表：" prop="secureCollect" required v-if="form.type === 1">
					<el-upload
						ref="secureCollectRef"
						class="drag-upload-area"
						drag
						:auto-upload="false"
						:multiple="false"
						:show-file-list="false"
						accept=".xlsx"
						:on-change="(uploadFile, uploadFiles) => handleFileChange(uploadFile, uploadFiles, uploadConfig.secureCollect)"
						:disabled="secureCollectLoading"
					>
						<el-icon class="upload-icon"><UploadFilled /></el-icon>
						<div class="upload-text">
							将文件拖到此处，或 <em>点击上传</em>
						</div>
						<div class="upload-hint">
							仅支持格式：.xlsx，文件总大小不超过 {{ maxSize }}MB
						</div>
					</el-upload>

					<div v-if="formFile.secureCollect_file" class="uploaded-file-info">
						<div class="file-card">
							<el-icon class="file-icon"><Document /></el-icon>
							<div class="file-details">
								<span class="file-name">{{ formFile.secureCollect_file.name }}</span>
								<span class="file-size">{{ formatFileSize(formFile.secureCollect_file.size) }}</span>
							</div>
							<div class="file-actions">
								<!-- <el-button link type="primary" @click="handleDownloadFile('secureCollect', 'secureCollect_file')">
									<el-icon><Download /></el-icon> 下载
								</el-button> -->
								<el-button link type="danger" @click="removeFile(uploadConfig.secureCollect)">
									<el-icon><Delete /></el-icon> 删除
								</el-button>
							</div>
						</div>
					</div>

					<div v-if="secureCollectLoading" class="upload-loading">
						<el-icon class="is-loading"><Loading /></el-icon>
						<span>文件上传中...</span>
					</div>
				</el-form-item>

				<el-form-item label="测试记录文档：" prop="testRecord" required v-if="form.type === 2">
					<el-upload
						ref="testRecordRef"
						class="drag-upload-area"
						drag
						:auto-upload="false"
						:multiple="false"
						:show-file-list="false"
						accept=".xlsx"
						:on-change="(uploadFile, uploadFiles) => handleFileChange(uploadFile, uploadFiles, uploadConfig.testRecord)"
						:disabled="testRecordLoading"
					>
						<el-icon class="upload-icon"><UploadFilled /></el-icon>
						<div class="upload-text">
							将文件拖到此处，或 <em>点击上传</em>
						</div>
						<div class="upload-hint">
							仅支持格式：.xlsx，文件总大小不超过 {{ maxSize }}MB
						</div>
					</el-upload>

					<div v-if="formFile.testRecord_file" class="uploaded-file-info">
						<div class="file-card">
							<el-icon class="file-icon"><Document /></el-icon>
							<div class="file-details">
								<span class="file-name">{{ formFile.testRecord_file.name }}</span>
								<span class="file-size">{{ formatFileSize(formFile.testRecord_file.size) }}</span>
							</div>
							<div class="file-actions">
								<!-- <el-button link type="primary" @click="handleDownloadFile('testRecord', 'testRecord_file')">
									<el-icon><Download /></el-icon> 下载
								</el-button> -->
								<el-button link type="danger" @click="removeFile(uploadConfig.testRecord)">
									<el-icon><Delete /></el-icon> 删除
								</el-button>
							</div>
						</div>
					</div>

					<div v-if="testRecordLoading" class="upload-loading">
						<el-icon class="is-loading"><Loading /></el-icon>
						<span>文件上传中...</span>
					</div>
				</el-form-item>

				<el-form-item label="问题单文档：" prop="troubleTicket" required v-if="form.type === 2 || form.type === 3">
					<el-upload
						ref="troubleTicketRef"
						class="drag-upload-area"
						drag
						:auto-upload="false"
						:multiple="false"
						:show-file-list="false"
						:accept="form.type === 2 ? '.xlsx' : '.docx'"
						:on-change="(uploadFile, uploadFiles) => handleFileChange(uploadFile, uploadFiles, uploadConfig.troubleTicket)"
						:disabled="troubleTicketLoading"
					>
						<el-icon class="upload-icon"><UploadFilled /></el-icon>
						<div class="upload-text">
							将文件拖到此处，或 <em>点击上传</em>
						</div>
						<div class="upload-hint">
							仅支持格式：{{ form.type === 2 ? '.xlsx' : '.docx' }}，文件总大小不超过 {{ maxSize }}MB
						</div>
					</el-upload>

					<div v-if="formFile.troubleTicket_file" class="uploaded-file-info">
						<div class="file-card">
							<el-icon class="file-icon"><Document /></el-icon>
							<div class="file-details">
								<span class="file-name">{{ formFile.troubleTicket_file.name }}</span>
								<span class="file-size">{{ formatFileSize(formFile.troubleTicket_file.size) }}</span>
							</div>
							<div class="file-actions">
								<!-- <el-button link type="primary" @click="handleDownloadFile('troubleTicket', 'troubleTicket_file')">
									<el-icon><Download /></el-icon> 下载
								</el-button> -->
								<el-button link type="danger" @click="removeFile(uploadConfig.troubleTicket)">
									<el-icon><Delete /></el-icon> 删除
								</el-button>
							</div>
						</div>
					</div>

					<div v-if="troubleTicketLoading" class="upload-loading">
						<el-icon class="is-loading"><Loading /></el-icon>
						<span>文件上传中...</span>
					</div>
				</el-form-item>

				<el-form-item label="资产收集表：" prop="assetFile" required v-if="form.type === 2">
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
					<el-button
						type="primary"
						@click="handleGenerate"
					>
						生成测试报告
					</el-button>
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

<script setup name="testReport">
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted, watch, onUnmounted, onActivated, onDeactivated, nextTick, computed } from 'vue';
import { timeFormatter } from '@/utils/day.js';
import { getList, downloadTemplateFile, generateTestReport, deleteReport } from '@/api/testReport';
import { getDocumentList } from '@/api/templateManagement';
import { uploadFile, deleteFile, getFileUrl, downloadFile } from '@/api/file';
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'

import { UploadFilled } from '@element-plus/icons-vue'

const isFirstActivated = ref(true)
const timer = ref(null)

const searchForm = reactive({
	name: '',
	status: '',
	type: ''
})
const statusOptions = ref([{
  value: 1,
	label: '完成',
	type: 'success'
}, {
  value: 2,
	label: '进行中',
	type: 'primary'
}, {
  value: 3,
	label: '失败',
	type: 'danger'
}])

const typeOptions = ref([{
  value: 1,
	label: '出厂/验收报告'
}, {
  value: 2,
	label: '入网安评'
}, {
  value: 3,
	label: '源码审计'
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
	type: 1,
	modelFile: '',
	commission: null,
	plan: null,
	functionCollect: null,
	performanceCollect: null,
	secureCollect: null,
	testRecord: null,
	troubleTicket: null,
	assetFile: null
})
const form = reactive({ ...initFormData() })
const formFile = reactive({
	commission_file: null,
	plan_file: null,
	functionCollect_file: null,
	performanceCollect_file: null,
	secureCollect_file: null,
	testRecord_file: null,
	troubleTicket_file: null,
	asset_file: null
})
const generateLoading = ref(false)
const documentList = ref([])
const maxSize = 100
const commissionRef = ref(null)
const planRef = ref(null)
const functionCollectRef = ref(null)
const performanceCollectRef = ref(null)
const secureCollectRef = ref(null)
const testRecordRef = ref(null)
const troubleTicketRef = ref(null)
const assetRef = ref(null)
const commissionLoading = ref(false)
const planLoading = ref(false)
const functionCollectLoading = ref(false)
const performanceCollectLoading = ref(false)
const secureCollectLoading = ref(false)
const testRecordLoading = ref(false)
const troubleTicketLoading = ref(false)
const assetLoading = ref(false)

const uploadConfig = {
	commission: {
		loadingRef: commissionLoading,
    fileKey: 'commission_file',
    formKey: 'commission',
    infoRef: commissionRef,
		accept: '.docx'
	},
	plan: {
		loadingRef: planLoading,
    fileKey: 'plan_file',
    formKey: 'plan',
    infoRef: planRef,
		accept: '.docx'
	},
	functionCollect: {
		loadingRef: functionCollectLoading,
    fileKey: 'functionCollect_file',
    formKey: 'functionCollect',
    infoRef: functionCollectRef,
		accept: '.xlsx'
	},
	performanceCollect: {
		loadingRef: performanceCollectLoading,
    fileKey: 'performanceCollect_file',
    formKey: 'performanceCollect',
    infoRef: performanceCollectRef,
		accept: '.xlsx'
	},
	secureCollect: {
		loadingRef: secureCollectLoading,
    fileKey: 'secureCollect_file',
    formKey: 'secureCollect',
    infoRef: secureCollectRef,
		accept: '.xlsx'
	},
	testRecord: {
		loadingRef: testRecordLoading,
    fileKey: 'testRecord_file',
    formKey: 'testRecord',
    infoRef: testRecordRef,
		accept: '.xlsx'
	},
	troubleTicket: {
		loadingRef: troubleTicketLoading,
    fileKey: 'troubleTicket_file',
    formKey: 'troubleTicket',
    infoRef: troubleTicketRef,
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
  type: [{ required: true, message: '请选择报告模板分类', trigger: 'change' }],
  modelFile: [{ required: true, message: '请选择文档模板', trigger: 'change' }],
  commission: [{ required: true, message: '请上传委托单文档', trigger: 'change' }],
  plan: [{ required: true, message: '请上传测试方案文档', trigger: 'change' }],
	functionCollect: [{ required: true, message: '请上传功能测试数据汇总表', trigger: 'change' }],
	performanceCollect: [{ required: true, message: '请上传性能测试数据汇总表', trigger: 'change' }],
	secureCollect: [{ required: true, message: '请上传安全测试数据汇总表', trigger: 'change' }],
  testRecord: [{ required: true, message: '请上传测试记录文档', trigger: 'change' }],
	troubleTicket: [{ required: true, message: '请上传问题单文档', trigger: 'change' }],
	assetFile: [{ required: true, message: '请上传资产收集表', trigger: 'change' }]
})

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
	const troubleTicketAccept = form.type === 2 ? '.xlsx' : '.docx'
	const accept = config.formKey === 'troubleTicket' ? troubleTicketAccept : config.accept
	console.log('accept', accept)
	if (!validateFile(file.raw, accept)) {
    if (config.infoRef.value) config.infoRef.value?.clearFiles()
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
			formRef.value?.clearValidate(config.formKey)
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
	form.type = 1
	form.modelFile = ''
})

const onSearch = () => {
	pagination.pageNum = 1
	getDataList()
}

const onReset = () => {
	searchForm.name = ''
	searchForm.status = ''
	searchForm.type = ''
	getDataList()
}

const getDataList = async () => {
	try {
    // 构造请求参数
    const params = {
			page: pagination.pageNum,
      page_size: pagination.pageSize,
			name: searchForm.name,
			status: searchForm.status,
			type: searchForm.type
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
    const res = await deleteReport(row.id)
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
	const params = { type: 2, status: 1, reportType: form.type, page: 1, page_size: 99999 }
	const res = await getDocumentList(params)
	if (res.code === 200) {
		documentList.value = res.data
	}
}

const handleModeChange = () => {
	form.modelFile = ''
	getDocument()
	Object.values(uploadConfig).forEach(config => {
		formFile[config.fileKey] = null
		form[config.formKey] = null
		if (config.infoRef?.value) {
			config.infoRef.value?.clearFiles()
		}
	})
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
			const nameList = ['功能测试数据汇总表模板', '性能测试数据汇总表模板', '安全测试数据汇总表模板', '入网安评测试问题集模板', '入网安评测试记录模板']
			const name = nameList[type - 1]
      const blob = new Blob([response.data], { type: contentType })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${name}.xlsx`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(link.href)
    }
  } catch (error) {
    ElMessage.error('服务异常！')
    console.error('下载异常：', error)
  }
}

const handleGenerate = async () => {
	if (!formRef) return
	try {
		await formRef.value.validate()
		generateLoading.value = true
		const data = JSON.parse(JSON.stringify(form))
		console.log('data', data)
		const res = await generateTestReport(data)
		if (res.code === 200) {
			generateLoading.value = false
			dialogVisible.value = false
			ElMessage.success('生成测试报告成功！')
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
.el-form--inline .el-form-item {
	margin-right: 20px;
}
.search-btn {
	margin-right: 0 !important;
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