<template>
  <div class="container">
    <!-- 查询 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <div class="collapse_show_item">
        <el-form-item label="模板名称:" label-width="80px">
          <el-input
            v-model="searchForm.name"
            placeholder="方案名称"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="报告模板分类:" label-width="100px" v-if="searchForm.type === 2">
          <el-select
            v-model="searchForm.reportType"
            clearable
            placeholder="请选择报告模板分类"
            style="width: 200px"
          >
            <el-option
              v-for="item in REPORT_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="是否默认模板:" label-width="100px">
          <el-select v-model="searchForm.isDefault" placeholder="请选择是否默认模板" style="width: 200px">
						<el-option label="是" value=1></el-option>
						<el-option label="否" value=0></el-option>
					</el-select>
        </el-form-item> -->
        <el-form-item label="模板状态:" label-width="80px">
          <el-select v-model="searchForm.status" placeholder="请选择模板状态" style="width: 200px">
            <el-option label="正常" value="1"></el-option>
            <el-option label="失效" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="search-btn">
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </div>
    </el-form>

    <el-card>
      <div class="tabs-header-wrapper">
        <el-button type="primary" class="extra-button" @click="onAdd">{{
          searchForm.type === 1 ? '新增测试方案模板' : '新增测试报告模板'
        }}</el-button>

        <el-tabs v-model="searchForm.type" @tab-change="handleTabChange">
          <el-tab-pane label="测试方案模板" :name="1">
            <!-- 列表 -->
            <div>
              <el-table
                v-loading="loading"
                element-loading-text="拼命加载中"
                :data="tableData"
                :height="tableHeight"
                size="small"
                border
                style="width: 100%"
              >
                <el-table-column type="index" label="序号" width="60" align="center">
                </el-table-column>
                <el-table-column prop="name" label="模板名称" min-width="140" align="center">
                </el-table-column>
                <!-- <el-table-column
									prop="is_default"
									label="是否默认模板"
									width="180"
									align='center'>
									<template #default="scope">
										<el-switch
											:model-value="scope.row.is_default === 1"
											active-text="是"
    									inactive-text="否"
											@change="(value) => handleUpdate(value, scope.row, 'isDefault')"
										/>
									</template>
								</el-table-column>		 -->
                <el-table-column prop="status" label="模板状态" width="200" align="center">
                  <template #default="scope">
                    <el-select
                      :model-value="scope.row.status"
                      @change="(value) => handleUpdate(value, scope.row, 'status')"
                    >
                      <el-option label="正常" :value="1" />
                      <el-option label="失效" :value="2" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="created_at"
                  label="创建时间"
                  width="140"
                  :formatter="dayFormatter"
                  align="center"
                >
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="200" align="center">
                  <template v-slot="scope">
                    <el-button
                      @click="previewFile(scope.row.file_id)"
                      type="primary"
                      size="small"
                      :disabled="!scope.row.file_id"
                    >
                      预览
                    </el-button>
                    <el-button
                      @click="handleDownLoad(scope.row)"
                      type="success"
                      size="small"
                      :disabled="!scope.row.file_id"
                    >
                      下载
                    </el-button>
                    <el-button @click="handleDelete(scope.row)" type="danger" size="small">
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
                style="margin-top: 20px; text-align: right"
              >
              </el-pagination>
            </div>
          </el-tab-pane>

          <el-tab-pane label="测试报告模板" :name="2">
            <!-- 列表 -->
            <div>
              <el-table
                v-loading="loading"
                element-loading-text="拼命加载中"
                :data="tableData"
                :height="tableHeight"
                size="small"
                border
                style="width: 100%"
              >
                <el-table-column type="index" label="序号" width="60" align="center">
                </el-table-column>
                <el-table-column prop="name" label="模板名称" min-width="140" align="center">
                </el-table-column>
                <el-table-column prop="report_type" label="报告分类" width="140" align="center">
                  <template #default="scope">
                    {{
                      scope.row.report_type === 1
                        ? '出厂/验收报告'
                        : scope.row.is_type === 2
                          ? '入网安评'
                          : '源码审计'
                    }}
                  </template>
                </el-table-column>
                <!-- <el-table-column
									prop="is_default"
									label="是否默认模板"
									width="180"
									align='center'>
									<template #default="scope">
										<el-switch
											:model-value="scope.row.is_default === 1"
											active-text="是"
    									inactive-text="否"
											@change="(value) => handleUpdate(value, scope.row, 'isDefault')"
										/>
									</template>
								</el-table-column>		 -->
                <el-table-column prop="status" label="模板状态" width="180" align="center">
                  <template #default="scope">
                    <el-select
                      :model-value="scope.row.status"
                      @change="(value) => handleUpdate(value, scope.row, 'status')"
                    >
                      <el-option label="正常" :value="1" />
                      <el-option label="失效" :value="2" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="created_at"
                  label="创建时间"
                  width="140"
                  :formatter="dayFormatter"
                  align="center"
                >
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="200" align="center">
                  <template v-slot="scope">
                    <el-button
                      @click="previewFile(scope.row.file_id)"
                      type="primary"
                      size="small"
                      :disabled="!scope.row.file_id"
                    >
                      预览
                    </el-button>
                    <el-button
                      @click="handleDownLoad(scope.row)"
                      type="success"
                      size="small"
                      :disabled="!scope.row.file_id"
                    >
                      下载
                    </el-button>
                    <el-button @click="handleDelete(scope.row)" type="danger" size="small">
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
                style="margin-top: 20px; text-align: right"
              >
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

    <!-- 新增模板 -->
    <el-dialog
      v-model="dialogVisible"
      title="新增模板"
      width="48%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      destroy-on-close
      class="inner-scroll-dialog"
    >
      <el-form
        label-width="120px"
        :model="form"
        :rules="formRules"
        ref="formRef"
        v-loading="saveLoading"
        element-loading-text="新增模板中..."
      >
        <el-form-item label="模板归类：" prop="businessType" required>
          <el-radio-group v-model="form.businessType" disabled>
            <el-radio v-for="item in BUSINESS_TYPE_OPTIONS" :key="item.value" :value="item.value">{{
              item.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="报告模板归类："
          prop="reportType"
          required
          v-if="form.businessType === 2"
        >
          <el-radio-group v-model="form.reportType">
            <el-radio v-for="item in REPORT_TYPE_OPTIONS" :key="item.value" :value="item.value">{{
              item.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="模板名称：" prop="modelName" required>
          <el-input v-model="form.modelName" placeholder="模板名称"></el-input>
        </el-form-item>

        <el-form-item label="文档模板：" prop="modelFile" required>
          <el-upload
            ref="modelRef"
            class="drag-upload-area"
            drag
            :auto-upload="false"
            :multiple="false"
            :show-file-list="false"
            accept=".docx"
            :on-change="
              (uploadFile, uploadFiles) =>
                handleFileChange(uploadFile, uploadFiles, uploadConfig.modelFile)
            "
            :disabled="modelLoading"
          >
            <el-icon class="upload-icon"><UploadFilled /></el-icon>
            <div class="upload-text">将文件拖到此处，或 <em>点击上传</em></div>
            <div class="upload-hint">仅支持格式：.docx，文件总大小不超过 {{ maxSize }}MB</div>
          </el-upload>

          <div v-if="formFile.model_file" class="uploaded-file-info">
            <div class="file-card">
              <el-icon class="file-icon"><Document /></el-icon>
              <div class="file-details">
                <span class="file-name">{{ formFile.model_file.name }}</span>
                <span class="file-size">{{ formatFileSize(formFile.model_file.size) }}</span>
              </div>
              <div class="file-actions">
                <!-- <el-button link type="primary" @click="handleDownloadFile('modelFile', 'model_file')">
									<el-icon><Download /></el-icon> 下载
								</el-button> -->
                <el-button link type="danger" @click="removeFile(uploadConfig.modelFile)">
                  <el-icon><Delete /></el-icon> 删除
                </el-button>
              </div>
            </div>
          </div>

          <div v-if="modelLoading" class="upload-loading">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span>文件上传中...</span>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSave"> 保存 </el-button>
        </div>
      </template>
    </el-dialog>

    <filePreview ref="filePreviewRef" />
  </div>
</template>

<script setup name="templateManagement">
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted, watch, onUnmounted, onActivated, onDeactivated } from 'vue'
import { timeFormatter } from '@/utils/day.js'
import { REPORT_TYPE_OPTIONS, BUSINESS_TYPE_OPTIONS, TYPE_MAP } from '@/constants/common'
import {
  getDocumentList,
  uploadTemplateFile,
  addTemplate,
  updateTemplate,
} from '@/api/templateManagement'
import { uploadFile, deleteFile, getFileUrl, downloadFile } from '@/api/file'

import { UploadFilled } from '@element-plus/icons-vue'

import filePreview from '@/components/filePreview.vue'

const isFirstActivated = ref(true)
const timer = ref(null)

const searchForm = reactive({
  name: '',
  type: 1,
  isDefault: null,
  status: null,
  reportType: null,
})

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
  layout: 'total, sizes, prev, pager, next, ->, jumper',
})

const dialogVisible = ref(false)
const formRef = ref(null)
const initFormData = () => ({
  businessType: 1,
  reportType: null,
  modelName: '',
  modelFile: null,
})
const form = reactive({ ...initFormData() })
const formFile = reactive({
  model_file: null,
})
const saveLoading = ref(false)
const maxSize = 100
const modelRef = ref(null)
const modelLoading = ref(false)

const uploadConfig = {
  modelFile: {
    loadingRef: modelLoading,
    fileKey: 'model_file',
    formKey: 'modelFile',
    infoRef: modelRef,
    accept: '.docx',
  },
}

const currentAbortController = ref(null)

const formRules = reactive({
  reportType: [{ required: true, message: '请选择报告模板归类', trigger: 'change' }],
  modelName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  modelFile: [{ required: true, message: '请上传文档模板', trigger: 'change' }],
})

// 预览的文件数据
const filePreviewRef = ref(null)

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
  if (!validateFile(file.raw, config.accept)) {
    if (config.infoRef.value) config.infoRef.value.clearFiles()
    return
  }
  const controller = new AbortController()
  currentAbortController.value = controller
  formFile[config.fileKey] = null
  form[config.formKey] = null
  config.loadingRef.value = true
  try {
    const formData = new FormData()
    formData.append('file', file.raw)
    const res = await uploadTemplateFile(formData, { signal: controller.signal })
    if (res.code === 200) {
      form[config.formKey] = res.data?.attachmentId
      formFile[config.fileKey] = { name: file.raw.name, size: file.raw.size }
      formRef.value?.clearValidate(config.formKey)
      ElMessage.success('上传成功！')
    } else {
      ElMessage.error(res.message || '上传失败，请重新上传!')
    }
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      console.log('用户主动取消上传')
    } else {
      ElMessage.error('上传失败，请重新上传!')
    }
  } finally {
    config.loadingRef.value = false
    config.infoRef.value?.clearFiles()
    currentAbortController.value = null
  }
}

const handleDownloadFile = async (formKey, fileKey) => {
  const fileId = form[formKey]
  if (!fileId) {
    ElMessage.warning('文件链接不存在！')
    return
  }
  ElMessage.info(`文件正在下载中，请稍候！`)
  try {
    const response = await downloadFile(fileId)
    const contentType = response.headers['content-type']
    if (contentType.includes('application/json')) {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const jsonResponse = JSON.parse(reader.result)
          if (jsonResponse.code === 404) {
            ElMessage.warning(jsonResponse.message || '下载失败')
          } else {
            ElMessage.error(jsonResponse.message || '下载失败')
          }
        } catch (e) {
          ElMessage.error('解析响应失败')
        }
      }
      reader.readAsText(response.data)
    } else {
      const blob = new Blob([response.data])
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = formFile[fileKey].name
      link.click()
      URL.revokeObjectURL(link.href)
      ElMessage.success(`文件下载已触发，请在浏览器下载列表查看！`)
    }
  } catch (error) {
    console.log('error:', error)
    ElMessage.error('下载失败，请重试')
  }
}

const removeFile = async (config) => {
  if (!form?.[config.formKey]) {
    return
  }
  try {
    const res = await deleteFile({ attachmentId: form[config.formKey] })
    if (res.code === 200) {
      formFile[config.fileKey] = null
      form[config.formKey] = null
      config.infoRef.value?.clearFiles()
      ElMessage.success('文件删除成功')
    } else {
      ElMessage.error(res.message || '文件删除失败，请重试！')
    }
  } catch (_) {}
}

// 中断当前请求
const abortCurrentRequest = () => {
  if (currentAbortController.value) {
    currentAbortController.value.abort()
    currentAbortController.value = null
  }
}

const handleClose = async () => {
  if (modelLoading.value || saveLoading.value) {
    const message = modelLoading.value
      ? '文档模板正在上传中，确定要关闭吗？'
      : '新增模板中，确定要关闭吗？'
    try {
      await ElMessageBox.confirm(message, '提示', {
        confirmButtonText: '确定关闭',
        cancelButtonText: '继续等待',
        type: 'warning',
      })
      abortCurrentRequest()
      dialogVisible.value = false
    } catch {}
  } else {
    dialogVisible.value = false
  }
}

watch(dialogVisible, (newVal) => {
  if (!newVal && formRef.value) {
    formRef.value.resetFields()
  }
  formFile.model_file = null
  form.modelFile = null
  if (modelRef.value) {
    modelRef.value.value = ''
  }
})

const onSearch = () => {
  pagination.pageNum = 1
  getDataList()
}

const onReset = () => {
  searchForm.name = ''
  searchForm.isDefault = null
  searchForm.status = null
  searchForm.reportType = null
  getDataList()
}

const handleTabChange = (tabName) => {
  const search = {
    name: '',
    type: tabName,
    isDefault: null,
    status: null,
    reportType: null,
  }
  Object.assign(searchForm, search)
  pagination.pageNum = 1
  pagination.pageSize = 20
  getDataList()
}

const getDataList = async () => {
  try {
    const params = {
      page: pagination.pageNum,
      page_size: pagination.pageSize,
      ...searchForm,
    }
    // for (let i = 1; i <= 15; i++) {
    //   tableData.value.push({
    //     id: i,
    //     name: `用户${i}`,
    //     status: 2,
    //   })
    // }
    const res = await getDocumentList(params)
    if (res.code === 200) {
      tableData.value = res.data || []
      pagination.total = res.total_records || 0
    }
  } catch (error) {
    console.error('获取列表数据失败：', error)
    tableData.value = []
    pagination.total = 0
  }
}

// 日期转换
const dayFormatter = (row) => {
  return timeFormatter(row.created_at)
}

const handleUpdate = async (value, row, type) => {
  try {
    const params = { id: row.id }
    let oldValue = null
    if (type === 'isDefault') {
      params.isDefault = value ? 1 : 0
      oldValue = row.is_default ? 1 : 0
      if (oldValue === params.isDefault) return
      row.is_default = value ? 1 : 0
      params.status = row.status
    } else {
      params.status = value
      oldValue = row.status
      if (oldValue === value) return
      row.status = value
      params.isDefault = row.is_default ? 1 : 0
    }
    console.log('params', params)
    const res = await updateTemplate(params)
    if (res.code === 200) {
      ElMessage.success('更新成功！')
      getDataList()
    } else {
      row.is_default = oldValue
      ElMessage.error(res.message || '更新失败，请重试！')
    }
  } catch (_) {
    row.is_default = oldValue
    ElMessage.info('更新失败，请重试！')
  }
}

const previewFile = async (id) => {
  filePreviewRef.value?.openFilePreview(id)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定删除选中的模板数据吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const params = {
      id: row.id,
      isDefault: row.is_default,
      status: 0,
    }
    const res = await updateTemplate(params)
    if (res.code === 200) {
      ElMessage.success('删除成功！')
      getDataList()
    } else {
      ElMessage.error(res.message || '删除失败！')
    }
  } catch (error) {
    if (error === 'cancel') {
      ElMessage.info('已取消删除！')
    }
  }
}

const handleDownLoad = async (row) => {
  if (!row.file_id) {
    ElMessage.warning('文件链接不存在！')
    return
  }
  try {
    const response = await downloadFile(row.file_id)
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
      const typeKey = contentType.toLowerCase()
      const fileType = TYPE_MAP[typeKey]
      const blob = new Blob([response.data], { type: contentType })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${row.name}.${fileType}`
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

const onAdd = async () => {
  form.businessType = searchForm.type
  dialogVisible.value = true
}

const handleSave = async () => {
  if (!formRef) return
  try {
    await formRef.value.validate()
    const controller = new AbortController()
    currentAbortController.value = controller
    saveLoading.value = true
    const data = JSON.parse(JSON.stringify(form))
    if (data.businessType === 1) {
      delete data.reportType
    }
    const res = await addTemplate(data, { signal: controller.signal })
    if (res.code === 200) {
      dialogVisible.value = false
      ElMessage.success('模板新增成功！')
      getDataList()
    } else {
      ElMessage.error(res.message || '模板新增失败！')
    }
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      console.log('用户取消保存')
      return
    }
    console.error('表单校验失败：', error)
  } finally {
    saveLoading.value = false
    currentAbortController.value = null
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
  if (timer.value) return
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
  tableHeight.value = clientHeight - 374
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
  // border-bottom: 1px solid #cbd1dc;
  :deep(.el-input__inner) {
    height: 28px;
    line-height: 28px;
  }
}
.collapse_show_item {
  display: flex;
  // flex-wrap: wrap;
  align-items: center;
}

.el-form--inline .el-form-item {
  margin-right: 20px;
}

.search-btn {
  margin-left: auto;
  margin-right: 0 !important;
}

:deep(.el-tabs__header) {
  margin: 0;
}

.tabs-header-wrapper {
  position: relative;
}

.flex-tabs :deep(.el-tabs__header) {
  margin-right: 80px;
}

:deep(.el-tabs__content) {
  margin-top: 16px;
}

.extra-button {
  position: absolute;
  right: 0;
  top: 0px;
  z-index: 1;
}

// 弹窗内部滚动样式优化
:deep(.inner-scroll-dialog) {
  display: flex;
  flex-direction: column;
  max-height: 92vh;
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

.el-button.is-text {
  font-size: 16px;
  padding: 0px;
}
.el-button.is-text:hover {
  background-color: transparent !important;
}

.drag-upload-area {
  width: 50%;
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
