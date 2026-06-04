<template>
  <el-dialog
    v-model="previewVisible"
    title="文档预览1"
    width="90%"
    :close-on-click-modal="false"
    append-to-body
    :lock-scroll="false"
    @open="handleDialogOpen"
    @close="handleDialogClose"
    class="file-preview-dialog"
  >
    <div
      v-loading="innerLoading"
      element-loading-text="文档加载中，请稍候..."
      class="file-container"
    >
      <VuePdfEmbed
        v-if="pdfBlobUrl"
        :source="pdfBlobUrl"
        :page="pageNum"
        :scale="0.8"
        @loaded="handleLoaded"
        @rendering-failed="handleError"
      />
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, nextTick, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import VuePdfEmbed from 'vue-pdf-embed'
import { getFileUrl } from '@/api/file'

const previewVisible = ref(false)
const innerLoading = ref(false)
const pdfBlobUrl = ref('')
let currentBlob = null
const pageNum = ref(null)

const handleDialogOpen = () => {
  document.body.style.overflow = 'hidden'
}

const handleDialogClose = () => {
  document.body.style.overflow = ''
  handlePreviewClose()
}

// 清理 PDF 资源
const handlePreviewClose = () => {
  if (pdfBlobUrl.value) {
    URL.revokeObjectURL(pdfBlobUrl.value)
    pdfBlobUrl.value = ''
  }
  if (currentBlob) {
    currentBlob = null
  }
  pageNum.value = null
  innerLoading.value = false
}

const handleLoaded = () => {
  innerLoading.value = false
  pageNum.value = null
}

// 加载失败
const handleError = (error) => {
  console.error('PDF 渲染失败', error)
  innerLoading.value = false
  ElMessage.error('PDF 预览失败，请检查文件')
  previewVisible.value = false
  handlePreviewClose()
}

// 预览文件
const previewFile = async (id) => {
  if (innerLoading.value) return

  // 如果已打开，先关闭并清理
  if (previewVisible.value) {
    handlePreviewClose()
    previewVisible.value = false
  }

  innerLoading.value = true
  previewVisible.value = true

  try {
    const res = await getFileUrl(id)
    const contentType = res.headers['content-type'] || res.headers['Content-Type']
    console.log('contentType', contentType)
    const blob = new Blob([res.data], { type: contentType })
    currentBlob = blob

    const blobUrl = URL.createObjectURL(blob)
    pdfBlobUrl.value = blobUrl

    await nextTick()
    // 组件会自动开始渲染，完成后触发 @loaded
  } catch (error) {
    console.error('获取文件失败', error)
    innerLoading.value = false
    ElMessage.error('预览失败')
    previewVisible.value = false
    handlePreviewClose()
  }
}

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  if (pdfBlobUrl.value) {
    URL.revokeObjectURL(pdfBlobUrl.value)
  }
  currentBlob = null
})

defineExpose({ previewFile })
</script>

<style lang="scss">
.file-preview-dialog {
  display: flex;
  flex-direction: column;
  height: 96vh;
  margin: 2vh auto !important;

  .el-dialog__body {
    flex: 1;
    overflow: hidden;
    min-height: 0;
    padding: 0;
  }
}

.file-container {
  height: 100%;
  overflow: auto;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px; /* 页与页之间间距 */
  padding: 16px;
}

.vue-pdf-embed {
  width: 100% !important;
  max-width: 1000px !important;
  height: auto !important;
}
</style>
